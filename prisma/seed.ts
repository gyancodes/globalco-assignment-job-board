import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("DATABASE_URL is required");
  process.exit(1);
}

const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function main() {
  const recruiter = await prisma.user.upsert({
    where: { email: "recruiter@test.com" },
    update: {},
    create: {
      email: "recruiter@test.com",
      fullName: "Test Recruiter",
      role: "RECRUITER",
    },
  });

  await prisma.user.upsert({
    where: { email: "candidate@test.com" },
    update: {},
    create: {
      email: "candidate@test.com",
      fullName: "Test Candidate",
      role: "CANDIDATE",
    },
  });

  await prisma.job.create({
    data: {
      title: "Senior Frontend Engineer",
      description:
        "We are looking for a senior frontend engineer to join our team.",
      company: "GlobalCo",
      location: "Remote",
      recruiterId: recruiter.id,
    },
  });

  await prisma.job.create({
    data: {
      title: "Backend Engineer",
      description: "Join our backend team to build scalable APIs.",
      company: "GlobalCo",
      location: "San Francisco, CA",
      recruiterId: recruiter.id,
    },
  });

  console.log("Database seeded successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
