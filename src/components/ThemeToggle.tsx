"use client";

import { useTheme } from "@/hooks/useTheme";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const icon = theme === "dark" ? "🌙" : "☀️";
  const label = theme === "dark" ? "Dark" : "Light";

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary theme-toggle"
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label={`Theme: ${label}`}
      suppressHydrationWarning
    >
      <span className="theme-icon" suppressHydrationWarning>
        {icon}
      </span>
      <span className="theme-label" suppressHydrationWarning>
        {label}
      </span>
    </button>
  );
}
