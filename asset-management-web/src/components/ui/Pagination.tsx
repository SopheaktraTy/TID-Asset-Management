import { ChevronLeft, ChevronRight } from "lucide-react";
import { DropdownReverseList } from "./DropdownReverseList";

interface PaginationProps {
  page: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  pageSizeOptions?: number[];
}

export default function Pagination({
  page,
  pageSize,
  totalElements,
  totalPages,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [5, 10, 20, 50],
}: PaginationProps) {
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
    <div className="flex flex-wrap items-center justify-between gap-4 px-5 py-3.5 border-t border-[var(--border-color)] w-full">
      {/* Rows per page */}
      <div className="flex items-center gap-2 text-[11px] text-[var(--text-muted)]">
        <span>Rows per page</span>
        <div className="w-[60px]">
          <DropdownReverseList
            options={pageSizeOptions.map((n) => ({ label: String(n), value: String(n) }))}
            value={String(pageSize)}
            onChange={(val) => onPageSizeChange(Number(val))}
            className="[&>button]:!text-[11px] [&>button]:!py-1 [&>button]:!px-2 [&>div]:!min-w-[70px] [&_ul]:!py-1 [&_li]:!py-1 [&_li]:!px-2 [&_li]:!text-[11px] [&_svg]:!w-3 [&_svg]:!h-3"
          />
        </div>
      </div>

      {/* Page info + controls */}
      <div className="flex items-center gap-3 text-[11px]">
        <span className="text-[var(--text-muted)]">
          {totalElements === 0 ? "0" : `${start} – ${end}`} of {totalElements}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onPageChange(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-1 rounded border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={12} />
          </button>

          {pageRange().map((p, i) =>
            p === "..." ? (
              <span key={`ellipsis-${i}`} className="px-1 text-[var(--text-muted)]">...</span>
            ) : (
              <button
                key={p}
                onClick={() => onPageChange(p as number)}
                className={`min-w-[24px] h-6 px-1 rounded text-[11px] font-medium transition-colors ${page === p
                  ? "bg-[var(--color-growth-green)] text-[var(--btn-primary-text)] shadow-sm"
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
            className="p-1 rounded border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--surface-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
