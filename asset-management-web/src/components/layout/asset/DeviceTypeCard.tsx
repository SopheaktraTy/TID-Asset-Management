import { useState, useRef, useEffect } from "react";
import { Laptop, Monitor, MonitorSmartphone, MonitorPlay, ChevronDown } from "lucide-react";
import type { DeviceType } from "../../../types/asset.types";

const OPTIONS = [
  { id: "LAPTOP", label: "Laptop", icon: Laptop, description: "Portable workstation" },
  { id: "DESKTOP", label: "Desktop", icon: Monitor, description: "Stationary computer" },
  { id: "PORTABLE_MONITOR", label: "Portal Monitor", icon: MonitorSmartphone, description: "External Display" },
  { id: "STAND_MONITOR", label: "Stand Monitor", icon: MonitorPlay, description: "Desktop monitor" },
] as const;

interface DeviceTypeCardProps {
  value: DeviceType | null;
  onChange: (value: DeviceType) => void;
  error?: boolean;
}

export function DeviceTypeCard({ value, onChange, error }: DeviceTypeCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = OPTIONS.find(opt => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      {/* Trigger: The current selection as a card */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`
          w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all duration-200 group outline-none
          text-[var(--text-main)] bg-[var(--bg)] border border-[var(--border-color)]/50
          hover:border-[var(--text-muted)] hover:bg-[var(--surface-hover)]
          focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-2 focus:ring-[var(--color-growth-green)]/20
          ${isOpen ? "border-[var(--color-growth-green)] ring-2 ring-[var(--color-growth-green)]/20" : ""}
          ${error && !isOpen ? "border-red-500/50 bg-red-500/5" : ""}
          cursor-pointer
        `}
      >
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-inner transition-colors
          ${selectedOption ? "bg-[var(--color-growth-green)] text-[var(--bg)]" : "bg-[var(--surface-hover)] text-[var(--text-muted)]"}
        `}>
          {selectedOption ? <selectedOption.icon size={16} strokeWidth={2.5} /> : <Monitor size={16} strokeWidth={2.5} />}
        </div>

        <div className="flex-1 text-left min-w-0">
          <h4 className={`text-xs font-bold truncate ${selectedOption ? "text-[var(--text-main)] transition-colors" : "text-[11px] text-[var(--text-muted)]"}`}>
            {selectedOption ? selectedOption.label : "Select Category..."}
          </h4>
          {selectedOption && (
            <p className="text-[10px] text-[var(--text-muted)] truncate leading-none mt-0.5">
              {selectedOption.description}
            </p>
          )}
        </div>

        <div className={`transition-transform duration-300 pr-1 ${isOpen ? "rotate-180 text-[var(--color-growth-green)]" : "text-[var(--text-muted)]"}`}>
          <ChevronDown size={14} />
        </div>
      </button>

      {/* Dropdown Panel: The Grid of cards */}
      {isOpen && (
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-[100] p-1.5 rounded-xl border border-[var(--border-color)]/50 bg-[var(--bg)] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in duration-200">
          <div className="grid grid-cols-1 gap-1">
            {OPTIONS.map((opt) => {
              const Icon = opt.icon;
              const isActive = value === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => {
                    onChange(opt.id as DeviceType);
                    setIsOpen(false);
                  }}
                  className={`
                    flex items-center gap-2.5 p-1.5 rounded-lg text-left transition-all duration-200 group/item
                    ${isActive
                      ? "bg-[var(--color-growth-green)]/10 shadow-sm ring-1 ring-[var(--color-growth-green)]/20"
                      : "bg-transparent hover:bg-[var(--surface-hover)]/30"
                    }
                  `}
                >
                  <div className={`
                    w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors
                    ${isActive ? "bg-[var(--color-growth-green)] text-[var(--bg)]" : "bg-[var(--surface-hover)] text-[var(--text-muted)] group-hover/item:text-[var(--text-main)]"}
                  `}>
                    <Icon size={14} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold leading-none ${isActive ? "text-[var(--text-main)]" : "text-[var(--text-muted)] group-hover/item:text-[var(--text-main)]"}`}>
                      {opt.label}
                    </p>
                    <p className="text-[9px] text-[var(--text-muted)] mt-0.5 truncate">
                      {opt.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
