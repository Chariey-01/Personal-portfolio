import { Menu, X } from "lucide-react";
import { useState } from "react";
import { usePortfolioContent } from "../data/PortfolioContentContext";

const navItems = [
  { label: "Work", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Journey", href: "#journey" },
  { label: "Contact", href: "#contact" },
];

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { profile } = usePortfolioContent();
  return (
    <header className="site-header">
      <nav className="page-width site-nav" aria-label="Primary navigation">
        <a className="wordmark" href="/" aria-label={`${profile.name} home`}><span>CJ</span><span>{profile.alias}</span></a>
        <div className="nav-desktop">{navItems.map((item) => <a key={item.href} href={item.href}>{item.label}</a>)}</div>
        <button className="nav-toggle" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-label={open ? "Close menu" : "Open menu"}>{open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}</button>
      </nav>
      {open ? <div className="nav-mobile">{navItems.map((item) => <a key={item.href} href={item.href} onClick={() => setOpen(false)}>{item.label}</a>)}</div> : null}
    </header>
  );
}
