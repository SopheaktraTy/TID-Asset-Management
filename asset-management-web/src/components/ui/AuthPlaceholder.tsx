import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-[var(--color-growth-green)] focus:ring-2 focus:ring-[var(--color-growth-green)]/20 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] transition-all duration-200 ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
