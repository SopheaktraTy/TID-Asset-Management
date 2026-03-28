import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../hooks/useTheme";

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={`
        flex h-10 w-10 items-center justify-center
        rounded-full border border-[color:var(--border-color)]
        bg-[color:var(--surface)]
        text-[color:var(--text-muted)]
        shadow-sm
        transition-all duration-200
        hover:border-[color:var(--color-aqua)]
        hover:text-[color:var(--color-aqua)]
        hover:shadow-md
        cursor-pointer
        ${className}
      `}
    >
      {theme === "dark" ? (
        <Sun className="h-[18px] w-[18px]" />
      ) : (
        <Moon className="h-[18px] w-[18px]" />
      )}
    </button>
  );
}
