import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import { getPrisma } from "@/lib/prisma";
import { getGroq } from "@/lib/groq";

const REVIEW_SYSTEM_PROMPT = `You are a senior technical recruiter and career coach with 15+ years of experience. Analyze the provided resume thoroughly and return a JSON object with the following structure:

{
  "score": number (0-100, overall resume quality),
  "summary": string (3-4 sentence professional summary highlighting key strengths and areas for growth),
  "atsScore": number (0-100, how well it would perform with ATS systems),
  "technicalSkills": string[] (extracted technical skills from the resume),
  "softSkills": string[] (extracted soft skills from the resume),
  "strengths": string[] (5-8 specific strengths with context from the resume),
  "weaknesses": string[] (5-8 specific areas needing improvement with actionable detail),
  "missingSkills": string[] (important missing skills for modern job market),
  "grammarSuggestions": string[] (specific grammar, spelling, or phrasing issues found),
  "formattingSuggestions": string[] (layout, length, structure, and design recommendations),
  "recommendations": string[] (8-10 specific, actionable steps to improve the resume),
  "keywordDensity": string[] (keywords that should be added for better ATS performance),
  "impactScore": number (0-100, how well achievements are quantified with metrics),
  "roleSuggestions": string[] (3-5 roles this resume is best suited for),
  "quickWins": string[] (3-5 easiest improvements to make immediately)
}

Guidelines:
- Score based on: impact quantification (25%), keyword optimization (20%), formatting (15%), content quality (25%), ATS compatibility (15%)
- Be specific — reference actual content from the resume
- For weaknesses, explain WHY it's a problem and HOW to fix it
- For recommendations, prioritize by effort-to-impact ratio
- For keywordDensity, suggest industry-standard terms relevant to the candidate's field
- For roleSuggestions, match their experience to real job titles
- For quickWins, suggest the fastest impactful changes`;

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("CANDIDATE");

    const { resumeText, resumeUrl } = await request.json();

    if (!resumeText || !resumeText.trim()) {
      return Response.json(
        { error: "Resume text is required" },
        { status: 400 }
      );
    }

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: REVIEW_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Please analyze this resume thoroughly and provide detailed, actionable feedback:\n\n${resumeText}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return Response.json(
        { error: "AI failed to generate response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(aiResponse);

    const review = await getPrisma().resumeReview.create({
      data: {
        candidateId: user.id,
        resumeUrl: resumeUrl ?? "",
        score: parsed.score ?? 0,
        summary: parsed.summary ?? "",
        strengths: JSON.stringify(parsed.strengths ?? []),
        weaknesses: JSON.stringify(parsed.weaknesses ?? []),
        missingSkills: JSON.stringify(parsed.missingSkills ?? []),
        atsScore: parsed.atsScore ?? 0,
        aiResponse,
      },
    });

    return Response.json({
      id: review.id,
      score: parsed.score,
      summary: parsed.summary,
      technicalSkills: parsed.technicalSkills,
      softSkills: parsed.softSkills,
      strengths: parsed.strengths,
      weaknesses: parsed.weaknesses,
      missingSkills: parsed.missingSkills,
      atsScore: parsed.atsScore,
      grammarSuggestions: parsed.grammarSuggestions,
      formattingSuggestions: parsed.formattingSuggestions,
      recommendations: parsed.recommendations,
      keywordDensity: parsed.keywordDensity,
      impactScore: parsed.impactScore,
      roleSuggestions: parsed.roleSuggestions,
      quickWins: parsed.quickWins,
      createdAt: review.createdAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
