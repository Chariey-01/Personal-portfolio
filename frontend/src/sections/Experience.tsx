import { SectionHeading } from "../components/SectionHeading";
import { timeline } from "../data/profile";

export function Experience() {
  return (
    <section id="experience" className="section-shell bg-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="// experience"
          title="A verified timeline, ready for your missing details."
        />
        <div className="grid gap-4">
          {timeline.map((item) => (
            <article key={`${item.label}-${item.title}`} className="timeline-card">
              <p className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">
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
