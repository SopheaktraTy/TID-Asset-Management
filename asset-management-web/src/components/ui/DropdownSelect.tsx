/**
 * DropdownSelect
 *
 * A labelled dropdown built on top of DropdownList.
 * Use this inside forms / filter panels where you want
 * an optional visible label above the trigger.
 *
 * For toolbar-style inline usage without a label,
 * use <DropdownList> directly.
 */
import * as React from "react";
import { DropdownList } from "./DropdownList";
import type { DropdownOption } from "./DropdownList";

export interface DropdownSelectProps {
  label?: string;
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const DropdownSelect = React.forwardRef<HTMLDivElement, DropdownSelectProps>(
  ({ label, options, value, onChange, placeholder, className = "" }, ref) => {
    return (
      <div ref={ref} className={`flex flex-col gap-1 ${className}`}>
        {label && (
          <label className="text-xs font-medium text-[var(--text-muted)] uppercase tracking-wide select-none">
            {label}
          </label>
        )}
        <DropdownList
          options={options}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full"
        />
      </div>
    );
  }
);

DropdownSelect.displayName = "DropdownSelect";

export { DropdownSelect };
export type { DropdownOption };
