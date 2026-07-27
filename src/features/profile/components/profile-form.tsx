"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Plus, X, Save, User, MapPin, Link2, Code, Briefcase, GraduationCap, Phone, Upload, Sparkles, CheckCircle } from "lucide-react";
import type { UserProfile, Experience, Education } from "@/types";

type ProfileFormProps = {
  profile: UserProfile;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [fullName, setFullName] = useState(profile.fullName);
  const [headline, setHeadline] = useState(profile.headline ?? "");
  const [location, setLocation] = useState(profile.location ?? "");
  const [bio, setBio] = useState(profile.bio ?? "");
  const [phone, setPhone] = useState(profile.phone ?? "");
  const [linkedInUrl, setLinkedInUrl] = useState(profile.linkedInUrl ?? "");
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl ?? "");
  const [website, setWebsite] = useState(profile.website ?? "");

  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(profile.skills ?? []);
  const [experiences, setExperiences] = useState<Experience[]>(
    profile.experience ? JSON.parse(profile.experience) : []
  );
  const [educationList, setEducationList] = useState<Education[]>(
    profile.education ? JSON.parse(profile.education) : []
  );

  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsed, setParsed] = useState(false);

  function addSkill() {
    const s = skillInput.trim();
    if (s && !skills.includes(s)) {
      setSkills((prev) => [...prev, s]);
      setSkillInput("");
    }
  }

  function removeSkill(s: string) {
    setSkills((prev) => prev.filter((x) => x !== s));
  }

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setParsed(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const extractRes = await fetch("/api/ai/extract-text", {
        method: "POST",
        body: formData,
      });

      if (!extractRes.ok) {
        const err = await extractRes.json();
        throw new Error(err.error || "Failed to extract text");
      }

      const { text } = await extractRes.json();

      setParsing(true);

      const parseRes = await fetch("/api/ai/parse-resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeText: text }),
      });

      if (!parseRes.ok) {
        const err = await parseRes.json();
        throw new Error(err.error || "Failed to parse resume");
      }

      const data = await parseRes.json();

      if (data.headline) setHeadline(data.headline);
      if (data.location) setLocation(data.location);
      if (data.bio) setBio(data.bio);
      if (data.skills?.length) {
        setSkills((prev) => {
          const existing = new Set(prev);
          return [...prev, ...data.skills.filter((s: string) => !existing.has(s))];
        });
      }
      if (data.experience?.length) setExperiences(data.experience);
      if (data.education?.length) setEducationList(data.education);

      setParsed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to process resume");
    } finally {
      setUploading(false);
      setParsing(false);
      const input = document.getElementById("resume-upload") as HTMLInputElement;
      if (input) input.value = "";
    }
  }, []);

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          headline: headline || null,
          location: location || null,
          bio: bio || null,
          phone: phone || null,
          skills,
          linkedInUrl: linkedInUrl || null,
          githubUrl: githubUrl || null,
          website: website || null,
          experience: experiences.length ? JSON.stringify(experiences) : null,
          education: educationList.length ? JSON.stringify(educationList) : null,
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to save");
      }
      setSuccess(true);
      router.refresh();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  const isCandidate = profile.role === "CANDIDATE";

  return (
    <div className="w-full space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 p-4 text-sm text-destructive font-medium">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg bg-chart-2/10 border border-chart-2/20 p-4 text-sm text-[rgb(var(--chart-2))] font-medium flex items-center gap-2">
          <Save className="h-4 w-4" />
          Profile saved successfully
        </div>
      )}
      {parsed && (
        <div className="rounded-lg bg-chart-1/10 border border-chart-1/20 p-4 text-sm text-[rgb(var(--chart-1))] font-medium flex items-center gap-2">
          <CheckCircle className="h-4 w-4" />
          Resume parsed successfully — review and edit the fields below, then save
        </div>
      )}

      {isCandidate && (
        <Card className="border-dashed border-2 border-primary/20 bg-primary/[0.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Upload className="h-4 w-4 text-primary" />
              Import from Resume
            </CardTitle>
            <CardDescription>
              Upload your resume (PDF) and we&apos;ll automatically extract your skills, experience, education, and more
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <label className="flex items-center gap-3 px-5 py-3 rounded-xl border-2 border-dashed border-input hover:border-primary/40 cursor-pointer transition-all bg-muted/20 hover:bg-muted/40 flex-1 w-full sm:w-auto">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  {uploading || parsing ? (
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  ) : (
                    <Upload className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-medium">
                    {uploading ? "Uploading..." : parsing ? "Analyzing..." : "Choose PDF Resume"}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {uploading || parsing ? "Please wait..." : "Supports .pdf files up to 10MB"}
                  </p>
                </div>
                <input id="resume-upload" type="file" accept=".pdf,application/pdf" onChange={handleFileUpload} className="hidden" disabled={uploading || parsing} />
              </label>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <User className="h-4 w-4 text-primary" />
            Basic Information
          </CardTitle>
          <CardDescription>Your name, title, and contact details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <input value={fullName} onChange={(e) => setFullName(e.target.value)}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1 (555) 123-4567"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Professional Headline</label>
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input value={headline} onChange={(e) => setHeadline(e.target.value)}
                placeholder={isCandidate ? "e.g. Senior Frontend Engineer at Acme" : "e.g. Technical Recruiter at Acme"}
                className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Location</label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input value={location} onChange={(e) => setLocation(e.target.value)} placeholder="San Francisco, CA"
                className="flex h-10 w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4}
              placeholder={isCandidate ? "Tell employers about yourself, your passion, and what you're looking for..." : "Tell candidates about your recruiting experience and what you look for in talent..."}
              className="flex min-h-[100px] w-full rounded-lg border border-input bg-background px-3 py-2 text-sm resize-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium flex items-center gap-1.5"><Link2 className="h-4 w-4 text-muted-foreground" /> Links</label>
            <div className="grid sm:grid-cols-3 gap-3">
              <input value={linkedInUrl} onChange={(e) => setLinkedInUrl(e.target.value)} placeholder="LinkedIn URL"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input value={githubUrl} onChange={(e) => setGithubUrl(e.target.value)} placeholder="GitHub URL"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
              <input value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL"
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {isCandidate && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Code className="h-4 w-4 text-primary" />
                Skills
              </CardTitle>
              <CardDescription>Technical skills and technologies you work with</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex gap-2">
                <input value={skillInput} onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                  className="flex h-10 flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Type a skill and press Enter"
                />
                <Button type="button" variant="outline" onClick={addSkill} className="shrink-0">
                  <Plus className="h-4 w-4" /> Add
                </Button>
              </div>
              {skills.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((s) => (
                    <Badge key={s} variant="secondary" className="gap-1 pr-1">
                      {s}
                      <button type="button" onClick={() => removeSkill(s)} className="ml-0.5 hover:text-foreground transition-colors">
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <Briefcase className="h-4 w-4 text-primary" />
                Experience
              </CardTitle>
              <CardDescription>Your work history</CardDescription>
            </CardHeader>
            <CardContent>
              {experiences.length === 0 ? (
                <p className="text-sm text-muted-foreground">No experience added yet. Upload your resume above to auto-populate.</p>
              ) : (
                <div className="space-y-4">
                  {experiences.map((exp, i) => (
                    <div key={i} className="flex gap-3 pb-4 border-b border-border/50 last:border-0">
                      <div className="w-2 h-2 rounded-full bg-primary/40 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{exp.title}</p>
                        <p className="text-xs text-muted-foreground">{exp.company}{exp.location ? ` \u00b7 ${exp.location}` : ""}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {exp.startDate}{exp.endDate ? ` - ${exp.endDate}` : exp.current ? " - Present" : ""}
                        </p>
                        {exp.description && <p className="text-xs text-muted-foreground mt-1">{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <GraduationCap className="h-4 w-4 text-primary" />
                Education
              </CardTitle>
              <CardDescription>Your academic background</CardDescription>
            </CardHeader>
            <CardContent>
              {educationList.length === 0 ? (
                <p className="text-sm text-muted-foreground">No education added yet. Upload your resume above to auto-populate.</p>
              ) : (
                <div className="space-y-4">
                  {educationList.map((edu, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="w-2 h-2 rounded-full bg-chart-4/40 mt-1.5 shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{edu.degree}</p>
                        <p className="text-xs text-muted-foreground">{edu.school}{edu.location ? ` \u00b7 ${edu.location}` : ""}</p>
                        {edu.startYear && <p className="text-xs text-muted-foreground mt-0.5">{edu.startYear}{edu.endYear ? ` - ${edu.endYear}` : ""}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} className="px-8">
          {saving && <Loader2 className="h-4 w-4 animate-spin" />}
          {saving ? "Saving..." : "Save Profile"}
        </Button>
      </div>
    </div>
  );
}
