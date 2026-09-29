import { ArrowUpRight, Github } from "lucide-react";
import type { CSSProperties } from "react";
import type { Project } from "../types/portfolio";

export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const repoUrl = project.repoUrl ?? project.githubUrl;
  const style = { "--project-from": project.accentFrom ?? "#7c3aed", "--project-to": project.accentTo ?? "#ec4899" } as CSSProperties;
  return (
    <article className={`project-story ${featured ? "project-story-featured" : ""}`} style={style}>
      <a className="project-art" href={`/projects/${project.slug ?? ""}`} aria-label={`Read ${project.title} case study`}>
        {project.imageUrl ? <img src={project.imageUrl} alt={`${project.title} preview`} loading="lazy" /> : <div className="project-art-placeholder"><span>{project.title.slice(0, 2).toUpperCase()}</span><small>Project overview</small></div>}
      </a>
      <div className="project-copy">
        <p className="project-meta"><span>{project.year ?? "Current"}</span><span>{project.status}</span></p>
        <h3><a href={`/projects/${project.slug ?? ""}`}>{project.title}</a></h3>
        <p>{project.summary}</p>
        <p className="project-role">{project.role}</p>
        <ul className="project-stack">{project.stack.slice(0, 5).map((item) => <li key={item}>{item}</li>)}</ul>
        <div className="project-links">
          <a className="text-action" href={`/projects/${project.slug ?? ""}`}>View case study <ArrowUpRight aria-hidden="true" size={17} /></a>
          {repoUrl ? <a className="quiet-icon-link" href={repoUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} source code`}><Github aria-hidden="true" size={18} /></a> : null}
          {project.liveUrl ? <a className="quiet-icon-link" href={project.liveUrl} target="_blank" rel="noreferrer" aria-label={`Open ${project.title} live application`}><ArrowUpRight aria-hidden="true" size={18} /></a> : null}
        </div>
      </div>
    </article>
  );
}
