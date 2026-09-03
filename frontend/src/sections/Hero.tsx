import { ArrowDown, Download, Mail } from "lucide-react";
import { lazy, Suspense } from "react";
import { profile } from "../data/profile";

const HeroScene = lazy(() =>
  import("../three/HeroScene").then((module) => ({ default: module.HeroScene })),
);

export function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden pt-24">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(20,184,166,0.18),transparent_32%),radial-gradient(circle_at_82%_12%,rgba(244,114,182,0.14),transparent_30%),linear-gradient(135deg,#060912,#101827_48%,#071312)]" />
      <div className="relative mx-auto grid min-h-[calc(100vh-6rem)] max-w-7xl items-center gap-10 px-5 py-12 md:grid-cols-[1.02fr_0.98fr] md:px-8">
        <div className="z-10 max-w-3xl">
          <p className="font-mono text-sm uppercase tracking-[0.24em] text-cyan-300">
            {profile.location}
          </p>
          <h1 className="mt-5 text-5xl font-semibold leading-tight text-white md:text-7xl">
            {profile.name}
          </h1>
          <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-200 md:text-2xl">
            Full stack software engineer building recruiter-friendly interfaces, Flask APIs, and
            database-backed products with calm, testable architecture.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a className="button-primary" href="#projects">
              View Projects
              <ArrowDown aria-hidden="true" size={18} />
            </a>
            <a className="button-secondary" href="#contact">
              <Mail aria-hidden="true" size={18} />
              Contact Me
            </a>
            <a className="button-secondary" href={profile.resumeUrl} target="_blank" rel="noreferrer">
              <Download aria-hidden="true" size={18} />
              Resume
            </a>
          </div>
        </div>

        <div className="relative min-h-[360px] md:min-h-[560px]" aria-hidden="true">
          <Suspense fallback={<div className="scene-fallback">Engineering systems</div>}>
            <HeroScene />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
