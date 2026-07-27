import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { createClient } from "@supabase/supabase-js";

const TEST_PASSWORD = "test123456";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
  process.exit(1);
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

async function createAuthUser(email: string, password: string, fullName: string, role: "CANDIDATE" | "RECRUITER") {
  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name: fullName, role },
  });

  if (error) {
    if (error.message.includes("already exists")) {
      const { data: existing } = await supabase.auth.admin.listUsers();
      const user = existing?.users.find((u) => u.email === email);
      if (user) return user;
    }
    throw error;
  }

  return data.user;
}

async function main() {
  const users = [
    { email: "recruiter@test.com", fullName: "Sarah Chen", role: "RECRUITER" as const },
    { email: "candidate@test.com", fullName: "Alex Rivera", role: "CANDIDATE" as const },
  ];

  for (const u of users) {
    const authUser = await createAuthUser(u.email, TEST_PASSWORD, u.fullName, u.role);

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
            : "Passionate full-stack developer with experience in React, Node.js, and cloud technologies. Love building products that make a difference.",
        skills: u.role === "RECRUITER" ? [] : ["React", "TypeScript", "Node.js", "PostgreSQL", "Docker", "AWS"],
      },
    });
  }

  const recruiter = await prisma.user.findFirstOrThrow({ where: { email: "recruiter@test.com" } });

  const jobs = [
    {
      title: "Senior Frontend Engineer",
      description:
        "We are looking for a senior frontend engineer to lead our web application team. You will be responsible for building and maintaining high-quality user interfaces using React, TypeScript, and modern CSS. You'll work closely with designers and backend engineers to deliver exceptional user experiences.\n\n**Requirements:**\n- 5+ years of frontend development experience\n- Strong proficiency in React, TypeScript, and CSS\n- Experience with state management libraries\n- Familiarity with testing frameworks\n- Excellent communication skills",
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
      aboutCompany:
        "GlobalCo is a leading technology company building the future of global commerce. We serve millions of users worldwide and are backed by top-tier investors.",
      benefits:
        "Competitive salary, equity package, 401(k) matching, health/dental/vision insurance, unlimited PTO, remote-friendly, annual learning budget, gym membership",
      interviewProcess: "Phone screen (30 min) → Technical interview (1 hr) → System design (1 hr) → Team fit (45 min)",
    },
    {
      title: "Backend Engineer",
      description:
        "Join our backend team to build scalable APIs and services that power our global platform. You'll work with Node.js, PostgreSQL, and cloud-native technologies to solve challenging distributed systems problems.\n\n**Requirements:**\n- 3+ years of backend development experience\n- Strong proficiency in Node.js or similar\n- Experience with SQL databases\n- Understanding of RESTful API design\n- Knowledge of cloud services (AWS/GCP)",
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
      aboutCompany:
        "GlobalCo is a leading technology company building the future of global commerce.",
      benefits:
        "Competitive salary, equity, full benefits, remote-first culture, annual retreat, home office stipend",
      interviewProcess: "Phone screen → Coding challenge (async) → Technical deep-dive → Final round",
    },
    {
      title: "Product Designer",
      description:
        "We are looking for a product designer to craft intuitive and beautiful experiences for our users. You will own the design process from research to high-fidelity mockups.\n\n**Requirements:**\n- 3+ years of product design experience\n- Proficiency in Figma and prototyping tools\n- User research experience\n- Strong visual design skills\n- Design system experience",
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
      aboutCompany:
        "GlobalCo is a leading technology company building the future of global commerce.",
      benefits:
        "Competitive salary, equity, full benefits, creative studio environment, learning budget",
      interviewProcess: "Portfolio review → Design exercise → Team collaboration session → Final review",
    },
  ];

  for (const job of jobs) {
    await prisma.job.create({
      data: { ...job, recruiterId: recruiter.id },
    });
  }

  console.log("Database seeded successfully");
  console.log("\nTest Accounts:");
  console.log("  Recruiter: recruiter@test.com / test123456");
  console.log("  Candidate: candidate@test.com / test123456");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
