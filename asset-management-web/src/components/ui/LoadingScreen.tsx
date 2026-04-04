import { useTheme } from "../../hooks/useTheme";

import logoCharcoal from "../../assets/Logo_Bakertilly/Baker Tilly Logo_Charcoal.png";
import logoWhite from "../../assets/Logo_Bakertilly/Baker Tilly Logo_White.png";

export default function LoadingScreen() {
  const { theme } = useTheme();

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8"
      style={{ backgroundColor: "var(--bg)" }}
    >
      {/* Logo — gentle pulse */}
      <img
        src={theme === "dark" ? logoWhite : logoCharcoal}
        alt="Baker Tilly"
        className="h-[48px] w-auto object-contain animate-pulse"
        style={{ animationDuration: "1.8s" }}
      />

      {/* Branded spinner */}
      <div className="relative flex items-center justify-center w-10 h-10">
        {/* Outer ring track */}
        <div
          className="absolute inset-0 rounded-full border-[3px]"
          style={{ borderColor: "var(--border-color)" }}
        />
        {/* Spinning arc */}
        <div
          className="absolute inset-0 rounded-full border-[3px] border-t-transparent animate-spin"
          style={{
            borderColor: "var(--color-growth-green)",
            borderTopColor: "transparent",
            animationDuration: "0.75s",
          }}
        />
      </div>
    </div>
  );
}
