import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", leftIcon, rightIcon, ...props }, ref) => {
    return (
      <div className="relative w-full">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={ref}
          className={`w-full ${leftIcon ? "pl-10" : "px-3"} ${rightIcon ? "pr-10" : "px-3"} py-2 bg-[var(--bg)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-2 focus:ring-[var(--color-growth-green)]/20 hover:border-[var(--color-growth-green)]/30 hover:ring-4 hover:ring-[var(--color-growth-green)]/5 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] placeholder:text-[12px] transition-all duration-200 ${className}`}
          {...props}
        />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] pointer-events-none">
            {rightIcon}
          </div>
        )}
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
