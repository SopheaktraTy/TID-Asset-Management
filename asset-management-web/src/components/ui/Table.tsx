import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  loading?: boolean;
  pageSize?: number;
  sortBy?: string;
  sortDir?: "asc" | "desc";
  onSort?: (field: string, dir?: "asc" | "desc") => void;
  onRowClick?: (item: T) => void;
  emptyMessage?: React.ReactNode;
}

// ─── Click Outside Hook ────────────────────────────────────────────────────────
function useOnClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  handler: () => void
) {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
}

export function Table<T>({
  data,
  columns,
  loading,
  pageSize = 5,
  sortBy,
  sortDir,
  onSort,
  onRowClick,
  emptyMessage = "No data found",
}: TableProps<T>) {
  // ── Column order state (keys) ──────────────────────────────────────────────
  const [colOrder, setColOrder] = useState<string[]>(() =>
    columns.map((c) => c.key)
  );

  // Keep colOrder in sync when columns prop changes (e.g., hidden cols filtered upstream)
  useEffect(() => {
    setColOrder((prev) => {
      const incoming = columns.map((c) => c.key);
      // Preserve existing order, append any new keys, drop removed ones
      const preserved = prev.filter((k) => incoming.includes(k));
      const added = incoming.filter((k) => !preserved.includes(k));
      return [...preserved, ...added];
    });
  }, [columns]);

  const [hiddenCols] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(menuRef, () => setMenuOpen(null));

  // Derive ordered visible columns
  const visibleColumns = colOrder
    .map((key) => columns.find((c) => c.key === key))
    .filter((c): c is ColumnDef<T> => !!c && !hiddenCols.has(c.key));

  const toggleSort = (key: string, forceDir?: "asc" | "desc") => {
    if (!onSort) return;
    if (forceDir) {
      onSort(key, forceDir);
    } else {
      if (sortBy === key) {
        onSort(key, sortDir === "asc" ? "desc" : "asc");
      } else {
        onSort(key, "asc");
      }
    }
    setMenuOpen(null);
  };

  const moveColumn = useCallback(
    (key: string, direction: "left" | "right") => {
      setColOrder((prev) => {
        const idx = prev.indexOf(key);
        if (idx === -1) return prev;
        const next = [...prev];
        if (direction === "left" && idx > 0) {
          [next[idx - 1], next[idx]] = [next[idx], next[idx - 1]];
        } else if (direction === "right" && idx < next.length - 1) {
          [next[idx], next[idx + 1]] = [next[idx + 1], next[idx]];
        }
        return next;
      });
      setMenuOpen(null);
    },
    []
  );

  return (
    <div
      className="w-full overflow-x-auto transition-all duration-200"
      style={{ paddingBottom: menuOpen ? "220px" : "8px" }}
    >
      <table className="w-full min-w-max text-xs">
        <thead className="relative z-20">
          <tr className="border-b border-[var(--border-color)]">
            {visibleColumns.map((col, colIdx) => {
              const isFirst = colIdx === 0;
              const isLast = colIdx === visibleColumns.length - 1;

              return (
                <th
                  key={col.key}
                  className="px-5 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide select-none group relative whitespace-nowrap"
                >
                  <div className="flex items-center justify-between w-full h-full">
                    <span
                      className={`flex items-center gap-1.5 relative ${col.sortable ? "cursor-pointer" : ""}`}
                      onClick={(e) => {
                        if (!col.sortable) return;
                        e.stopPropagation();
                        setMenuOpen(menuOpen === col.key ? null : col.key);
                      }}
                    >
                      {col.header}
                      {col.sortable && (
                        <SortIcon
                          field={col.key}
                          activeField={sortBy}
                          dir={sortDir}
                        />
                      )}

                      {/* Column Menu Dropdown (SortDropdown) */}
                      {menuOpen === col.key && (
                        <div
                          ref={menuRef}
                          className="absolute top-full left-0 mt-2 w-38 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg shadow-xl z-50 text-[var(--text-main)] py-1 font-normal normal-case tracking-normal overflow-hidden cursor-default"
                          style={{ minWidth: "148px" }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          {col.sortable && (
                            <>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSort(col.key, "asc");
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors duration-100"
                              >
                                <ArrowUp size={13} className="text-[var(--text-muted)] shrink-0" />
                                Sort Ascending
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleSort(col.key, "desc");
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-xs text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors duration-100"
                              >
                                <ArrowDown size={13} className="text-[var(--text-muted)] shrink-0" />
                                Sort Descending
                              </button>
                              <div className="h-px bg-[var(--border-color)] my-1" />
                            </>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isFirst) moveColumn(col.key, "left");
                            }}
                            disabled={isFirst}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors duration-100 ${isFirst
                              ? "text-[var(--text-muted)] opacity-40 cursor-not-allowed"
                              : "text-[var(--text-main)] hover:bg-[var(--surface-hover)] cursor-pointer"
                              }`}
                          >
                            <ArrowLeft size={13} className="shrink-0" />
                            Move to Left
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              if (!isLast) moveColumn(col.key, "right");
                            }}
                            disabled={isLast}
                            className={`w-full flex items-center gap-3 px-3 py-2 text-xs transition-colors duration-100 ${isLast
                              ? "text-[var(--text-muted)] opacity-40 cursor-not-allowed"
                              : "text-[var(--text-main)] hover:bg-[var(--surface-hover)] cursor-pointer"
                              }`}
                          >
                            <ArrowRight size={13} className="shrink-0" />
                            Move to Right
                          </button>
                        </div>
                      )}
                    </span>
                  </div>
                </th>
              );
            })}
            {onRowClick && <th className="px-5 py-3 w-10" />}
          </tr>
        </thead>

        <tbody
          className={`divide-y divide-[var(--border-color)] transition-opacity duration-200 ${loading && data && data.length > 0
            ? "opacity-50 pointer-events-none"
            : ""
            }`}
        >
          {loading && (!data || data.length === 0) ? (
            [...Array(pageSize)].map((_, i) => (
              <tr key={`skeleton-${i}`}>
                {visibleColumns.map((_, j) => (
                  <td key={`skeleton-col-${j}`} className="px-5 py-3">
                    <div
                      className="h-3.5 rounded-md bg-[var(--border-color)] animate-pulse"
                      style={{ width: j === 0 ? "70%" : "50%" }}
                    />
                  </td>
                ))}
                {onRowClick && <td className="px-4 py-3" />}
              </tr>
            ))
          ) : !data || data.length === 0 ? (
            <tr>
              <td
                colSpan={visibleColumns.length + (onRowClick ? 1 : 0)}
                className="px-6 py-16 text-center"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((item, rowIndex) => (
              <tr
                key={`row-${rowIndex}`}
                onClick={() => onRowClick && onRowClick(item)}
                className={`group transition-colors ${onRowClick
                  ? "hover:bg-[var(--surface-hover)] cursor-pointer"
                  : ""
                  }`}
              >
                {visibleColumns.map((col) => (
                  <td
                    key={`cell-${rowIndex}-${col.key}`}
                    className="px-5 py-3 text-xs whitespace-nowrap"
                  >
                    {col.cell(item)}
                  </td>
                ))}
                {onRowClick && (
                  <td className="px-4 py-3">
                    <ChevronRight
                      size={14}
                      className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity"
                    />
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

function SortIcon({
  field,
  activeField,
  dir,
}: {
  field: string;
  activeField?: string;
  dir?: "asc" | "desc";
}) {
  if (activeField !== field)
    return (
      <ChevronsUpDown
        size={12}
        className="text-[var(--text-muted)] opacity-50"
      />
    );
  return dir === "asc" ? (
    <ChevronUp size={12} className="text-[var(--color-growth-green)]" />
  ) : (
    <ChevronDown size={12} className="text-[var(--color-growth-green)]" />
  );
}
