import { NextRequest } from "next/server";
import { requireRole } from "@/lib/auth";
import { handleApiError } from "@/lib/api-error";
import { getGroq } from "@/lib/groq";
import { generateJobDescriptionSchema } from "@/lib/validations";

const GENERATE_SYSTEM_PROMPT = `You are an expert senior technical recruiter and job description writer at a top-tier tech company. Generate a comprehensive, professional job posting based on the provided details.

Return a valid JSON object with this exact structure:
{
  "title": "The exact job title",
  "company": "A realistic company name in the relevant industry",
  "location": "City, State or City, Country",
  "locationType": "REMOTE" | "HYBRID" | "ON_SITE",
  "salaryMin": number or null (annual salary in USD),
  "salaryMax": number or null (annual salary in USD),
  "currency": "USD",
  "techSkills": ["array of required technical skills"],
  "visaSponsorship": boolean,
  "experienceLevel": "ENTRY" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE",
  "employmentType": "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE",
  "companySize": "1-10" | "11-50" | "51-200" | "201-500" | "500+",
  "aboutCompany": "A compelling 2-3 sentence company description highlighting mission and culture",
  "description": "A detailed 3-5 paragraph job description covering role overview, responsibilities, who you are, and why join",
  "benefits": ["array of 4-6 specific benefits like health insurance, equity, remote stipend, 401k, PTO"],
  "interviewProcess": "Clear step-by-step interview process description"
}

Guidelines:
- Write compelling, specific, and authentic content — avoid generic buzzwords
- Description should be comprehensive: role overview, key responsibilities, qualifications, and what makes this opportunity unique
- Salary ranges should be realistic for the role and experience level
- Tech skills should be specific technologies, frameworks, and tools (not generic like "strong communication")
- Benefits should be concrete and modern (equity, learning budget, flexible hours, etc.)
- Interview process should be 3-5 clear steps`;

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
