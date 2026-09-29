import { useMemo } from "react";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Skills() {
  const { skills } = usePortfolioContent();
  const groups = useMemo(() => {
    const grouped = new Map<string, typeof skills>();
    skills.filter((skill) => !skill.archived).forEach((skill) => grouped.set(skill.category, [...(grouped.get(skill.category) ?? []), skill]));
    return [...grouped.entries()];
  }, [skills]);
  const learning = skills.filter((skill) => skill.familiarity === "Currently learning" || skill.familiarity === "Growing");

  return (
    <section id="skills" className="skills-editorial">
      <div className="page-width">
        <div className="section-intro"><div><p className="eyebrow">Toolbox / 03</p><h2>Tools arranged by the work they help me do.</h2></div><p>I prefer clear evidence over arbitrary proficiency numbers. These groups show where each tool fits in my work today.</p></div>
        <div className="skill-ledger">{groups.map(([category, items]) => <section key={category}><h3>{category}</h3><ul>{items.map((skill) => <li key={skill.id ?? skill.name}><span>{skill.name}</span><small>{skill.detail}</small><em>{skill.familiarity}</em></li>)}</ul></section>)}</div>
        {learning.length ? <aside className="learning-note"><p className="eyebrow">Currently exploring</p><p>{learning.map((skill) => skill.name).join(" · ")}</p></aside> : null}
      </div>
    </section>
  );
}
