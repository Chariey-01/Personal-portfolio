import { SectionHeading } from "../components/SectionHeading";
import { timeline } from "../data/profile";

export function Experience() {
  return (
    <section id="experience" className="section-shell bg-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Background"
          title="Education and training, kept separate from employment."
        />
        <div className="relative grid gap-5 before:absolute before:left-4 before:top-2 before:hidden before:h-[calc(100%-1rem)] before:w-px before:bg-white/10 md:before:block">
          {timeline.map((item) => (
            <article key={`${item.label}-${item.title}`} className="timeline-card">
              <p className="relative font-mono text-sm uppercase tracking-[0.18em] text-cyan-200 md:pl-10">
                <span className="absolute left-[0.82rem] top-1 hidden h-3 w-3 rounded-full border border-cyan-200 bg-ink shadow-[0_0_18px_rgba(103,232,249,0.45)] md:block" aria-hidden="true" />
                {item.label}
              </p>
              <div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-1 text-slate-400">{item.organization}</p>
                <p className="mt-3 leading-7 text-slate-300">{item.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
