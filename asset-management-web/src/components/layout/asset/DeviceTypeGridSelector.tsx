import { Laptop, Monitor, MonitorSmartphone, MonitorPlay } from "lucide-react";
import type { DeviceType } from "../../../types/asset.types";

const OPTIONS = [
  { id: "LAPTOP", label: "Laptop", icon: Laptop, description: "Portable workstation" },
  { id: "DESKTOP", label: "Desktop", icon: Monitor, description: "Stationary computer" },
  { id: "PORTABLE_MONITOR", label: "Portable Monitor", icon: MonitorSmartphone, description: "External display" },
  { id: "STAND_MONITOR", label: "Stand Monitor", icon: MonitorPlay, description: "Desktop monitor" },
] as const;

interface DeviceTypeGridSelectorProps {
  value: DeviceType;
  onChange: (value: DeviceType) => void;
}

export function DeviceTypeGridSelector({ value, onChange }: DeviceTypeGridSelectorProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {OPTIONS.map((opt) => {
        const Icon = opt.icon;
        const isActive = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id as DeviceType)}
            className={`
              flex items-center gap-3 p-3 rounded-xl border text-left transition-all duration-200
              ${isActive 
                ? "bg-[var(--color-growth-green)]/10 border-[var(--color-growth-green)] shadow-[0_0_0_1px_var(--color-growth-green)]" 
                : "bg-[var(--bg)] border-[var(--border-color)] hover:border-[var(--text-muted)] hover:bg-[var(--surface-hover)]/30"
              }
            `}
          >
            <div className={`
              w-10 h-10 rounded-lg flex items-center justify-center shrink-0
              ${isActive ? "bg-[var(--color-growth-green)] text-[var(--color-growth-green)]" : "bg-[var(--surface-hover)] text-[var(--text-muted)]"}
            `}>
              <Icon size={20} />
            </div>
            <div className="min-w-0">
              <p className={`text-xs font-bold leading-none ${isActive ? "text-[var(--text-main)]" : "text-[var(--text-muted)]"}`}>
                {opt.label}
              </p>
              <p className="text-[10px] text-[var(--text-muted)] mt-1 truncate">
                {opt.description}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  );
}
