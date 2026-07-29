"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground"
      >
        <Sun className="h-4 w-4" />
      </button>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground transition-colors relative"
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${isDark ? "scale-0 -rotate-90" : "scale-100 rotate-0"}`} />
      <Moon className={`absolute h-4 w-4 transition-all duration-300 ${isDark ? "scale-100 rotate-0" : "scale-0 rotate-90"}`} />
    </button>
  );
}