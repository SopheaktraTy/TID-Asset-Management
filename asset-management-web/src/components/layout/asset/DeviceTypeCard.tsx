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
          w-full flex items-center gap-3 p-2 rounded-xl border transition-all duration-300 group
          ${isOpen ? "border-[var(--color-growth-green)] ring-2 ring-[var(--color-growth-green)]/10 bg-[var(--surface-hover)]/30" : "bg-[var(--bg)] border-[var(--border-color)]/60 hover:border-[var(--text-muted)] hover:bg-[var(--surface-hover)]/20"}
          ${error && !isOpen ? "border-red-500/50 bg-red-500/5" : ""}
          shadow-sm
        `}
      >
        <div className={`
          w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-inner transition-colors
          ${selectedOption ? "bg-[var(--color-growth-green)] text-black" : "bg-[var(--surface-hover)] text-[var(--text-muted)]"}
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
        <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-[100] p-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--bg)]/95 backdrop-blur-md shadow-2xl animate-in fade-in zoom-in duration-200">
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
                    flex items-center gap-2.5 p-1.5 rounded-lg border text-left transition-all duration-200 group/item
                    ${isActive 
                      ? "bg-[var(--color-growth-green)]/10 border-[var(--color-growth-green)] shadow-sm" 
                      : "bg-transparent border-transparent hover:bg-[var(--surface-hover)]/50 hover:border-[var(--border-color)]/50"
                    }
                  `}
                >
                  <div className={`
                    w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-colors
                    ${isActive ? "bg-[var(--color-growth-green)] text-black" : "bg-[var(--surface-hover)] text-[var(--text-muted)] group-hover/item:text-[var(--text-main)]"}
                  `}>
                    <Icon size={14} strokeWidth={2.5} />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-[11px] font-bold leading-none ${isActive ? "text-[var(--text-main)]" : "text-[var(--text-muted)] group-hover/item:text-[var(--text-main)]"}`}>
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
