import { Menu, X } from "lucide-react";
import { useState } from "react";
import { DocumentsDropdown } from "../components/DocumentsDropdown";
import { ThemeToggle } from "../components/ThemeToggle";
import { usePortfolioContent } from "../data/PortfolioContentContext";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { profile } = usePortfolioContent();

  return (
    <header className="site-nav fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/82 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a className="focus-ring inline-flex items-center gap-3 rounded-md" href="#home" aria-label={`${profile.name} home`}>
          <span className="grid h-9 w-9 place-items-center rounded-md border border-cyan-300/35 bg-cyan-300/10 font-mono text-sm font-semibold text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.16)]">
            CJ
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-sm font-semibold text-white">{profile.alias}</span>
            <span className="mt-1 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-cyan-200">
              Full stack
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a key={item.href} className="nav-link focus-ring" href={item.href}>
              {item.label}
            </a>
          ))}
          <DocumentsDropdown resumeUrl={profile.resumeUrl} cvUrl={profile.cvUrl} coverLetterUrl={profile.coverLetterUrl} compact align="right" />
          <ThemeToggle compact />
        </div>

        <button
          className="focus-ring rounded p-2 text-white md:hidden"
          type="button"
          aria-label={open ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={open}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-white/10 bg-ink px-5 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            {navItems.map((item) => (
              <a
                key={item.href}
                className="focus-ring rounded px-2 py-3 text-slate-200"
                href={item.href}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <DocumentsDropdown resumeUrl={profile.resumeUrl} cvUrl={profile.cvUrl} coverLetterUrl={profile.coverLetterUrl} />
            <ThemeToggle />
          </div>
        </div>
      ) : null}
    </header>
  );
}
