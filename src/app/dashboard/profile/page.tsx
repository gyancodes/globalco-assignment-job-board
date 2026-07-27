import { currentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getPrisma } from "@/lib/prisma";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { MapPin, Link as LinkIcon, Globe, ExternalLink, Phone, Mail } from "lucide-react";
import Link from "next/link";

type ExperienceItem = {
  title: string;
  company: string;
  location?: string;
  startDate: string;
  endDate?: string;
  current?: boolean;
  description?: string;
};

type EducationItem = {
  degree: string;
  school: string;
  location?: string;
  startYear?: string;
  endYear?: string;
};

export default async function ProfilePage() {
  const authUser = await currentUser();
  if (!authUser) redirect("/sign-in");

  const profile = await getPrisma().user.findUnique({ where: { id: authUser.id } });
  if (!profile) redirect("/dashboard");

  const isCandidate = profile.role === "CANDIDATE";

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Profile</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage your professional profile</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="h-32 sm:h-40 bg-gradient-to-r from-primary/5 via-chart-4/5 to-chart-2/5" />
        <div className="px-6 sm:px-8 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 -mt-10 sm:-mt-12">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl border-2 border-background bg-muted flex items-center justify-center shrink-0 shadow-md">
              <span className="text-2xl sm:text-3xl font-bold text-foreground/70">
                {profile.fullName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </span>
            </div>
            <div className="flex-1 pt-2 sm:pt-0 sm:pb-1">
              <h2 className="text-xl font-bold">{profile.fullName}</h2>
              {profile.headline && <p className="text-sm text-muted-foreground">{profile.headline}</p>}
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5 text-xs text-muted-foreground">
                {profile.location && (
                  <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{profile.location}</span>
                )}
                <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{profile.email}</span>
                {profile.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{profile.phone}</span>}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {profile.linkedInUrl && (
                  <Link href={profile.linkedInUrl} target="_blank" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <LinkIcon className="h-3 w-3" /> LinkedIn
                  </Link>
                )}
                {profile.githubUrl && (
                  <Link href={profile.githubUrl} target="_blank" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <ExternalLink className="h-3 w-3" /> GitHub
                  </Link>
                )}
                {profile.website && (
                  <Link href={profile.website} target="_blank" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors">
                    <Globe className="h-3 w-3" /> Website
                  </Link>
                )}
              </div>
            </div>
          </div>

          {profile.bio && (
            <div className="mt-5 pt-5 border-t border-border/50">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">About</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
            </div>
          )}

          {isCandidate && profile.skills && profile.skills.length > 0 && (
            <div className="mt-5 pt-5 border-t border-border/50">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Skills</h3>
              <div className="flex flex-wrap gap-1.5">
                {profile.skills.map((s) => (
                  <span key={s} className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.experience && (() => {
            const exp = JSON.parse(profile.experience);
            if (!exp.length) return null;
            return (
              <div className="mt-5 pt-5 border-t border-border/50">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Experience</h3>
                <div className="space-y-4">
                  {exp.map((e: ExperienceItem, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary/30 mt-1.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{e.title}</p>
                        <p className="text-xs text-muted-foreground">{e.company}{e.location ? ` \u00b7 ${e.location}` : ""}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{e.startDate}{e.endDate ? ` - ${e.endDate}` : e.current ? " - Present" : ""}</p>
                        {e.description && <p className="text-xs text-muted-foreground mt-1">{e.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {profile.education && (() => {
            const edu = JSON.parse(profile.education);
            if (!edu.length) return null;
            return (
              <div className="mt-5 pt-5 border-t border-border/50">
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Education</h3>
                <div className="space-y-4">
                  {edu.map((e: EducationItem, i: number) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-chart-4/30 mt-1.5 shrink-0" />
                      <div>
                        <p className="font-medium text-sm">{e.degree}</p>
                        <p className="text-xs text-muted-foreground">{e.school}{e.location ? ` \u00b7 ${e.location}` : ""}</p>
                        {e.startYear && <p className="text-xs text-muted-foreground mt-0.5">{e.startYear}{e.endYear ? ` - ${e.endYear}` : ""}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}
        </div>
      </div>

      <ProfileForm profile={{
        id: profile.id,
        email: profile.email,
        fullName: profile.fullName,
        role: profile.role as "CANDIDATE" | "RECRUITER",
        headline: profile.headline,
        location: profile.location,
        bio: profile.bio,
        avatarUrl: profile.avatarUrl,
        skills: profile.skills,
        experience: profile.experience,
        education: profile.education,
        linkedInUrl: profile.linkedInUrl,
        githubUrl: profile.githubUrl,
        website: profile.website,
        phone: profile.phone,
      }} />
    </div>
  );
}
