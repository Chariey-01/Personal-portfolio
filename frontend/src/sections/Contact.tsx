import { Github, Linkedin, Loader2, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { SectionHeading } from "../components/SectionHeading";
import { usePortfolioContent } from "../data/PortfolioContentContext";
import { inquiryTypes, submitContact } from "../services/contact";

const initialState = { name: "", email: "", inquiryType: "Job Opportunity", message: "" };

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
      <div className="mx-auto grid max-w-7xl items-start gap-10 px-5 md:px-8 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)] lg:gap-16">
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
