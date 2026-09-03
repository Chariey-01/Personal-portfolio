import { Github, Linkedin, Loader2, Mail } from "lucide-react";
import { FormEvent, useState } from "react";
import { SectionHeading } from "../components/SectionHeading";
import { profile } from "../data/profile";
import { submitContact } from "../services/contact";

const initialState = { name: "", email: "", message: "" };

export function Contact() {
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");

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
    <section id="contact" className="section-shell bg-surface">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 lg:grid-cols-[0.9fr_1.1fr] md:px-8">
        <div>
          <SectionHeading
            eyebrow="// contact"
            title="Let’s talk about software, teams, and useful products."
            summary="The form is wired for a Flask API endpoint. Email remains available as a reliable fallback."
          />
          <div className="flex flex-wrap gap-3">
            <a className="icon-link" href={`mailto:${profile.email}`}>
              <Mail aria-hidden="true" size={18} />
              Email
            </a>
            <a className="icon-link" href={profile.links[0].href} target="_blank" rel="noreferrer">
              <Github aria-hidden="true" size={18} />
              GitHub
            </a>
            <a className="icon-link" href={profile.links[1].href} target="_blank" rel="noreferrer">
              <Linkedin aria-hidden="true" size={18} />
              LinkedIn
            </a>
          </div>
        </div>

        <form className="rounded-lg border border-white/10 bg-ink/72 p-6" onSubmit={handleSubmit}>
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

          <button className="button-primary mt-6 w-full justify-center" disabled={status === "loading"}>
            {status === "loading" ? <Loader2 className="animate-spin" aria-hidden="true" size={18} /> : null}
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
