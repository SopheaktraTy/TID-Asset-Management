import React, { useState, useRef, useEffect } from "react";
import { Columns, ChevronDown, Check } from "lucide-react";

export interface ColumnOption {
  key: string;
  label: string;
}

interface ColumnGridDropdownProps {
  columns: ColumnOption[];
  hiddenColumns: Set<string>;
  onToggleColumn: (key: string) => void;
  onSetHiddenColumns?: (keys: Set<string>) => void;
}

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

export function ColumnGridDropdown({
  columns,
  hiddenColumns,
  onToggleColumn,
  onSetHiddenColumns,
}: ColumnGridDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(containerRef, () => setOpen(false));

  // ── Smart responsive auto-hiding ──────────────────────────────────────────
  useEffect(() => {
    if (!onSetHiddenColumns) return;

    let lastWidth = window.innerWidth;

    const handleResize = () => {
      const width = window.innerWidth;

      // Boundaries: Mobile (<768), Tablet (768-1024), Desktop (>1024)
      if ((lastWidth >= 1024 && width < 1024) || (lastWidth >= 768 && width < 768) ||
        (lastWidth < 768 && width >= 768) || (lastWidth < 1024 && width >= 1024)) {

        const next = new Set(hiddenColumns);
        if (width < 768) {
          next.add("department");
          next.add("created_at");
          next.add("updated_at");
        } else if (width < 1024) {
          next.add("created_at");
          next.add("updated_at");
          next.delete("department");
        } else {
          next.delete("department");
          next.delete("created_at");
          next.delete("updated_at");
        }
        onSetHiddenColumns(next);
      }
      lastWidth = width;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onSetHiddenColumns, hiddenColumns]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`
          flex items-center gap-1.5 px-3 py-2 text-xs font-medium
          bg-[var(--bg)] border border-[var(--border-color)] rounded-lg
          text-[var(--text-main)]
          hover:border-[var(--text-muted)] hover:bg-[var(--surface-hover)]
          focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-0.5 focus:ring-[var(--color-growth-green)]
          transition-colors duration-200 cursor-pointer
          ${open ? "border-[var(--color-growth-green)] ring-0.5 ring-[var(--color-growth-green)]" : ""}
        `}
      >
        <Columns size={14} className="text-[var(--text-muted)]" />
        <ChevronDown
          size={13}
          className={`text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel */}
      <div
        className={`
          absolute right-0 z-50 mt-1 w-44
          bg-[var(--surface)] border border-[var(--border-color)] rounded-xl
          shadow-lg shadow-black/10
          overflow-hidden
          transition-all duration-150 origin-top
          ${open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}
        `}
      >
        <ul className="py-1" role="listbox">
          {columns.map((col) => {
            const isVisible = !hiddenColumns.has(col.key);
            return (
              <li
                key={col.key}
                role="option"
                aria-selected={isVisible}
                onClick={() => onToggleColumn(col.key)}
                className="flex items-center gap-2 px-3 py-2 text-xs cursor-pointer select-none
                  text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors duration-100 rounded-lg mx-1"
              >
                {/* Custom checkbox */}
                <div
                  className={`flex items-center justify-center w-4 h-4 rounded border shrink-0 transition-colors duration-100 ${isVisible
                    ? "bg-[var(--color-growth-green)] border-[var(--color-growth-green)]"
                    : "border-[var(--border-color)] bg-transparent"
                    }`}
                >
                  {isVisible && (
                    <Check
                      size={11}
                      strokeWidth={3}
                      className="text-white"
                    />
                  )}
                </div>
                <span>{col.label}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
