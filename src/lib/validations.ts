import { z } from "zod";

export const createJobSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(1, "Description is required"),
  company: z.string().min(1, "Company is required").max(200),
  location: z.string().min(1, "Location is required").max(200),
  locationType: z.enum(["REMOTE", "HYBRID", "ON_SITE"]).default("ON_SITE"),
  salaryMin: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().positive().optional()
  ).nullable(),
  salaryMax: z.preprocess(
    (v) => (v === "" || v === null || v === undefined ? undefined : Number(v)),
    z.number().int().positive().optional()
  ).nullable(),
  currency: z.string().default("USD"),
  techSkills: z.array(z.string()).default([]),
  visaSponsorship: z.preprocess(
    (v) => (v === "true" || v === true ? true : false),
    z.boolean()
  ).default(false),
  experienceLevel: z.enum(["ENTRY", "MID", "SENIOR", "LEAD", "EXECUTIVE"]).default("MID"),
  employmentType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP", "FREELANCE"]).default("FULL_TIME"),
  companySize: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().optional().nullable()
  ),
  aboutCompany: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().optional().nullable()
  ),
  benefits: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().optional().nullable()
  ),
  interviewProcess: z.preprocess(
    (v) => (v === "" ? null : v),
    z.string().optional().nullable()
  ),
});

export const updateJobSchema = createJobSchema.partial();

export const generateJobDescriptionSchema = z.object({
  role: z.string().min(1, "Role is required").max(200),
  experience: z.string().min(1, "Experience is required").max(100),
  skills: z.string().min(1, "Skills are required"),
});

export const applyJobSchema = z.object({
  jobId: z.string().min(1),
  resumeUrl: z.string().url().optional(),
});

export const searchJobsSchema = z.object({
  query: z.string().optional(),
  location: z.string().optional(),
});

export const updateProfileSchema = z.object({
  fullName: z.string().min(1).max(200).optional(),
  headline: z.string().max(200).optional().nullable(),
  location: z.string().max(200).optional().nullable(),
  bio: z.string().max(2000).optional().nullable(),
  skills: z.array(z.string()).optional(),
  experience: z.string().optional().nullable(),
  education: z.string().optional().nullable(),
  linkedInUrl: z.string().url().or(z.literal("")).optional().nullable(),
  githubUrl: z.string().url().or(z.literal("")).optional().nullable(),
  website: z.string().url().or(z.literal("")).optional().nullable(),
  phone: z.string().max(20).optional().nullable(),
});

export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobInput = z.infer<typeof updateJobSchema>;
export type GenerateJobDescriptionInput = z.infer<typeof generateJobDescriptionSchema>;
export type ApplyJobInput = z.infer<typeof applyJobSchema>;
export type SearchJobsInput = z.infer<typeof searchJobsSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
