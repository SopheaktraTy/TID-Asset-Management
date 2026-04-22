import React, { useState, useRef, useEffect, useLayoutEffect } from "react";
import { Columns, ChevronDown, Check } from "lucide-react";
import { Portal } from "./Portal";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

export interface ColumnOption {
  key: string;
  label: string;
}

interface ColumnGridDropdownProps {
  columns: ColumnOption[];
  hiddenColumns: Set<string>;
  onToggleColumn: (key: string) => void;
  onSetHiddenColumns?: (keys: Set<string>) => void;
  panelClassName?: string;
}


export function ColumnGridDropdown({
  columns,
  hiddenColumns,
  onToggleColumn,
  onSetHiddenColumns,
  panelClassName = "",
}: ColumnGridDropdownProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  useOnClickOutside([containerRef, panelRef], () => setOpen(false));

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
        const timeKeys = ["created_at", "updated_at", "createdAt", "updatedAt"];

        if (width < 768) {
          next.add("department");
          timeKeys.forEach(k => next.add(k));
        } else if (width < 1024) {
          timeKeys.forEach(k => next.add(k));
          next.delete("department");
        } else {
          next.delete("department");
          timeKeys.forEach(k => next.delete(k));
        }
        onSetHiddenColumns(next);
      }
      lastWidth = width;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [onSetHiddenColumns, hiddenColumns]);

  const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

  const updateCoords = React.useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCoords({
        top: rect.bottom,
        left: rect.left,
        width: rect.width,
      });
    }
  }, []);

  useLayoutEffect(() => {
    if (open) {
      updateCoords();
      window.addEventListener("resize", updateCoords);
      window.addEventListener("scroll", updateCoords, true);
    }
    return () => {
      window.removeEventListener("resize", updateCoords);
      window.removeEventListener("scroll", updateCoords, true);
    };
  }, [open, updateCoords]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => {
          if (!open) updateCoords();
          setOpen((prev) => !prev);
        }}
        className={`
          flex items-center gap-1.5 px-3 py-2 text-xs font-medium
          bg-[var(--bg)] border border-[var(--border-color)] rounded-lg
          text-[var(--text-main)]
          hover:border-[var(--color-growth-green)]/30 hover:ring-4 hover:ring-[var(--color-growth-green)]/5
          focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-2 focus:ring-[var(--color-growth-green)]/20
          transition-all duration-200 cursor-pointer
          ${open ? "border-[var(--color-growth-green)] ring-2 ring-[var(--color-growth-green)]/20" : ""}
        `}
      >
        <Columns size={14} className="text-[var(--text-muted)]" />
        <ChevronDown
          size={13}
          className={`text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown panel via Portal */}
      {open && coords.top !== 0 && (
        <Portal>
          <div
            ref={panelRef}
            className={`
              fixed z-[9999] mt-1 w-44
              border border-[var(--border-color)] rounded-xl
              shadow-lg shadow-black/10
              overflow-hidden
              transition-opacity duration-150
              ${panelClassName || "bg-[var(--bg)]"}
              ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
            `}
            style={{
              top: `${coords.top}px`,
              left: `${coords.left + coords.width - 176}px`, // Adjusting for right alignment (w-44 = 176px)
            }}
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
                      text-[var(--text-main)] hover:bg-[var(--surface-hover)] transition-colors duration-100 rounded-lg mx-1 my-0.5"
                  >
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
                    <span className="truncate">{col.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </Portal>
      )}
    </div>
  );
}
