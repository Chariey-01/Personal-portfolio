import { ArrowLeft, ArrowUpRight, Github, Layers3 } from "lucide-react";
import { useEffect, useState, type CSSProperties } from "react";
import { usePortfolioContent } from "../data/PortfolioContentContext";
import { getProject } from "../services/portfolio";
import type { Project } from "../types/portfolio";

type ProjectDetailProps = { slug: string };

const caseSections: Array<{ key: keyof Project; title: string }> = [
  { key: "architecture", title: "Architecture" },
  { key: "technicalDecisions", title: "Technical decisions" },
  { key: "technicalChallenges", title: "Challenges" },
  { key: "lessons", title: "What I learned" },
];

export function ProjectDetail({ slug }: ProjectDetailProps) {
  const { projects } = usePortfolioContent();
  const [project, setProject] = useState<Project | null>(() => projects.find((item) => item.slug === slug) ?? null);
  const [loading, setLoading] = useState(!project);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    setLoading(true);
    getProject(slug)
      .then((response) => {
        if (active) {
          setProject(response);
          setError("");
        }
      })
      .catch((requestError: Error) => {
        if (active && !project) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [slug]);

  if (loading && !project) return <main className="case-study-page"><p className="eyebrow">Loading project record...</p></main>;
  if (!project) {
    return <main className="case-study-page"><p className="eyebrow">Project unavailable</p><h1>{error || "This case study could not be found."}</h1><a className="text-action" href="/#projects"><ArrowLeft aria-hidden="true" size={17} />Back to projects</a></main>;
  }

  const repoUrl = project.repoUrl ?? project.githubUrl;
  const images = project.images?.length ? project.images : project.imageUrl ? [{ id: 0, imageUrl: project.imageUrl, altText: `${project.title} application preview`, displayOrder: 0 }] : [];
  const gradientStyle = { "--project-from": project.accentFrom ?? "#7c3aed", "--project-to": project.accentTo ?? "#ec4899" } as CSSProperties;

  return (
    <div className="public-site">
      <main className="case-study-page">
        <a className="back-link" href="/#projects"><ArrowLeft aria-hidden="true" size={17} />All projects</a>
        <header className="case-hero" style={gradientStyle}>
          <div>
            <p className="eyebrow">{project.year ?? "Current"} / {project.status}</p>
            <h1>{project.title}</h1>
            <p className="case-lede">{project.longDescription ?? project.caseStudy ?? project.summary}</p>
            <div className="case-actions">
              {repoUrl ? <a className="text-action" href={repoUrl} target="_blank" rel="noreferrer"><Github aria-hidden="true" size={17} />GitHub</a> : null}
              {project.liveUrl ? <a className="text-action" href={project.liveUrl} target="_blank" rel="noreferrer">Live application<ArrowUpRight aria-hidden="true" size={17} /></a> : null}
            </div>
          </div>
          <aside className="case-facts"><span>Role</span><strong>{project.role}</strong><span>Stack</span><strong>{project.stack.join(" · ")}</strong></aside>
        </header>
        <div className="case-layout">
          <article className="case-prose">
            <CaseBlock title="The problem" content={project.problem} />
            <CaseBlock title="What I built" content={project.solution ?? project.caseStudy} />
            {caseSections.map(({ key, title }) => {
              const items = project[key];
              return Array.isArray(items) && items.length && items.every((item) => typeof item === "string")
                ? <CaseList key={key} title={title} items={items as string[]} />
                : null;
            })}
            <CaseBlock title="Result" content={project.result} />
          </article>
          <aside className="case-side-note"><Layers3 aria-hidden="true" size={18} /><p>Every case study is maintained from the CMS, including its evidence, links, stack, and media.</p></aside>
        </div>
        {images.length ? <section className="case-gallery" aria-labelledby="gallery-title"><p className="eyebrow">Project gallery</p><h2 id="gallery-title">Screens from the work</h2><div className="case-gallery-grid">{images.map((image) => <figure key={image.id}><img src={image.imageUrl} alt={image.altText} loading="lazy" />{image.caption ? <figcaption>{image.caption}</figcaption> : null}</figure>)}</div></section> : null}
      </main>
    </div>
  );
}

function CaseBlock({ title, content }: { title: string; content?: string | null }) {
  if (!content) return null;
  return <section><p className="eyebrow">{title}</p><h2>{content}</h2></section>;
}

function CaseList({ title, items }: { title: string; items: string[] }) {
  return <section><p className="eyebrow">{title}</p><ul>{items.map((item) => <li key={item}>{item}</li>)}</ul></section>;
}
