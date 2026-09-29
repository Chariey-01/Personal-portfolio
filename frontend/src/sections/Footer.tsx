import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Footer() {
  const { profile } = usePortfolioContent();
  return <footer className="site-footer"><div className="page-width"><span>Built by {profile.name}</span><span>React · TypeScript · Flask · PostgreSQL-ready</span><a href="#home">Back to top</a></div></footer>;
}
