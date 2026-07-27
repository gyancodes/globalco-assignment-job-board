import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

type PaginationProps = {
  currentPage: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string>;
};

export function Pagination({ currentPage, totalPages, basePath, searchParams = {} }: PaginationProps) {
  if (totalPages <= 1) return null;

  function href(page: number) {
    const params = new URLSearchParams(searchParams);
    params.set("page", String(page));
    return `${basePath}?${params.toString()}`;
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      {currentPage > 1 && (
        <Link
          href={href(currentPage - 1)}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Link>
      )}

      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1)
          .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 2)
          .map((p, idx, arr) => (
            <span key={p} className="flex">
              {idx > 0 && arr[idx - 1] !== p - 1 && (
                <span className="flex items-center px-2 text-muted-foreground">...</span>
              )}
              {p === currentPage ? (
                <span className="inline-flex items-center justify-center rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground">
                  {p}
                </span>
              ) : (
                <Link
                  href={href(p)}
                  className="inline-flex items-center justify-center rounded-lg px-3 py-2 text-sm hover:bg-muted transition-colors"
                >
                  {p}
                </Link>
              )}
            </span>
          ))}
      </div>

      {currentPage < totalPages && (
        <Link
          href={href(currentPage + 1)}
          className="inline-flex items-center gap-1 rounded-lg border px-3 py-2 text-sm hover:bg-muted transition-colors"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
