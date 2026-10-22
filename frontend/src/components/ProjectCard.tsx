import { useState } from "react";
import { ArrowUpRight, Github, ImageIcon } from "lucide-react";
import type { Project } from "../types/portfolio";

type ProjectCardProps = {
  project: Project;
  featured?: boolean;
};

export function ProjectCard({ project }: ProjectCardProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const stack = Array.isArray(project.stack) ? project.stack : [];
  const previewItems = stack.slice(0, 3);
  const repoUrl = project.repoUrl ?? project.githubUrl;
  const status = project.status === "shipped" ? "Live" : project.status.replace("-", " ");
  const showImage = Boolean(project.imageUrl) && !imageFailed;

  return (
    <article className="project-card group flex h-full flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.045] shadow-soft backdrop-blur transition duration-200 hover:-translate-y-1 hover:border-cyan-300/60">
      <div className="project-media-wrap border-b border-white/10 bg-white/[0.025]">
        <div className="project-media aspect-[16/9] overflow-hidden bg-ink/70">
          {showImage ? (
            <img
              className="h-full w-full object-cover object-top transition duration-300 group-hover:scale-[1.02]"
              src={project.imageUrl}
              alt={`${project.title} application interface`}
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="project-image-placeholder grid h-full place-items-center px-6 text-center text-slate-500">
              <div>
                <ImageIcon className="mx-auto text-cyan-200/70" aria-hidden="true" size={32} />
                <p className="mt-3 text-sm">Project image pending</p>
              </div>
            </div>
          )}
        </div>
        <div className="p-5">
          <div className="grid grid-cols-3 gap-3">
            {previewItems.map((item) => (
              <span key={item} className="stack-preview min-h-14 break-words rounded-md border border-white/10 bg-ink/60 p-3 font-mono text-xs text-cyan-100">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">{project.role}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{project.title}</h3>
          </div>
          <span className="rounded border border-white/10 px-3 py-1 font-mono text-xs uppercase text-cyan-200">{status}</span>
        </div>

        <p className="mt-5 flex-1 leading-7 text-slate-300">{project.summary}</p>

        <div className="mt-6 flex flex-wrap gap-2">
          {stack.map((item) => (
            <span key={item} className="tech-chip rounded bg-cyan-300/10 px-3 py-1 text-sm text-cyan-100">
              {item}
            </span>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          {repoUrl ? (
            <a className="icon-link" href={repoUrl} target="_blank" rel="noopener noreferrer">
              <Github aria-hidden="true" size={18} />
              Code
            </a>
          ) : null}
          {project.liveUrl ? (
            <a className="icon-link" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <ArrowUpRight aria-hidden="true" size={18} />
              Live
            </a>
          ) : null}
        </div>
      </div>
    </article>
  );
}
