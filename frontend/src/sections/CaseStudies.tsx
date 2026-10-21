import { SectionHeading } from "../components/SectionHeading";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function CaseStudies() {
  const { projects, loading } = usePortfolioContent();
  const caseStudies = projects
    .filter((project) => !project.archived && project.status !== "needs-details" && project.status !== "Archived")
    .slice(0, 3);

  return (
    <section id="case-studies" className="section-shell bg-surface">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Engineering Depth"
          title="Engineering in Practice"
          summary="A technical read of the strongest available projects: problem framing, structure, and the tradeoffs managed along the way."
        />
        {loading ? (
          <p className="mb-5 text-sm text-slate-400" role="status">
            Loading engineering case studies...
          </p>
        ) : null}
        {caseStudies.length === 0 ? (
          <p className="rounded-md border border-white/10 bg-ink/50 p-6 text-sm text-slate-300">
            Case study details will appear here once projects are available.
          </p>
        ) : (
          <div className="grid gap-5">
            {caseStudies.map((project) => (
              <article key={project.slug ?? project.title} className="case-card rounded-lg border border-white/10 bg-ink/72 p-6">
                <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
                  <div>
                    <p className="font-mono text-sm uppercase tracking-[0.2em] text-cyan-200">{project.title}</p>
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
        )}
      </div>
    </section>
  );
}

function CaseList({ title, items }: { title: string; items: string[] }) {
  const list = Array.isArray(items) ? items : [];
  return (
    <div>
      <h4 className="font-mono text-sm text-white">{title}</h4>
      {list.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">Not documented yet.</p>
      ) : (
        <ul className="mt-3 grid gap-2 text-sm leading-6 text-slate-300">
          {list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
