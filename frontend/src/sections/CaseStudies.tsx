import { SectionHeading } from "../components/SectionHeading";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function CaseStudies() {
  const { projects } = usePortfolioContent();
  const caseStudies = projects.slice(0, 3);

  return (
    <section id="case-studies" className="section-shell bg-surface">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Engineering Depth"
          title="What I want interviewers to ask about."
          summary="A quick technical read of the strongest available projects: problem, structure, and the tradeoffs I had to manage."
        />
        <div className="grid gap-5">
          {caseStudies.map((project) => (
            <article key={project.title} className="case-card rounded-lg border border-white/10 bg-ink/72 p-6">
              <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                <div>
                  <p className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">
                    {project.title}
                  </p>
                  <h3 className="mt-3 text-2xl font-semibold text-white">{project.problem}</h3>
                </div>
                <div className="grid gap-5 md:grid-cols-3">
                  <CaseList title="Architecture" items={project.architecture} />
                  <CaseList title="Highlights" items={project.highlights} />
                  <CaseList title="Challenges" items={project.technicalChallenges} />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CaseList({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-mono text-sm text-white">{title}</h4>
      <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  );
}
