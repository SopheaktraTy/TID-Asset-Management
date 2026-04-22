import * as React from "react";
import { useLayoutEffect } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Portal } from "./Portal";
import { useOnClickOutside } from "../../hooks/useOnClickOutside";

export interface DropdownOption {
  label: string;
  value: string;
}

export interface DropdownListProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string; // Container className
  triggerClassName?: string; // Trigger button className
  panelClassName?: string; // Dropdown panel className
}

const DropdownList = React.forwardRef<HTMLDivElement, DropdownListProps>(
  ({ options, value, onChange, placeholder = "Select...", className = "", triggerClassName = "", panelClassName = "" }, ref) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);
    const panelRef = React.useRef<HTMLDivElement>(null);

    const selectedLabel =
      options.find((o) => o.value === value)?.label ?? placeholder;

    useOnClickOutside([containerRef, panelRef], () => setOpen(false));

    const [coords, setCoords] = React.useState({ top: 0, left: 0, width: 0 });

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
        // Use capture phase for scroll to catch it from any parent
        window.addEventListener("resize", updateCoords);
        window.addEventListener("scroll", updateCoords, true);
      }
      return () => {
        window.removeEventListener("resize", updateCoords);
        window.removeEventListener("scroll", updateCoords, true);
      };
    }, [open, updateCoords]);

    return (
      <div
        ref={(node) => {
          containerRef.current = node;
          if (typeof ref === "function") ref(node);
          else if (ref) ref.current = node;
        }}
        className={`relative inline-block text-left ${className}`}
      >
        {/* Trigger */}
        <button
          type="button"
          onClick={() => {
            if (!open) updateCoords();
            setOpen((prev) => !prev);
          }}
          className={`
            flex items-center gap-1.5 pl-3 pr-2.5 py-2
            w-full justify-between
            text-xs font-medium
            ${triggerClassName.includes('bg-') ? '' : 'bg-[var(--bg)]'} border border-[var(--border-color)] rounded-lg
            text-[var(--text-main)]
            hover:border-[var(--color-growth-green)]/30 hover:ring-4 hover:ring-[var(--color-growth-green)]/5
            focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-2 focus:ring-[var(--color-growth-green)]/20
            transition-all duration-200 cursor-pointer whitespace-nowrap
            ${open ? "border-[var(--color-growth-green)] ring-2 ring-[var(--color-growth-green)]/20" : ""}
            ${triggerClassName}
          `}
        >
          <span className={!value ? "text-[var(--text-muted)]" : "text-[var(--text-main)]"}>{selectedLabel}</span>
          <ChevronDown
            size={13}
            className={`text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown panel — opens downward via Portal */}
        {open && coords.top !== 0 && (
          <Portal>
            <div
              ref={panelRef}
              className={`
                fixed z-[9999] mt-1
                min-w-[160px] w-max max-h-60 overflow-y-auto scrollbar-hide
                border border-[var(--border-color)] rounded-xl
                shadow-lg shadow-black/10
                transition-opacity duration-150
                ${panelClassName || "bg-[var(--surface)]"}
                ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
              `}
              style={{
                top: `${coords.top}px`,
                left: `${coords.left}px`,
                minWidth: `${Math.max(160, coords.width)}px`,
              }}
            >
              <ul className="py-1" role="listbox">
                {options.map((option) => {
                  const isSelected = option.value === value;
                  return (
                    <li
                      key={option.value}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onChange(option.value);
                        setOpen(false);
                      }}
                      className={`
                        flex items-center gap-2 px-3 py-2 text-xs cursor-pointer
                        transition-colors duration-100 rounded-lg mx-1
                        ${isSelected
                          ? "text-[var(--color-growth-green)] font-semibold"
                          : "text-[var(--text-main)] font-normal hover:bg-[var(--surface-hover)]"
                        }
                      `}
                    >
                      <span className="w-4 flex-shrink-0 flex items-center justify-center">
                        {isSelected && (
                          <Check size={14} strokeWidth={2.5} className="text-[var(--color-growth-green)]" />
                        )}
                      </span>
                      <span>{option.label}</span>
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
);

DropdownList.displayName = "DropdownList";

export { DropdownList };
