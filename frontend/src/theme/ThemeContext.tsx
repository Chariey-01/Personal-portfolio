import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type ThemePreference = "system" | "light" | "dark";
type AppliedTheme = "light" | "dark";

type ThemeContextValue = {
  preference: ThemePreference;
  appliedTheme: AppliedTheme;
  setPreference: (preference: ThemePreference) => void;
};

const STORAGE_KEY = "portfolio-theme-preference";
const ThemeContext = createContext<ThemeContextValue | null>(null);

function readPreferenceFromUrl(): ThemePreference | null {
  const param = new URLSearchParams(window.location.search).get("theme");
  return param === "light" || param === "dark" || param === "system" ? param : null;
}

function getSystemTheme(): AppliedTheme {
  if (!window.matchMedia) {
    return "dark";
  }
  if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

function resolveTheme(preference: ThemePreference): AppliedTheme {
  return preference === "system" ? getSystemTheme() : preference;
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [preference, setPreferenceState] = useState<ThemePreference>(() => {
    const urlPreference = readPreferenceFromUrl();
    if (urlPreference) {
      return urlPreference;
    }
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === "light" || stored === "dark" || stored === "system" ? stored : "system";
  });
  const [appliedTheme, setAppliedTheme] = useState<AppliedTheme>(() => resolveTheme(preference));

  useEffect(() => {
    const media = window.matchMedia?.("(prefers-color-scheme: light)");
    const apply = () => {
      const nextTheme = resolveTheme(preference);
      setAppliedTheme(nextTheme);
      document.documentElement.dataset.theme = nextTheme;
      document.documentElement.style.colorScheme = nextTheme;
    };
    apply();
    media?.addEventListener("change", apply);
    return () => media?.removeEventListener("change", apply);
  }, [preference]);

  function setPreference(nextPreference: ThemePreference) {
    localStorage.setItem(STORAGE_KEY, nextPreference);
    setPreferenceState(nextPreference);
  }

  const value = useMemo(
    () => ({ preference, appliedTheme, setPreference }),
    [preference, appliedTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider.");
  }
  return context;
}
