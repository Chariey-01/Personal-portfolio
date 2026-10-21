import { SectionHeading } from "../components/SectionHeading";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function About() {
  const { profile } = usePortfolioContent();
  const storyParagraphs = profile.story.split(/\n+/).filter(Boolean);

  return (
    <section id="about" className="section-shell bg-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <SectionHeading
          eyebrow="About"
          title={profile.headline}
          summary="Computer Science studies at Egerton University, independent learning through edX and freeCodeCamp, practical training at Moringa School, and a growing body of full-stack work."
        />
        <div className="about-panel grid gap-5 rounded-lg border border-white/10 bg-white/[0.035] p-6 text-slate-300 shadow-soft">
          {storyParagraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          <div className="grid gap-4 sm:grid-cols-3">
            {["Kept building", "Learning in public", "Full-stack systems"].map((item) => (
              <div key={item} className="metric-chip rounded-md border border-white/10 bg-ink/70 p-4">
                <p className="font-mono text-sm text-cyan-200">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-sm text-slate-400">Profile: {profile.role}</p>
        </div>
      </div>
    </section>
  );
}
