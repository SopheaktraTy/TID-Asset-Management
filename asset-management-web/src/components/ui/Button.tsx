import * as React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "primary", style, ...props }, ref) => {
    const baseStyles =
      "w-full flex items-center justify-center gap-2 font-semibold py-2.5 px-4 rounded-lg text-sm " +
      "transition-all duration-200 ease-in-out " +
      "disabled:opacity-60 disabled:cursor-not-allowed";

    const variants: Record<string, string> = {
      // ── Primary: growth-green background, themed text, glow shadow ──
      primary:
        "bg-[color:var(--color-growth-green)] " +
        "text-[color:var(--btn-primary-text)] " +
        "hover:brightness-110 active:scale-[0.98] " +
        "shadow-[0_2px_8px_var(--btn-primary-shadow)] " +
        "hover:shadow-[0_4px_14px_var(--btn-primary-shadow)]",

      // ── Outline: surface background, adapts border + text ──
      outline:
        "bg-[color:var(--surface)] " +
        "border border-[color:var(--border-color)] " +
        "text-[color:var(--text-main)] " +
        "hover:bg-[color:var(--surface-hover)] " +
        "hover:border-[color:var(--text-muted)]",
    };

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${className}`}
        style={style}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };
