import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";

export function GhostJobCard() {
  return (
    <div className="relative block rounded-xl border bg-card/50 p-5 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80 z-10" />
      <div className="absolute inset-0 backdrop-blur-[2px] z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center h-full min-h-[200px] gap-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <Lock className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-center">Sign in to see more jobs</p>
        <p className="text-xs text-muted-foreground text-center max-w-[200px]">
          Create an account to browse all available positions and apply.
        </p>
        <Button size="sm" asChild className="mt-1">
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
      <div className="space-y-3 mt-2 opacity-30">
        <div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
        <div className="flex gap-2 mt-3">
          <div className="h-5 w-16 rounded-full bg-muted animate-pulse" />
          <div className="h-5 w-20 rounded-full bg-muted animate-pulse" />
          <div className="h-5 w-14 rounded-full bg-muted animate-pulse" />
        </div>
        <div className="h-5 w-1/3 rounded bg-muted animate-pulse" />
      </div>
    </div>
  );
}
