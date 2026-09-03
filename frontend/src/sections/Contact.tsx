import { Github, Linkedin, Loader2, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { SectionHeading } from "../components/SectionHeading";
import { usePortfolioContent } from "../data/PortfolioContentContext";
import { inquiryTypes, submitContact } from "../services/contact";

const initialState = { name: "", email: "", inquiryType: "Job Opportunity", message: "" };
const portfolioUrl = "https://personal-portfolio-tefg.vercel.app";

export function Contact() {
  const { profile } = usePortfolioContent();
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const emailHref = `mailto:${profile.email}?subject=${encodeURIComponent("Portfolio Inquiry")}`;
  const githubLink = profile.links.find((link) => link.label.toLowerCase() === "github");
  const linkedInLink = profile.links.find((link) => link.label.toLowerCase() === "linkedin");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (form.name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (form.message.trim().length < 20) {
      setError("Please write at least 20 characters.");
      return;
    }

    setStatus("loading");
    try {
      await submitContact(form);
      setStatus("success");
      setForm(initialState);
    } catch (contactError) {
      setStatus("error");
      setError(contactError instanceof Error ? contactError.message : "Message could not be sent.");
    }
  }

  return (
    <section id="contact" className="contact-section section-shell">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div>
          <SectionHeading
            eyebrow="Contact"
            title="Reach me without hunting around the site."
            summary="Use the form, email me directly, or review my GitHub and LinkedIn."
          />
          <div className="flex flex-wrap gap-3">
            <a className="icon-link focus-ring" href={emailHref} aria-label={`Open mail app for ${profile.name}`}>
              <Mail aria-hidden="true" size={18} />
              Email
            </a>
            {githubLink ? (
              <a className="icon-link" href={githubLink.href} target="_blank" rel="noreferrer">
                <Github aria-hidden="true" size={18} />
                GitHub
              </a>
            ) : null}
            {linkedInLink ? (
              <a className="icon-link" href={linkedInLink.href} target="_blank" rel="noreferrer">
                <Linkedin aria-hidden="true" size={18} />
                LinkedIn
              </a>
            ) : null}
          </div>
          <a
            className="portfolio-preview-card focus-ring mt-8 block overflow-hidden rounded-lg border transition duration-200 hover:-translate-y-1"
            href={portfolioUrl}
            target="_blank"
            rel="noreferrer"
            aria-label="View Charity's Portfolio"
          >
            <img
              className="aspect-[1200/630] w-full object-cover"
              src="/portfolio-preview.png"
              alt="Charity Jepkoech portfolio preview"
              loading="lazy"
            />
            <span className="block p-5">
              <span className="block text-xl font-semibold">Charity&apos;s Portfolio</span>
              <span className="mt-2 block leading-7">
                A showcase of Charity&apos;s software engineering projects, skills, and work.
              </span>
              <span className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold">
                Visit Portfolio
                <ArrowUpRight size={16} aria-hidden="true" />
              </span>
            </span>
          </a>
        </div>

        <form className="contact-form rounded-lg border p-6 shadow-soft" onSubmit={handleSubmit}>
          <div className="grid gap-4">
            <label className="field-label">
              Name
              <input
                className="field"
                value={form.name}
                onChange={(event) => setForm({ ...form, name: event.target.value })}
                autoComplete="name"
              />
            </label>
            <label className="field-label">
              Email
              <input
                className="field"
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                autoComplete="email"
                inputMode="email"
              />
            </label>
            <label className="field-label">
              Inquiry type
              <select
                className="field"
                value={form.inquiryType}
                onChange={(event) => setForm({ ...form, inquiryType: event.target.value })}
              >
                {inquiryTypes.map((type) => (
                  <option key={type}>{type}</option>
                ))}
              </select>
            </label>
            <label className="field-label">
              Message
              <textarea
                className="field min-h-36 resize-y"
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
              />
            </label>
          </div>

          {error ? <p className="mt-4 text-sm text-rose-300">{error}</p> : null}
          {status === "success" ? (
            <p className="mt-4 text-sm text-cyan-200">Message received. Thank you.</p>
          ) : null}

          <div className="mt-4 hidden" data-google-identity-hook="contact-profile-prefill" />

          <button className="button-primary mt-6 w-full justify-center" disabled={status === "loading"}>
            {status === "loading" ? <Loader2 className="animate-spin" aria-hidden="true" size={18} /> : null}
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
