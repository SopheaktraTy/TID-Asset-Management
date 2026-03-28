import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = "", ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 bg-[var(--surface)] border border-[var(--border-color)] rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm text-[var(--text-main)] placeholder:text-[var(--text-muted)] ${className}`}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
