import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building2, Briefcase } from "lucide-react";

type LocationType = "REMOTE" | "HYBRID" | "ON_SITE";
type EmploymentType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "FREELANCE";
type ExperienceLevel = "ENTRY" | "MID" | "SENIOR" | "LEAD" | "EXECUTIVE";

type JobCardProps = {
  id: string;
  title: string;
  company: string;
  location: string;
  locationType: LocationType;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  techSkills: string[];
  experienceLevel: ExperienceLevel;
  employmentType: EmploymentType;
  createdAt: Date;
  applicationCount: number;
};

const locationLabels: Record<LocationType, string> = {
  REMOTE: "Remote",
  HYBRID: "Hybrid",
  ON_SITE: "On-site",
};

const locationColors: Record<LocationType, string> = {
  REMOTE: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
  HYBRID: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
  ON_SITE: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
};

const expLevelLabel: Record<ExperienceLevel, string> = {
  ENTRY: "Entry",
  MID: "Mid",
  SENIOR: "Senior",
  LEAD: "Lead",
  EXECUTIVE: "Executive",
};

const empTypeLabel: Record<EmploymentType, string> = {
  FULL_TIME: "Full-time",
  PART_TIME: "Part-time",
  CONTRACT: "Contract",
  INTERNSHIP: "Internship",
  FREELANCE: "Freelance",
};

function formatSalary(min: number | null, max: number | null, currency: string): string | null {
  if (!min && !max) return null;
  const fmt = (n: number) => {
    if (n >= 1000) return `${currency === "USD" ? "$" : ""}${(n / 1000).toFixed(0)}k`;
    return `${n.toLocaleString()}`;
  };
  if (min && max) return `${fmt(min)} – ${fmt(max)}`;
  if (min) return `From ${fmt(min)}`;
  return `Up to ${fmt(max!)}`;
}

export function JobCard({
  id, title, company, location, locationType, salaryMin, salaryMax, currency,
  techSkills, experienceLevel, employmentType, createdAt, applicationCount,
}: JobCardProps) {
  const salary = formatSalary(salaryMin, salaryMax, currency);

  return (
    <Link
      href={`/jobs/${id}`}
      className="block rounded-xl border bg-card p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-semibold text-base group-hover:text-primary transition-colors truncate">
              {title}
            </h2>
            <Badge className={locationColors[locationType]}>{locationLabels[locationType]}</Badge>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Building2 className="h-3.5 w-3.5" />
              {company}
            </span>
            <span className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              {location}
            </span>
          </div>
        </div>
        <div className="shrink-0 text-right hidden sm:block">
          {salary && (
            <p className="text-sm font-semibold">{salary}</p>
          )}
          <p className="text-xs text-muted-foreground mt-0.5">
            <Clock className="h-3 w-3 inline mr-0.5" />
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5 mt-3">
        <Badge variant="outline" className="text-[11px]">
          {empTypeLabel[employmentType]}
        </Badge>
        <Badge variant="outline" className="text-[11px]">
          {expLevelLabel[experienceLevel]}
        </Badge>
        {techSkills.slice(0, 4).map((skill) => (
          <Badge key={skill} variant="secondary" className="text-[11px]">
            {skill}
          </Badge>
        ))}
        {techSkills.length > 4 && (
          <Badge variant="outline" className="text-[11px]">
            +{techSkills.length - 4}
          </Badge>
        )}
      </div>

      <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Briefcase className="h-3 w-3" />
          {applicationCount} applicant{applicationCount !== 1 ? "s" : ""}
        </span>
        <span className="sm:hidden">
          {salary && <span>{salary}</span>}
        </span>
      </div>
    </Link>
  );
}
