import { ArrowDownRight, ArrowUpRight, Github, Mail } from "lucide-react";
import { DocumentsDropdown } from "../components/DocumentsDropdown";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Hero() {
  const { profile } = usePortfolioContent();
  const github = profile.links.find((link) => link.label.toLowerCase() === "github");

  return (
    <section id="home" className="hero-editorial">
      <div className="hero-rule" aria-hidden="true" />
      <div className="page-width hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">{profile.location} / Available for opportunities</p>
          <h1><span>Charity</span> Jepkoech</h1>
          <p className="hero-role">Software engineer building practical systems across frontend, backend, and APIs.</p>
          <p className="hero-summary">{profile.bio}</p>
          <div className="hero-actions">
            <a className="action-primary" href="#projects">View my work <ArrowDownRight aria-hidden="true" size={18} /></a>
            {github ? <a className="text-action" href={github.href} target="_blank" rel="noreferrer"><Github aria-hidden="true" size={17} />GitHub</a> : null}
            <a className="text-action" href="#contact"><Mail aria-hidden="true" size={17} />Contact</a>
            <DocumentsDropdown resumeUrl={profile.resumeUrl} cvUrl={profile.cvUrl} coverLetterUrl={profile.coverLetterUrl} />
          </div>
        </div>
        <div className="hero-aside">
          <figure className="hero-portrait">
            <img src={profile.profileImage} alt={profile.profileImageAlt} width={561} height={976} decoding="async" />
            <figcaption><span>01</span><span>Building in public, learning deliberately.</span></figcaption>
          </figure>
          <div className="hero-status">
            <p>Currently growing</p>
            <ul><li>TypeScript</li><li>Django</li><li>System design</li></ul>
            <a href="#about">Read the story <ArrowUpRight aria-hidden="true" size={16} /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
