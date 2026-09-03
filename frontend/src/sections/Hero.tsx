import { ArrowDown, Mail } from "lucide-react";
import { DocumentsDropdown } from "../components/DocumentsDropdown";
import { usePortfolioContent } from "../data/PortfolioContentContext";

export function Hero() {
  const { profile } = usePortfolioContent();

  return (
    <section id="home" className="relative min-h-screen overflow-visible pt-24">
      <div className="hero-bg absolute inset-0" />
      <div className="hero-fade absolute inset-x-0 bottom-0 h-32" aria-hidden="true" />
      <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 px-5 py-12 md:grid-cols-[1.04fr_0.96fr] md:px-8">
        <div className="z-10 max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan-300">
            {profile.location}
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-white md:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-4 font-mono text-base uppercase tracking-[0.18em] text-cyan-100">
            {profile.role}
          </p>
          <p className="mt-6 max-w-2xl text-xl leading-8 text-slate-200 md:text-2xl">
            {profile.bio}
          </p>
          <ul className="mt-7 flex flex-wrap gap-2" aria-label="Primary technologies">
            {profile.focusStack.map((item) => (
              <li key={item} className="rounded-md border border-white/10 bg-white/[0.045] px-3 py-2 font-mono text-xs text-cyan-100">
                {item}
              </li>
            ))}
          </ul>
          <div className="relative z-30 mt-8 flex flex-wrap gap-4">
            <a className="button-primary" href="#projects">
              View Projects
              <ArrowDown aria-hidden="true" size={18} />
            </a>
            <a className="button-secondary" href="#contact">
              <Mail aria-hidden="true" size={18} />
              Contact Me
            </a>
            <DocumentsDropdown
              resumeUrl={profile.resumeUrl}
              cvUrl={profile.cvUrl}
              coverLetterUrl={profile.coverLetterUrl}
            />
          </div>
        </div>

        <div className="relative grid min-h-[420px] items-center justify-items-center md:min-h-[560px] lg:justify-items-end">
          <figure className="relative z-10 w-48 sm:w-56 md:w-64 lg:w-72">
            <div className="aspect-square overflow-hidden rounded-full border border-white/15 shadow-portrait">
              <img
                className="h-full w-full object-cover object-center"
                src={profile.profileImage}
                alt={profile.profileImageAlt}
                width={561}
                height={976}
                decoding="async"
              />
            </div>
            <figcaption className="mt-4 border-l-2 border-cyan-300 pl-3 font-mono text-xs uppercase tracking-[0.16em] text-slate-300">
              {profile.role}
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
