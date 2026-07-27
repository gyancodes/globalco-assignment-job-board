import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import { getGroq } from "@/lib/groq";
import { generateJobDescriptionSchema } from "@/lib/validations";

const GENERATE_SYSTEM_PROMPT = `You are an elite executive technical recruiter and professional copywriter at a top-tier Fortune 500 tech company. Your task is to generate a world-class, comprehensive, and highly engaging job posting based on the provided details.

Return a valid JSON object with this exact structure:
{
  "title": "The exact job title (professional and clear)",
  "company": "A realistic, modern company name in the relevant industry",
  "location": "City, State or City, Country",
  "locationType": "REMOTE" | "HYBRID" | "ON_SITE",
  "salaryMin": number or null (realistic annual salary in USD, e.g. 120000),
  "salaryMax": number or null (realistic annual salary in USD, e.g. 180000),
  "currency": "USD",
  "techSkills": ["array of 5-8 specific, modern technical skills and tools"],
  "visaSponsorship": boolean,
  "experienceLevel": "ENTRY" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE",
  "employmentType": "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE",
  "companySize": "1-10" | "11-50" | "51-200" | "201-500" | "500+",
  "aboutCompany": "A highly compelling, authentic 3-4 sentence company description highlighting mission, culture, and impact.",
  "description": "A detailed, beautifully written 4-5 paragraph job description. Must include an engaging hook, a summary of the role's impact, detailed responsibilities, and what success looks like in the first 90 days. Use a modern, inspiring, yet professional tone.",
  "benefits": ["array of 5-7 highly specific, premium modern benefits (e.g., '100% covered health/dental/vision', 'Generous equity package', 'Flexible PTO with mandatory minimums', 'Home office stipend')"],
  "interviewProcess": "A clear, respectful, and transparent 3-5 step interview process that respects the candidate's time."
}

Guidelines:
- Tone: Inspiring, professional, authentic, and modern. Avoid corporate jargon, cliches, or "ninja/rockstar" terminology.
- Description: Make it incredibly compelling. Candidates should read this and think "I need to work here." Clearly explain the *why* behind the role, not just the *what*.
- Realism: Salary ranges, company size, and location should make sense for the role's seniority and tech stack.
- Specificity: Tech skills must be specific (e.g., "React 18", "PostgreSQL", "AWS ECS" instead of just "Frontend" or "Database").
- Formatting: Ensure text fields are well-formatted and easy to read.`;

export async function POST(request: NextRequest) {
  try {
    await requireRole("RECRUITER");

    const body = await request.json();
    const data = generateJobDescriptionSchema.parse(body);

    const completion = await getGroq().chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: GENERATE_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Create a job description for:\nRole: ${data.role}\nExperience: ${data.experience}\nSkills: ${data.skills}`,
        },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    });

    const aiResponse = completion.choices[0]?.message?.content;

    if (!aiResponse) {
      return Response.json(
        { error: "AI failed to generate response" },
        { status: 500 }
      );
    }

    const parsed = JSON.parse(aiResponse);

    return Response.json({
      title: parsed.title ?? data.role,
      company: parsed.company ?? "",
      location: parsed.location ?? "",
      locationType: parsed.locationType ?? "ON_SITE",
      salaryMin: parsed.salaryMin ?? null,
      salaryMax: parsed.salaryMax ?? null,
      currency: parsed.currency ?? "USD",
      techSkills: Array.isArray(parsed.techSkills) ? parsed.techSkills : data.skills.split(",").map((s: string) => s.trim()),
      visaSponsorship: parsed.visaSponsorship ?? false,
      experienceLevel: parsed.experienceLevel ?? "MID",
      employmentType: parsed.employmentType ?? "FULL_TIME",
      companySize: parsed.companySize ?? "",
      aboutCompany: parsed.aboutCompany ?? "",
      description: parsed.description ?? "",
      benefits: parsed.benefits ?? [],
      interviewProcess: parsed.interviewProcess ?? "",
    });
  } catch (error) {
    return handleApiError(error);
  }
}
