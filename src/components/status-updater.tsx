"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type Status = "PENDING" | "REVIEWING" | "ACCEPTED" | "REJECTED";

const statusLabels: Record<Status, string> = {
  PENDING: "Pending",
  REVIEWING: "Reviewing",
  ACCEPTED: "Accepted",
  REJECTED: "Rejected",
};

const statusColors: Record<Status, string> = {
  PENDING: "bg-yellow-100 text-yellow-700 border-yellow-200",
  REVIEWING: "bg-blue-100 text-blue-700 border-blue-200",
  ACCEPTED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-100 text-red-700 border-red-200",
};

type StatusUpdaterProps = {
  applicationId: string;
  currentStatus: Status;
};

export function StatusUpdater({ applicationId, currentStatus }: StatusUpdaterProps) {
  const router = useRouter();
  const [status, setStatus] = useState<Status>(currentStatus);
  const [loading, setLoading] = useState(false);

  const nextStatuses: Record<Status, Status[]> = {
    PENDING: ["REVIEWING"],
    REVIEWING: ["ACCEPTED", "REJECTED"],
    ACCEPTED: [],
    REJECTED: [],
  };

  async function updateStatus(newStatus: Status) {
    setLoading(true);
    try {
      const res = await fetch(`/api/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to update status");
      }

      setStatus(newStatus);
      router.refresh();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${statusColors[status]}`}>
        {statusLabels[status]}
      </span>
      {nextStatuses[status].length > 0 && (
        <div className="flex gap-1">
          {nextStatuses[status].map((next) => (
            <Button
              key={next}
              size="sm"
              variant="outline"
              className="h-7 text-xs"
              disabled={loading}
              onClick={() => updateStatus(next)}
            >
              {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : statusLabels[next]}
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}
