import { SectionHeading } from "../components/SectionHeading";
import { ProjectCard } from "../components/ProjectCard";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Projects() {
  const { projects, loading, error } = usePortfolioContent();
  const featuredProjects = projects.filter((project) => !project.archived && project.status !== "needs-details");

  return (
    <section id="projects" className="section-shell bg-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Featured Projects"
          title="Projects with code, decisions, and tradeoffs."
          summary="This section is now API-driven, so newly completed projects can be added from the admin dashboard without changing React source."
        />
        {error ? (
          <p className="mb-5 rounded-md border border-amber-300/30 bg-amber-300/10 p-4 text-sm text-amber-100">
            Showing bundled project content because the portfolio API is unavailable.
          </p>
        ) : null}
        {loading ? <p className="mb-5 text-sm text-slate-400">Loading current projects...</p> : null}
        <div className="grid gap-5 md:grid-cols-2">
          {featuredProjects.map((project, index) => (
            <ProjectCard key={project.title} project={project} featured={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
