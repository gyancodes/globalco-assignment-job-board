import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import { prisma } from "@/lib/prisma";
import { getGroq } from "@/lib/groq";

const REVIEW_SYSTEM_PROMPT = `You are an expert resume reviewer. Analyze the resume text provided and return a JSON object with the following structure:
{
  "score": number (0-100),
  "summary": string (2-3 sentence professional summary),
  "technicalSkills": string[],
  "softSkills": string[],
  "strengths": string[],
  "weaknesses": string[],
  "missingSkills": string[],
  "atsScore": number (0-100),
  "grammarSuggestions": string[],
  "formattingSuggestions": string[],
  "recommendations": string[]
}

Be thorough and honest in your assessment. Focus on actionable feedback.`;

export async function POST(request: NextRequest) {
  try {
    const user = await requireRole("CANDIDATE");

    const { resumeText, resumeUrl } = await request.json();

    if (!resumeText) {
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
          content: `Please analyze this resume:\n\n${resumeText}`,
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

    const review = await prisma.resumeReview.create({
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
      createdAt: review.createdAt,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
