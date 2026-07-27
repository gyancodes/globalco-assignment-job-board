"use client";

import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      className="relative w-9 h-9 rounded-lg border border-border bg-background hover:bg-accent transition-colors flex items-center justify-center"
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <Sun className={`h-4 w-4 transition-all duration-300 ${dark ? "opacity-0 scale-0 rotate-90 absolute" : "opacity-100 scale-100 rotate-0"}`} />
      <Moon className={`h-4 w-4 transition-all duration-300 ${dark ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-0 -rotate-90 absolute"}`} />
    </button>
  );
}
