import { Quote } from "lucide-react";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Testimonials() {
  const { testimonials } = usePortfolioContent();
  if (!testimonials.length) return null;
  return (
    <section className="testimonials-editorial" aria-labelledby="testimonials-title">
      <div className="page-width"><p className="eyebrow">Words from collaborators / 05</p><h2 id="testimonials-title">People who can speak to the work.</h2><div className="testimonial-lines">{testimonials.map((testimonial) => <figure key={testimonial.id}><Quote aria-hidden="true" size={22} /><blockquote>{testimonial.text}</blockquote><figcaption>{testimonial.personName}{testimonial.role ? `, ${testimonial.role}` : ""}{testimonial.organization ? ` at ${testimonial.organization}` : ""}</figcaption></figure>)}</div></div>
    </section>
  );
}
