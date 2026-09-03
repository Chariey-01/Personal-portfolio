import { SectionHeading } from "../components/SectionHeading";
import { skillGroups } from "../data/skills";

export function Skills() {
  return (
    <section id="skills" className="section-shell bg-surface">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Technologies"
          title="Tools I can discuss in an interview."
          summary="Grouped by the work each tool supports, not as a logo wall."
        />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {skillGroups.map((group) => (
            <article key={group.category} className="skill-card group rounded-lg border border-white/10 bg-ink/70 p-5 shadow-soft transition duration-200 hover:-translate-y-1 hover:border-cyan-300/50">
              <h3 className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
                {group.category}
              </h3>
              <ul className="mt-5 grid gap-3">
                {group.items.map((item) => (
                  <li key={item.name} className="flex items-start gap-3 text-slate-300">
                    <span className="skill-initial grid h-8 w-8 shrink-0 place-items-center rounded-md border border-white/10 bg-white/[0.04] font-mono text-xs text-cyan-100 transition group-hover:border-cyan-300/40" aria-hidden="true">
                      {item.name.slice(0, 2).toUpperCase()}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-white">{item.name}</span>
                      <span className="mt-1 block text-sm leading-6 text-slate-400">{item.detail}</span>
                    </span>
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
