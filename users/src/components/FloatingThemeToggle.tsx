import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

/**
 * Fixed floating button that stays at top-right below the navbar on every page.
 * Unaffected by scroll. Pulses to draw attention.
 */
const FloatingThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      style={{ top: "88px" }}          // sits just below the 80px navbar
      className={`
        fixed right-5 z-50
        h-11 w-11
        flex items-center justify-center
        rounded-full
        shadow-xl
        transition-all duration-300
        animate-pulse-slow
        ${isDark
          ? "bg-slate-800 border border-white/15 text-yellow-300 hover:bg-slate-700 hover:text-yellow-200 shadow-black/40"
          : "bg-white border border-black/10 text-indigo-600 hover:bg-indigo-50 hover:text-indigo-700 shadow-black/10"
        }
      `}
    >
      {isDark ? (
        <Sun className="h-5 w-5 transition-transform duration-500 rotate-0 hover:rotate-45" />
      ) : (
        <Moon className="h-5 w-5 transition-transform duration-500" />
      )}

      {/* Blinking ring */}
      <span
        className={`absolute inset-0 rounded-full animate-ping opacity-25 pointer-events-none
          ${isDark ? "bg-yellow-400" : "bg-indigo-500"}`}
        style={{ animationDuration: "2.5s" }}
      />
    </button>
  );
};

export default FloatingThemeToggle;
