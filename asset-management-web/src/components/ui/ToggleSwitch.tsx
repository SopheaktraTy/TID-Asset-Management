import React from "react";

interface ToggleSwitchProps {
  label?: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
  size?: "sm" | "md";
  activeColor?: string;
  reverse?: boolean; // New: Put toggle first
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  label,
  description,
  checked,
  onChange,
  className = "",
  size = "md",
  activeColor = "#10b981", // Bright emerald
  reverse = false,
}) => {
  const isSm = size === "sm";

  return (
    <div className={`flex items-center gap-4 ${isSm ? "py-1" : "py-3"} ${reverse ? "flex-row-reverse justify-end" : "justify-between"} ${className}`}>
      {label && (
        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
          <span className={`${isSm ? "text-[13px]" : "text-sm"} text-[var(--text-main)] font-bold truncate leading-tight`}>
            {label}
          </span>
          {description && (
            <p className={`${isSm ? "text-[10px]" : "text-xs"} text-[var(--text-muted)] truncate leading-tight opacity-70`}>
              {description}
            </p>
          )}
        </div>
      )}
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        tabIndex={0}
        onClick={(e) => {
          e.stopPropagation();
          onChange(!checked);
        }}
        className={`relative inline-flex shrink-0 items-center rounded-full transition-all duration-300 ease-in-out focus:outline-none ring-offset-2 ring-offset-[#111]
          ${isSm ? "h-4 w-7" : "h-5 w-9"}
          ${checked ? "" : "bg-[#424242]"}
        `}
        style={checked ? { backgroundColor: activeColor } : {}}
      >
        <span
          className={`pointer-events-none inline-block transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out
            ${isSm ? "h-3 w-3" : "h-4 w-4"}
            ${checked 
              ? (isSm ? "translate-x-3.5" : "translate-x-4.5") 
              : (isSm ? "translate-x-0.5" : "translate-x-0.5")}
          `}
        />
      </button>
    </div>
  );
};
