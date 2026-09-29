import { Github, Linkedin, Loader2, Mail } from "lucide-react";
import { type FormEvent, useState } from "react";
import { usePortfolioContent } from "../data/PortfolioContentContext";
import { inquiryTypes, submitContact } from "../services/contact";

const initialState = { name: "", email: "", inquiryType: "Job Opportunity", message: "" };

export function Contact() {
  const { profile } = usePortfolioContent();
  const [form, setForm] = useState(initialState);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const github = profile.links.find((link) => link.label.toLowerCase() === "github");
  const linkedin = profile.links.find((link) => link.label.toLowerCase() === "linkedin");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return setError("Please enter a valid email address.");
    if (form.message.trim().length < 20) return setError("Please write at least 20 characters.");
    setError(""); setStatus("loading");
    try { await submitContact(form); setStatus("success"); setForm(initialState); } catch (requestError) { setStatus("error"); setError(requestError instanceof Error ? requestError.message : "Message could not be sent."); }
  }

  return (
    <section id="contact" className="contact-editorial"><div className="page-width contact-grid"><div><p className="eyebrow">Contact / 06</p><h2>Let&apos;s make something useful.</h2><p>I&apos;m open to software engineering opportunities, practical collaborations, and conversations about building better systems.</p><div className="contact-links"><a href={`mailto:${profile.email}`}><Mail aria-hidden="true" size={18} />{profile.email}</a>{github ? <a href={github.href} target="_blank" rel="noreferrer"><Github aria-hidden="true" size={18} />GitHub</a> : null}{linkedin ? <a href={linkedin.href} target="_blank" rel="noreferrer"><Linkedin aria-hidden="true" size={18} />LinkedIn</a> : null}</div></div><form onSubmit={handleSubmit}><label>Name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} autoComplete="name" /></label><label>Email<input value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} autoComplete="email" inputMode="email" /></label><label>Reason for reaching out<select value={form.inquiryType} onChange={(event) => setForm({ ...form, inquiryType: event.target.value })}>{inquiryTypes.map((item) => <option key={item}>{item}</option>)}</select></label><label>Message<textarea value={form.message} onChange={(event) => setForm({ ...form, message: event.target.value })} /></label>{error ? <p className="form-error">{error}</p> : null}{status === "success" ? <p className="form-success">Message received. Thank you.</p> : null}<button className="action-primary" disabled={status === "loading"}>{status === "loading" ? <Loader2 className="spin" aria-hidden="true" size={18} /> : null}Send message</button></form></div></section>
  );
}
