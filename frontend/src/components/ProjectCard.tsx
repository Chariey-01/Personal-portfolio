import { ArrowUpRight, Github } from "lucide-react";
import type { Project } from "../types/portfolio";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
};

export function ProjectCard({ project, featured = false }: ProjectCardProps) {
  return (
    <article
      className={`group flex h-full flex-col rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-soft backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300/60 ${
        featured ? "md:col-span-2" : ""
      }`}
    >
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
            {project.status === "needs-details" ? "Needs your details" : project.role}
          </p>
          <h3 className="mt-2 text-2xl font-semibold text-white">{project.title}</h3>
        </div>
        <span className="rounded border border-white/10 px-3 py-1 font-mono text-xs uppercase text-cyan-200">
          {project.status.replace("-", " ")}
        </span>
      </div>

      <p className="mt-5 flex-1 leading-7 text-slate-300">{project.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {project.stack.map((item) => (
          <span key={item} className="rounded bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
            {item}
          </span>
        ))}
      </div>

      <div className="mt-7 flex flex-wrap gap-3">
        {project.repoUrl ? (
          <a className="icon-link" href={project.repoUrl} target="_blank" rel="noreferrer">
            <Github aria-hidden="true" size={18} />
            Code
          </a>
        ) : null}
        {project.liveUrl ? (
          <a className="icon-link" href={project.liveUrl} target="_blank" rel="noreferrer">
            <ArrowUpRight aria-hidden="true" size={18} />
            Live
          </a>
        ) : null}
      </div>
    </article>
  );
}
