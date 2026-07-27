"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Briefcase, User, Loader2 } from "lucide-react";

type RoleSwitcherProps = {
  currentRole: "CANDIDATE" | "RECRUITER";
};

export function RoleSwitcher({ currentRole }: RoleSwitcherProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggleRole() {
    setLoading(true);
    const newRole = currentRole === "CANDIDATE" ? "RECRUITER" : "CANDIDATE";

    try {
      const res = await fetch("/api/user/role", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) return;

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={toggleRole}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-lg border bg-card px-3 py-1.5 text-xs font-medium hover:bg-muted transition-colors disabled:opacity-50"
      title="Switch role"
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : currentRole === "RECRUITER" ? (
        <>
          <User className="h-3.5 w-3.5" />
          Switch to Candidate
        </>
      ) : (
        <>
          <Briefcase className="h-3.5 w-3.5" />
          Switch to Recruiter
        </>
      )}
    </button>
  );
}
