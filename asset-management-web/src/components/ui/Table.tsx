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
import { Portal } from "./Portal";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

export interface ColumnDef<T> {
  key: string;
  header: React.ReactNode;
  cell: (item: T) => React.ReactNode;
  sortable?: boolean;
  headerClassName?: string;
  cellClassName?: string;
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
  menuClassName?: string;
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
  menuClassName = "",
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

  const [menuCoords, setMenuCoords] = useState({ top: 0, left: 0 });

  // ── Drag & Drop State ──────────────────────────────────────────────────────
  const [draggedCol, setDraggedCol] = useState<string | null>(null);
  const [overCol, setOverCol] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, key: string) => {
    setDraggedCol(key);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent, key: string) => {
    e.preventDefault();
    if (draggedCol && draggedCol !== key) {
      setOverCol(key);
    }
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeave = () => {
    setOverCol(null);
  };

  const handleDrop = (e: React.DragEvent, targetKey: string) => {
    e.preventDefault();
    setOverCol(null);
    if (!draggedCol || draggedCol === targetKey) return;

    setColOrder((prev) => {
      const next = [...prev];
      const draggedIdx = next.indexOf(draggedCol);
      const targetIdx = next.indexOf(targetKey);
      if (draggedIdx === -1 || targetIdx === -1) return prev;

      // Remove dragged and insert at target
      next.splice(draggedIdx, 1);
      next.splice(targetIdx, 0, draggedCol);
      return next;
    });
    setDraggedCol(null);
  };

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
    <div className="w-full overflow-x-auto custom-scrollbar">

      <table className="w-full min-w-max text-xs">
        <thead className="relative z-20">
          <tr className="border-b border-[var(--border-color)] dark:border-[var(--border-color)]/80">
            {visibleColumns.map((col, colIdx) => {
              const isFirst = colIdx === 0;
              const isLast = colIdx === visibleColumns.length - 1;

              return (
                <th
                  key={col.key}
                  draggable
                  onDragStart={(e) => handleDragStart(e, col.key)}
                  onDragOver={(e) => handleDragOver(e, col.key)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, col.key)}
                  className={`px-5 py-3 text-left text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide select-none group relative whitespace-nowrap border-r border-[var(--border-color)] last:border-r-0 cursor-move hover:bg-[var(--surface-hover)] transition-all ${overCol === col.key ? "ring-1 ring-[var(--color-growth-green)] ring-inset bg-[var(--color-growth-green)]/10" : ""} ${col.headerClassName || ""}`}
                >
                  <div className="flex items-center justify-between w-full h-full">
                    <span
                      className={`flex items-center gap-1.5 relative ${col.sortable ? "cursor-pointer" : ""}`}
                      onClick={(e) => {
                        if (!col.sortable) return;
                        e.stopPropagation();
                        // Instead of just toggling the key, we also want to capture the rect
                        const rect = e.currentTarget.getBoundingClientRect();
                        setMenuCoords({
                          top: rect.bottom,
                          left: rect.left,
                        });
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

                      {/* Column Menu Dropdown (SortDropdown) — now via Portal */}
                      {menuOpen === col.key && menuCoords.top !== 0 && (
                        <Portal>
                          <div
                            ref={menuRef}
                            className={`fixed z-[9999] mt-2 w-38 border border-[var(--border-color)] rounded-lg shadow-xl text-[var(--text-main)] py-1 font-normal normal-case tracking-normal overflow-hidden cursor-default transition-opacity duration-150 ${menuClassName || "bg-[var(--surface)]"}`}
                            style={{
                              top: `${menuCoords.top}px`,
                              left: `${menuCoords.left}px`,
                              minWidth: "148px",
                            }}
                            onClick={(e) => e.stopPropagation()}
                          >
                            {col.sortable && (
                              <>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSort(col.key, "asc");
                                  }}
                                  className="flex items-center w-[calc(100%-8px)] mx-1 rounded-lg gap-2 px-3 py-2 text-xs text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors duration-100"
                                >
                                  <ArrowUp size={13} className="text-[var(--text-muted)] shrink-0" />
                                  Sort Ascending
                                </button>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleSort(col.key, "desc");
                                  }}
                                  className="flex items-center w-[calc(100%-8px)] mx-1 rounded-lg gap-2 px-3 py-2 text-xs text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors duration-100"
                                >
                                  <ArrowDown size={13} className="text-[var(--text-muted)] shrink-0" />
                                  Sort Descending
                                </button>
                                <div className="h-px bg-[var(--border-color)] dark:bg-[var(--border-color)]/50 my-1" />
                              </>
                            )}

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (!isFirst) moveColumn(col.key, "left");
                              }}
                              disabled={isFirst}
                              className={`flex items-center w-[calc(100%-8px)] mx-1 rounded-lg gap-2 px-3 py-2 text-xs transition-colors duration-100 ${isFirst
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
                              className={`flex items-center w-[calc(100%-8px)] mx-1 rounded-lg gap-2 px-3 py-2 text-xs transition-colors duration-100 ${isLast
                                ? "text-[var(--text-muted)] opacity-40 cursor-not-allowed"
                                : "text-[var(--text-main)] hover:bg-[var(--surface-hover)] cursor-pointer"
                                }`}
                            >
                              <ArrowRight size={13} className="shrink-0" />
                              Move to Right
                            </button>
                          </div>
                        </Portal>
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
          className={`divide-y divide-gray-200 dark:divide-[var(--border-color)] transition-opacity duration-200 ${loading && data && data.length > 0
            ? "opacity-50 pointer-events-none"
            : ""
            }`}
        >
          {loading && (!data || data.length === 0) ? (
            [...Array(pageSize)].map((_, i) => (
              <tr key={`skeleton-${i}`}>
                {visibleColumns.map((col, j) => (
                  <td key={`skeleton-col-${j}`} className={`px-5 py-3 ${col.cellClassName || ""}`}>
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
                    className={`px-5 py-3 text-xs whitespace-nowrap ${col.cellClassName || ""}`}
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
