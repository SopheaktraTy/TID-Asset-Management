import * as React from "react";
import { ChevronDown } from "lucide-react";

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> { }

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className = "", children, ...props }, ref) => {
    return (
      <div className="relative w-full text-left">
        <select
          ref={ref}
          className={`w-full px-3 py-2 pr-10 appearance-none bg-[var(--surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-[var(--text-main)] cursor-pointer hover:border-[var(--text-muted)] transition-colors duration-200 ${className}`}
          {...props}
        >
          {children}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[var(--text-muted)]">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
