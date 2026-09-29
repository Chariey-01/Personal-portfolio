import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Experience() {
  const { experience, education } = usePortfolioContent();
  return (
    <section id="journey" className="journey-editorial">
      <div className="page-width">
        <div className="section-intro"><div><p className="eyebrow">Journey / 04</p><h2>A developing engineering practice, described honestly.</h2></div><p>Training, self-directed learning, and projects continue to shape how I approach full-stack systems.</p></div>
        <div className="journey-columns">
          <div><p className="journey-label">Experience & training</p><ol>{experience.filter((item) => !item.archived).map((item) => <li key={item.id ?? item.title}><span>{item.label}</span><h3>{item.title}</h3><strong>{item.organization}</strong><p>{item.description}</p></li>)}</ol></div>
          <div><p className="journey-label">Education</p><ol>{education.length ? education.filter((item) => !item.archived).map((item) => <li key={item.id ?? item.program}><span>{[item.startDate, item.endDate].filter(Boolean).join(" - ") || "Learning path"}</span><h3>{item.program}</h3><strong>{item.institution}</strong><p>{item.description}</p></li>) : <li><span>Foundation</span><h3>Computer science and software engineering</h3><strong>Egerton University & Moringa School</strong><p>Early computer science foundations followed by deliberate, practical software-engineering training.</p></li>}</ol></div>
        </div>
      </div>
    </section>
  );
}
