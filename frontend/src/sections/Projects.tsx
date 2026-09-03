import { SectionHeading } from "../components/SectionHeading";
import { ProjectCard } from "../components/ProjectCard";
import { projects } from "../data/profile";

export function Projects() {
  return (
    <section id="projects" className="section-shell bg-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="// featured projects"
          title="Case-study first, not just a grid of links."
          summary="The shipped projects below use verified repository data from this portfolio. Requested flagship projects are included as structured placeholders for your real details."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {projects.map((project, index) => (
            <ProjectCard key={project.title} project={project} featured={index === 0} />
          ))}
        </div>
      </div>
    </section>
  );
}
