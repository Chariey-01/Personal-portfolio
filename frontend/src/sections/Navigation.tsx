import { Menu, X } from "lucide-react";
import { useState } from "react";
import { profile } from "../data/profile";

const navItems = [
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Case Studies", href: "#case-studies" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink/82 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 md:px-8">
        <a className="font-mono text-sm font-semibold text-white focus-ring" href="#home">
          &lt;{profile.alias} /&gt;
        </a>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <a key={item.href} className="nav-link focus-ring" href={item.href}>
              {item.label}
            </a>
          ))}
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
          </div>
        </div>
      ) : null}
    </header>
  );
}
