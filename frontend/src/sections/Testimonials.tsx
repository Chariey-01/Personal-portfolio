import { SectionHeading } from "../components/SectionHeading";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Testimonials() {
  const { testimonials } = usePortfolioContent();

  if (testimonials.length === 0) {
    return null;
  }

  return (
    <section id="testimonials" className="section-shell bg-ink">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="People who can speak to the work."
          summary="Only approved testimonials are shown publicly."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article key={testimonial.id} className="testimonial-card rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-soft">
              <p className="leading-7 text-slate-200">{testimonial.text}</p>
              <div className="mt-5">
                <p className="font-semibold text-white">{testimonial.personName}</p>
                <p className="text-sm text-slate-400">
                  {[testimonial.role, testimonial.organization].filter(Boolean).join(", ")}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
