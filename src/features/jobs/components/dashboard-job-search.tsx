"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useTransition } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";

export function DashboardJobSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const createQueryString = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString());
      // Reset to page 1 whenever search changes
      params.delete("page");
      for (const [name, value] of Object.entries(updates)) {
        if (value) {
          params.set(name, value);
        } else {
          params.delete(name);
        }
      }
      return params.toString();
    },
    [searchParams]
  );

  function navigate(updates: Record<string, string>) {
    startTransition(() => {
      router.push(`/dashboard/browse?${createQueryString(updates)}`);
    });
  }

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          name="query"
          placeholder="Search by title, company, or skill..."
          defaultValue={searchParams.get("query") ?? ""}
          onChange={(e) => navigate({ query: e.target.value })}
          className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        {isPending && (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 animate-spin text-muted-foreground" />
        )}
      </div>
      <div className="relative sm:w-52">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          name="location"
          placeholder="Filter by location..."
          defaultValue={searchParams.get("location") ?? ""}
          onChange={(e) => navigate({ location: e.target.value })}
          className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}
