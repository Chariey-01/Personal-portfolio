import { profile } from "../data/profile";

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-ink px-5 py-8 text-center text-sm text-slate-400">
      <p>
        Built by {profile.name}. Full stack portfolio for React, Python, Flask, and database-backed
        product work.
      </p>
    </footer>
  );
}
