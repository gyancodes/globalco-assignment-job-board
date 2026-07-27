"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { Search, MapPin } from "lucide-react";

export function JobSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          name="query"
          placeholder="Search by title, company, or keyword..."
          defaultValue={searchParams.get("query") ?? ""}
          onChange={(e) => {
            router.push(`/jobs?${createQueryString("query", e.target.value)}`);
          }}
          className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
      <div className="relative sm:w-56">
        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <input
          name="location"
          placeholder="Filter by location..."
          defaultValue={searchParams.get("location") ?? ""}
          onChange={(e) => {
            router.push(
              `/jobs?${createQueryString("location", e.target.value)}`
            );
          }}
          className="w-full rounded-lg border border-border bg-background pl-9 pr-4 py-2 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </div>
    </div>
  );
}
