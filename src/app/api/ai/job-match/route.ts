import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { getGroq } from "@/lib/groq";

const MATCH_SYSTEM_PROMPT = `You are an expert technical recruiter evaluating how well a candidate fits a job. Analyze the candidate's profile against the job description and return a JSON object:

{
  "overallScore": number (0-100),
  "skillsScore": number (0-100),
  "experienceScore": number (0-100),
  "summary": "2-3 sentence personalized assessment",
  "matchingSkills": ["skills the candidate has that the job requires"],
  "missingSkills": ["skills the job requires that the candidate lacks"],
  "recommendations": ["2-3 specific actionable recommendations"]
}

Be honest and precise. Consider skills match, experience level, and overall fit.`;

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("CANDIDATE");

    const { jobId } = await request.json();

    if (!jobId) {
      return Response.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return Response.json({ error: "Job not found" }, { status: 404 });
    }

    const profile = await prisma.user.findUnique({ where: { id: user.id } });
    if (!profile) {
      return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    const candidateInfo = [
      `Headline: ${profile.headline ?? "N/A"}`,
      `Bio: ${profile.bio ?? "N/A"}`,
      `Skills: ${(profile.skills ?? []).join(", ")}`,
      profile.experience ? `Experience: ${profile.experience}` : "",
      profile.education ? `Education: ${profile.education}` : "",
    ].filter(Boolean).join("\n");

    const jobInfo = [
      `Title: ${job.title}`,
      `Description: ${job.description}`,
      `Required Skills: ${job.techSkills.join(", ")}`,
      `Experience Level: ${job.experienceLevel}`,
      `Location: ${job.location}`,
      `About Company: ${job.aboutCompany ?? "N/A"}`,
    ].join("\n");

    const prompt = `Evaluate this candidate against the job:

## Candidate Profile
${candidateInfo}

## Job Details
${jobInfo}

Return the match analysis as JSON.`;

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: MATCH_SYSTEM_PROMPT },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return Response.json({ error: "AI failed to generate match" }, { status: 500 });
    }

    const parsed = JSON.parse(aiResponse);

    return Response.json({
      overallScore: parsed.overallScore ?? 50,
      skillsScore: parsed.skillsScore ?? 50,
      experienceScore: parsed.experienceScore ?? 50,
      summary: parsed.summary ?? "",
      matchingSkills: parsed.matchingSkills ?? [],
      missingSkills: parsed.missingSkills ?? [],
      recommendations: parsed.recommendations ?? [],
    });
  } catch (error) {
    return handleApiError(error);
  }
}
