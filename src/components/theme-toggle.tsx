"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "@/lib/utils";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <span
        aria-hidden
        className={cn("inline-flex size-9 shrink-0", className)}
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={cn(
        "text-muted-foreground relative inline-flex size-9 shrink-0 touch-manipulation cursor-pointer items-center justify-center rounded-lg transition-colors",
        "hover:bg-muted hover:text-foreground active:bg-muted/80",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
        className,
      )}
    >
      {isDark ? (
        <Sun className="size-[1.05rem]" strokeWidth={1.75} />
      ) : (
        <Moon className="size-[1.05rem]" strokeWidth={1.75} />
      )}
    </button>
  );
}
