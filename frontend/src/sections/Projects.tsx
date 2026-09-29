import { ArrowUpRight } from "lucide-react";
import { ProjectCard } from "../components/ProjectCard";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Projects() {
  const { projects, loading, error } = usePortfolioContent();
  const published = projects.filter((project) => !project.archived && project.status !== "Archived" && project.published !== false);
  const [featured, ...secondary] = published;
  return (
    <section id="projects" className="projects-editorial">
      <div className="page-width">
        <div className="section-intro"><div><p className="eyebrow">Selected work / 01</p><h2>Projects are where the engineering becomes visible.</h2></div><p>Each project has a problem, a set of decisions, and a record of what I learned while building it.</p></div>
        {error ? <p className="inline-notice">Showing available portfolio data while the live API is unavailable.</p> : null}
        {loading ? <p className="loading-note">Loading current work...</p> : null}
        {featured ? <ProjectCard project={featured} featured /> : null}
        <div className="project-secondary-grid">{secondary.map((project) => <ProjectCard key={project.slug ?? project.title} project={project} />)}</div>
        <a className="archive-link" href="https://github.com/Chariey-01" target="_blank" rel="noreferrer">More work lives on GitHub <ArrowUpRight aria-hidden="true" size={17} /></a>
      </div>
    </section>
  );
}
