import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface UserPaginationProps {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

export default function UserPagination({
  page,
  pageSize,
  totalElements,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: UserPaginationProps) {
  // Pagination pages to show
  const pageRange = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0, 1, 2, 3, 4);
      if (page > 5) pages.push("...");
      if (page >= 5 && page <= totalPages - 2) pages.push(page);
      pages.push("...", totalPages - 1);
    }
    return [...new Set(pages)];
  };

  const start = page * pageSize + 1;
  const end = Math.min((page + 1) * pageSize, totalElements);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-t border-[var(--border-color)]">
      {/* Rows per page */}
      <div className="flex items-center gap-2 text-sm text-[var(--text-muted)]">
        <span>Rows per page</span>
        <div className="relative">
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="pl-2.5 pr-7 py-1 text-sm bg-[var(--surface)] border border-[var(--border-color)] rounded-lg focus:outline-none text-[var(--text-main)] appearance-none cursor-pointer"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--text-muted)]" />
        </div>
      </div>

      {/* Page info + controls */}
      <div className="flex items-center gap-3 text-sm">
        <span className="text-[var(--text-muted)]">
          {totalElements === 0 ? "0" : `${start} – ${end}`} of {totalElements}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={14} />
          </button>

          {pageRange().map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-1 text-[var(--text-muted)]">...</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors ${
                  page === p
                    ? "bg-blue-600 text-white shadow-sm"
                    : "border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)]"
                }`}
              >
                {(p as number) + 1}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(Math.min(totalPages - 1, page + 1))}
            disabled={page >= totalPages - 1}
            className="p-1.5 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
