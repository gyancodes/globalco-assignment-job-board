import { NextRequest } from "next/server";
import "dotenv/config";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";

const TEST_PASSWORD = "test123456";

async function createAuthUser(
  supabase: any,
  email: string,
  fullName: string,
  role: "CANDIDATE" | "RECRUITER"
) {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (error) {
    if (error.message.includes("already exists")) {
      const { data: list } = await supabase.auth.admin.listUsers();
      const existing = list?.users.find((u: { email: string }) => u.email === email);
      if (existing) return existing;
    }
    throw error;
  }

  return data.user;
}

export async function POST(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  const secret = process.env.SEED_SECRET;

  if (!secret || authHeader !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const prisma = new PrismaClient({
      adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
    });

    const users = [
      { email: "recruiter@test.com", fullName: "Sarah Chen", role: "RECRUITER" as const },
      { email: "candidate@test.com", fullName: "Alex Rivera", role: "CANDIDATE" as const },
    ];

    for (const u of users) {
      const authUser = await createAuthUser(supabase, u.email, u.fullName, u.role);

      await prisma.user.upsert({
        where: { id: authUser.id },
        update: { fullName: u.fullName, role: u.role },
        create: {
          id: authUser.id,
          email: u.email,
          fullName: u.fullName,
          role: u.role,
          headline: u.role === "RECRUITER" ? "Technical Recruiter at GlobalCo" : "Full-Stack Developer",
          location: "San Francisco, CA",
          bio:
            u.role === "RECRUITER"
              ? "Experienced technical recruiter passionate about connecting great talent with amazing opportunities."
              : "Passionate full-stack developer with experience in React, Node.js, and cloud technologies.",
          skills: u.role === "RECRUITER" ? [] : ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"],
        },
      });
    }

    const recruiter = await prisma.user.findFirstOrThrow({ where: { email: "recruiter@test.com" } });

    await prisma.job.deleteMany({ where: { recruiterId: recruiter.id } });

    await prisma.job.createMany({
      data: [
        {
          title: "Senior Frontend Engineer",
          description:
            "We are looking for a senior frontend engineer to lead our web application team. Build high-quality UIs with React, TypeScript, and modern CSS.\n\n**Requirements:**\n- 5+ years of frontend experience\n- Strong React, TypeScript, CSS\n- State management libraries\n- Testing frameworks",
          company: "GlobalCo",
          location: "San Francisco, CA",
          locationType: "HYBRID",
          salaryMin: 150000,
          salaryMax: 220000,
          currency: "USD",
          techSkills: ["React", "TypeScript", "Next.js", "Tailwind CSS", "GraphQL"],
          experienceLevel: "SENIOR",
          employmentType: "FULL_TIME",
          visaSponsorship: true,
          companySize: "201-500",
          aboutCompany: "GlobalCo is a leading technology company building the future of global commerce.",
          benefits: "Full health coverage, 401(k) matching, unlimited PTO, equity package",
          interviewProcess: "Phone screen → Technical → System design → Team fit",
          recruiterId: recruiter.id,
        },
        {
          title: "Backend Engineer",
          description:
            "Join our backend team to build scalable APIs and services. Work with Node.js, PostgreSQL, and cloud-native technologies.\n\n**Requirements:**\n- 3+ years backend experience\n- Node.js, TypeScript\n- SQL databases\n- REST API design\n- AWS/GCP",
          company: "GlobalCo",
          location: "Remote",
          locationType: "REMOTE",
          salaryMin: 130000,
          salaryMax: 190000,
          currency: "USD",
          techSkills: ["Node.js", "PostgreSQL", "TypeScript", "AWS", "Docker", "Redis"],
          experienceLevel: "MID",
          employmentType: "FULL_TIME",
          visaSponsorship: false,
          companySize: "201-500",
          aboutCompany: "GlobalCo is a leading technology company building the future of global commerce.",
          benefits: "Remote-first, competitive salary, equity, home office stipend",
          interviewProcess: "Phone screen → Coding challenge → Technical deep-dive → Final",
          recruiterId: recruiter.id,
        },
        {
          title: "Product Designer",
          description:
            "Craft intuitive and beautiful experiences for our users. Own the design process from research to high-fidelity mockups.\n\n**Requirements:**\n- 3+ years product design experience\n- Figma mastery\n- User research\n- Design systems",
          company: "GlobalCo",
          location: "San Francisco, CA",
          locationType: "ON_SITE",
          salaryMin: 120000,
          salaryMax: 180000,
          currency: "USD",
          techSkills: ["Figma", "Prototyping", "User Research", "Design Systems", "UI/UX"],
          experienceLevel: "MID",
          employmentType: "FULL_TIME",
          visaSponsorship: true,
          companySize: "201-500",
          aboutCompany: "GlobalCo is a leading technology company building the future of global commerce.",
          benefits: "Competitive salary, equity, creative studio environment",
          interviewProcess: "Portfolio review → Design exercise → Team session → Final",
          recruiterId: recruiter.id,
        },
      ],
    });

    await prisma.$disconnect();

    return Response.json({
      message: "Database seeded successfully",
      accounts: {
        recruiter: { email: "recruiter@test.com", password: TEST_PASSWORD },
        candidate: { email: "candidate@test.com", password: TEST_PASSWORD },
      },
    });
  } catch (error) {
    console.error("Seed error:", error);
    return Response.json({ error: "Seed failed" }, { status: 500 });
  }
}
