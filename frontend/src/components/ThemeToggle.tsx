import { Laptop, Moon, Sun } from "lucide-react";
import { type ThemePreference, useTheme } from "../theme/ThemeContext";

const options: { value: ThemePreference; label: string; icon: typeof Laptop }[] = [
  { value: "system", label: "System", icon: Laptop },
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
];

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { preference, setPreference } = useTheme();

  return (
    <div className={`inline-flex rounded-md border border-white/10 bg-white/[0.04] p-1 ${compact ? "scale-95" : ""}`} aria-label="Color theme">
      {options.map((option) => {
        const Icon = option.icon;
        const active = preference === option.value;
        return (
          <button
            key={option.value}
            className={`inline-flex min-h-9 items-center gap-2 rounded px-3 text-sm font-semibold transition ${
              active ? "bg-fuchsia-400 text-slate-950" : "text-slate-300 hover:bg-white/10 hover:text-white"
            }`}
            type="button"
            aria-pressed={active}
            title={`${option.label} theme`}
            onClick={() => setPreference(option.value)}
          >
            <Icon aria-hidden="true" size={16} />
            <span className={compact ? "sr-only" : ""}>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
