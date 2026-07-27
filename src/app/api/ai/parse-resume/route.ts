import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import { getGroq } from "@/lib/groq";

const PARSE_PROMPT = `You are an expert resume parser. Extract structured profile information from the resume text provided. Return ONLY a valid JSON object with this exact structure:

{
  "headline": "Current or most recent job title - if not found, derive the best professional title from the resume content",
  "location": "City, State or City, Country from the resume header",
  "bio": "A 2-3 sentence professional summary synthesizing the candidate's background, key skills, and career objectives",
  "skills": ["array of ALL technical and professional skills mentioned"],
  "experience": [
    {
      "title": "Job title",
      "company": "Company name",
      "location": "Job location if mentioned",
      "startDate": "Month YYYY or YYYY",
      "endDate": "Month YYYY or YYYY or empty string if current",
      "current": true or false,
      "description": "Brief 1-sentence description of responsibilities"
    }
  ],
  "education": [
    {
      "degree": "Degree name (e.g. B.S. Computer Science)",
      "school": "School name",
      "location": "School location if mentioned",
      "startYear": number or null,
      "endYear": number or null
    }
  ]
}

Guidelines:
- headline: Extract the most recent job title, or derive the best professional title if none found
- location: Look in the resume header near the name and contact info
- bio: Write a compelling professional summary synthesizing what the candidate has done
- skills: Extract EVERY skill mentioned — technologies, tools, frameworks, languages, methodologies, soft skills
- experience: Parse ALL work entries chronologically
- education: Parse ALL education entries
- If a section is truly empty, return an empty array
- Be thorough — do not miss any skills or experience entries`;

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const { resumeText } = await request.json();

    if (!resumeText) {
      return Response.json({ error: "resumeText is required" }, { status: 400 });
    }

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: PARSE_PROMPT },
        { role: "user", content: `Parse this resume and extract structured profile data:\n\n${resumeText}` },
      ],
      response_format: { type: "json_object" },
      temperature: 0.1,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return Response.json({ error: "AI failed to parse resume" }, { status: 500 });
    }

    const parsed = JSON.parse(aiResponse);

    return Response.json({
      headline: parsed.headline ?? "",
      location: parsed.location ?? "",
      bio: parsed.bio ?? "",
      skills: Array.isArray(parsed.skills) ? parsed.skills : [],
      experience: Array.isArray(parsed.experience) ? parsed.experience : [],
      education: Array.isArray(parsed.education) ? parsed.education : [],
    });
  } catch (error) {
    return handleApiError(error);
  }
}
