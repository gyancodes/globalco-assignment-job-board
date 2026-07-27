import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

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

  const candidate = await prisma.user.upsert({
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
