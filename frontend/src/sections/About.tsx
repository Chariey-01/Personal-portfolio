import { ArrowUpRight } from "lucide-react";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function About() {
  const { profile } = usePortfolioContent();
  return (
    <section id="about" className="about-editorial">
      <div className="page-width about-grid">
        <div><p className="eyebrow">About / 02</p><h2>{profile.headline}</h2></div>
        <div className="about-narrative">
          {profile.story.split(/\n+/).filter(Boolean).map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          <div className="about-notes"><span>How I work</span><p>Start with the problem, make the paths clear, test the behavior that matters, and leave a system easier to understand than I found it.</p></div>
          <a className="text-action" href="#contact">Start a conversation <ArrowUpRight aria-hidden="true" size={17} /></a>
        </div>
      </div>
    </section>
  );
}
