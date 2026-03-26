"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <button className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm">Tema</button>;
  const dark = resolvedTheme === "dark";
  return (
    <button className="rounded-xl border border-[var(--border)] px-3 py-2 text-sm" onClick={() => setTheme(dark ? "light" : "dark")}>
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  );
}
