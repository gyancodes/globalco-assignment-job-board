import type { Role, ApplicationStatus, LocationType, EmploymentType, ExperienceLevel } from "@/generated/prisma/enums";

export type { Role, ApplicationStatus, LocationType, EmploymentType, ExperienceLevel };

export type Experience = {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
};

export type Education = {
  degree: string;
  school: string;
  location?: string;
  startYear?: number;
  endYear?: number;
};

export type UserProfile = {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  headline: string | null;
  location: string | null;
  bio: string | null;
  avatarUrl: string | null;
  skills: string[];
  experience: string | null;
  education: string | null;
  linkedInUrl: string | null;
  githubUrl: string | null;
  website: string | null;
  phone: string | null;
};

export type JobWithRelations = {
  id: string;
  title: string;
  description: string;
  company: string;
  location: string;
  locationType: LocationType;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  techSkills: string[];
  visaSponsorship: boolean;
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  companySize: string | null;
  aboutCompany: string | null;
  benefits: string | null;
  interviewProcess: string | null;
  recruiterId: string;
  recruiter: { id: string; fullName: string; email: string };
  applications: { id: string }[];
  createdAt: Date;
};

export type ApplicationWithRelations = {
  id: string;
  candidateId: string;
  candidate: { id: string; fullName: string; email: string };
  jobId: string;
  job: { id: string; title: string; company: string; location: string };
  status: ApplicationStatus;
  resumeUrl: string | null;
  createdAt: Date;
};

export type ResumeReviewResult = {
  score: number;
  summary: string;
  technicalSkills: string[];
  softSkills: string[];
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  atsScore: number;
  grammarSuggestions: string[];
  formattingSuggestions: string[];
  recommendations: string[];
  keywordDensity?: string[];
  impactScore?: number;
  roleSuggestions?: string[];
  quickWins?: string[];
};

export type GeneratedJobDescription = {
  title: string;
  company: string;
  location: string;
  locationType: "REMOTE" | "HYBRID" | "ON_SITE";
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  techSkills: string[];
  visaSponsorship: boolean;
  experienceLevel: "ENTRY" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE";
  employmentType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
  companySize: string;
  aboutCompany: string;
  description: string;
  benefits: string[];
  interviewProcess: string;
};

export type JobMatchResult = {
  overallScore: number;
  skillsScore: number;
  experienceScore: number;
  summary: string;
  matchingSkills: string[];
  missingSkills: string[];
  recommendations: string[];
};

export type ActionResponse<T = unknown> = {
  success: boolean;
  data?: T;
  error?: string;
};
