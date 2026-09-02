import { SectionHeading } from "../components/SectionHeading";
import { skillGroups } from "../data/profile";

export function Skills() {
  return (
    <section id="skills" className="section-shell bg-surface">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="// technologies"
          title="A practical stack for full-stack product work."
          summary="Grouped by where each tool earns its place in a real application."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <article key={group.category} className="rounded-lg border border-white/10 bg-ink/70 p-5">
              <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
                {group.category}
              </h3>
              <ul className="mt-5 grid gap-3">
                {group.items.map((item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-cyan-300" aria-hidden="true" />
                    {item}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
