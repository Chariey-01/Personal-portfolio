import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Footer() {
  const { profile } = usePortfolioContent();

  return (
    <footer className="border-t border-white/10 bg-ink px-5 py-8 text-center text-sm text-slate-400">
      <p>
        Built by {profile.name}. React frontend, Flask backend, and database-backed contact flow.
      </p>
    </footer>
  );
}
