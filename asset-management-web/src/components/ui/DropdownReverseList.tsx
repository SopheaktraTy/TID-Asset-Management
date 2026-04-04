import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import type { DropdownOption, DropdownListProps } from "./DropdownList";

export type { DropdownOption };

const DropdownReverseList = React.forwardRef<HTMLDivElement, DropdownListProps>(
  ({ options, value, onChange, placeholder = "Select...", className = "" }, ref) => {
    const [open, setOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedLabel =
      options.find((o) => o.value === value)?.label ?? placeholder;

    // Close on outside click
    React.useEffect(() => {
      const handler = (e: MouseEvent) => {
        if (
          containerRef.current &&
          !containerRef.current.contains(e.target as Node)
        ) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, []);

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
          onClick={() => setOpen((prev) => !prev)}
          className={`
            flex items-center gap-2 pl-3 pr-3 py-2
            w-full justify-between
            text-sm font-medium
            bg-[var(--surface)] border border-[var(--border-color)] rounded-lg
            text-[var(--text-main)]
            hover:border-[var(--text-muted)] hover:bg-[var(--surface-hover)]
            focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-1 focus:ring-[var(--color-growth-green)]
            transition-colors duration-200 cursor-pointer whitespace-nowrap
            ${open ? "border-[var(--color-growth-green)] ring-1 ring-[var(--color-growth-green)]" : ""}
          `}
        >
          <span className="text-[var(--text-main)]">{selectedLabel}</span>
          <ChevronDown
            size={14}
            className={`text-[var(--text-muted)] transition-transform duration-200 flex-shrink-0 ${open ? "rotate-180" : ""}`}
          />
        </button>

        {/* Dropdown panel — opens UPWARD */}
        <div
          className={`
            absolute z-50 bottom-full mb-1 left-0
            min-w-[160px] w-max
            bg-[var(--surface)] border border-[var(--border-color)] rounded-xl
            shadow-lg shadow-black/10
            overflow-hidden
            transition-all duration-150 origin-bottom
            ${open ? "opacity-100 scale-y-100 pointer-events-auto" : "opacity-0 scale-y-95 pointer-events-none"}
          `}
        >
          <ul className="py-5" role="listbox">
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
                    flex items-center gap-2 px-4 py-2.5 text-sm cursor-pointer
                    transition-colors duration-100 rounded-lg mx-1
                    ${isSelected
                      ? "text-[var(--color-growth-green)] font-semibold"
                      : "text-[var(--text-main)] font-normal hover:bg-[var(--surface-hover)]"
                    }
                  `}
                >
                  {/* Checkmark column — always reserve space */}
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
      </div>
    );
  }
);

DropdownReverseList.displayName = "DropdownReverseList";

export { DropdownReverseList };
