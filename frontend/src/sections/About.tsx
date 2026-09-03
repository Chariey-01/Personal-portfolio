import { SectionHeading } from "../components/SectionHeading";
import { profile } from "../data/profile";

export function About() {
  return (
    <section id="about" className="section-shell bg-ink">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 md:grid-cols-[0.9fr_1.1fr] md:px-8">
        <SectionHeading
          eyebrow="// about"
          title="I build with both product clarity and backend discipline."
          summary="My current focus is full-stack engineering: React interfaces, Python/Flask services, database modeling, testing, and deployable project workflows."
        />
        <div className="grid gap-5 text-slate-300">
          <p>
            I am a software engineer in training at Moringa School in Nairobi, with a path that
            began through self-directed learning and grew into structured, project-based
            engineering practice.
          </p>
          <p>
            I care about building systems that are readable to users and maintainable for the
            engineers who inherit them: clear state, clean APIs, predictable data, and interfaces
            that explain themselves.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {["React interfaces", "Flask APIs", "Database design"].map((item) => (
              <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-4">
                <p className="font-mono text-sm text-cyan-200">{item}</p>
              </div>
            ))}
          </div>
          <p className="font-mono text-sm text-slate-400">Profile: {profile.role}</p>
        </div>
      </div>
    </section>
  );
}
