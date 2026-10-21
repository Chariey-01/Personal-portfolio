import { SectionHeading } from "../components/SectionHeading";
import { ProjectCard } from "../components/ProjectCard";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Projects() {
  const { projects, loading, error, usingFallback } = usePortfolioContent();
  const featuredProjects = projects.filter(
    (project) => !project.archived && project.status !== "needs-details" && project.status !== "Archived",
  );

  return (
    <section id="projects" className="section-shell bg-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Projects with code, decisions, and tradeoffs."
          summary="This section is API-driven, so newly completed projects can be added from the admin dashboard without changing React source."
        />

        {loading ? (
          <div
            className="mb-5 rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300"
            role="status"
            aria-live="polite"
          >
            Loading current projects...
          </div>
        ) : null}

        {error ? (
          <p
            className="mb-5 rounded-md border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100"
            role="alert"
          >
            Showing verified bundled project content because the portfolio API is unavailable ({error}).
          </p>
        ) : null}

        {!loading && !error && usingFallback ? (
          <p className="mb-5 rounded-md border border-white/10 bg-white/[0.04] p-4 text-sm text-slate-300">
            Showing verified bundled project content. Add or restore projects in the admin dashboard to load them from
            the API.
          </p>
        ) : null}

        {!loading && featuredProjects.length === 0 ? (
          <p className="rounded-md border border-white/10 bg-white/[0.04] p-6 text-sm text-slate-300">
            No public projects are available yet. Check back soon, or open the admin dashboard to publish projects.
          </p>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {featuredProjects.map((project, index) => (
              <ProjectCard key={project.slug ?? project.title} project={project} featured={index === 0} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
