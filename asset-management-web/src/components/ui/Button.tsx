import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", ...props }, ref) => {
    const baseStyles = "w-full flex items-center justify-center gap-2 font-medium py-2.5 px-4 rounded-lg transition-colors text-sm disabled:opacity-70 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-[color:var(--color-growth-green)] hover:brightness-105 active:scale-[0.98] text-[#2B303A] font-semibold transition-all",
      outline: "bg-[var(--surface)] border border-[var(--border-color)] text-[var(--text-main)] hover:bg-[var(--surface-hover)]",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
