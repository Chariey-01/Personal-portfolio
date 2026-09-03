import { type ChangeEvent, type FormEvent, useEffect, useState } from "react";
import { Archive, Eye, EyeOff, ExternalLink, FileText, Image, Lock, LogOut, Plus, Save, Trash2, Upload } from "lucide-react";
import { ThemeToggle } from "../components/ThemeToggle";
import { adminRequest, getAdminContactMessages, getAdminDocuments, loginAdmin } from "../services/portfolio";
import type { ContactMessage, DocumentType, PortfolioDocument, Profile, Project, Testimonial } from "../types/portfolio";

const emptyProject: Project = {
  title: "",
  status: "In Progress",
  summary: "",
  role: "",
  stack: [],
  problem: "",
  architecture: [],
  highlights: [],
  technicalChallenges: [],
  featured: false,
  displayOrder: 0,
};

const roleOptions = [
  "Solo developer",
  "Frontend-focused developer",
  "Backend-focused developer",
  "Full-stack developer",
  "Frontend engineer on a team project",
];

export function AdminApp() {
  const [token, setToken] = useState(() => localStorage.getItem("portfolioAdminToken") ?? "");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState<Profile | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [documents, setDocuments] = useState<PortfolioDocument[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  async function loadAdminData(activeToken = token) {
    const [profileData, projectData, testimonialData, documentData, contactMessageData] = await Promise.all([
      adminRequest<Profile>("/api/admin/profile", activeToken),
      adminRequest<Project[]>("/api/admin/projects", activeToken),
      adminRequest<Testimonial[]>("/api/admin/testimonials", activeToken),
      getAdminDocuments(activeToken),
      getAdminContactMessages(activeToken),
    ]);
    setProfile(profileData);
    setProjects(projectData);
    setTestimonials(testimonialData);
    setDocuments(documentData);
    setContactMessages(contactMessageData);
  }

  useEffect(() => {
    if (!token) return;
    loadAdminData().catch((err: Error) => setMessage(err.message));
  }, [token]);

  function saveToken(nextToken: string) {
    localStorage.setItem("portfolioAdminToken", nextToken);
    setToken(nextToken);
  }

  if (!token) {
    return <AdminLogin onLogin={saveToken} />;
  }

  return (
    <div className="min-h-screen bg-ink px-5 py-8 text-slate-100 md:px-8">
      <header className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <p className="font-mono text-sm uppercase tracking-[0.18em] text-cyan-200">Portfolio CMS</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Admin Dashboard</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <ThemeToggle />
          <button
            className="button-secondary"
            type="button"
            onClick={() => {
              localStorage.removeItem("portfolioAdminToken");
              setToken("");
            }}
          >
            <LogOut size={18} aria-hidden="true" />
            Sign out
          </button>
        </div>
      </header>

      <main className="mx-auto mt-8 grid max-w-7xl gap-6">
        {message ? <p className="rounded-md border border-cyan-300/30 bg-cyan-300/10 p-4 text-sm">{message}</p> : null}
        {profile ? <ProfilePanel token={token} profile={profile} onSaved={setProfile} setMessage={setMessage} /> : null}
        <DocumentsPanel token={token} documents={documents} setDocuments={setDocuments} setMessage={setMessage} />
        <ProjectsPanel token={token} projects={projects} setProjects={setProjects} setMessage={setMessage} />
        <TestimonialsPanel token={token} testimonials={testimonials} setTestimonials={setTestimonials} setMessage={setMessage} />
        <ContactMessagesPanel token={token} messages={contactMessages} setMessages={setContactMessages} setMessage={setMessage} />
      </main>
    </div>
  );
}

function AdminLogin({ onLogin }: { onLogin: (token: string) => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    try {
      const response = await loginAdmin(username, password);
      onLogin(response.token);
    } catch (err) {
      setError((err as Error).message);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-ink px-5 text-slate-100">
      <form className="grid w-full max-w-md gap-5 rounded-lg border border-white/10 bg-white/[0.045] p-6 shadow-soft" onSubmit={submit}>
        <div>
          <Lock className="text-cyan-200" aria-hidden="true" />
          <h1 className="mt-3 text-2xl font-semibold text-white">Admin Login</h1>
        </div>
        {error ? <p className="rounded-md border border-red-300/30 bg-red-300/10 p-3 text-sm text-red-100">{error}</p> : null}
        <label className="field-label">
          Username
          <input className="field" value={username} onChange={(event) => setUsername(event.target.value)} />
        </label>
        <label className="field-label">
          Password
          <span className="relative">
            <input
              className="field pr-12"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
            <button
              className="absolute right-3 top-1/2 grid h-9 w-9 -translate-y-1/2 place-items-center rounded text-slate-300 transition hover:bg-white/10 hover:text-cyan-100 focus:outline-none focus:ring-2 focus:ring-cyan-200"
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((value) => !value)}
            >
              {showPassword ? <EyeOff size={18} aria-hidden="true" /> : <Eye size={18} aria-hidden="true" />}
            </button>
          </span>
          <input className="field" type="password" value={password} onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button className="button-primary" type="submit">
          <Lock size={18} aria-hidden="true" />
          Sign in
        </button>
      </form>
    </main>
  );
}

function ProfilePanel({
  token,
  profile,
  onSaved,
  setMessage,
}: {
  token: string;
  profile: Profile;
  onSaved: (profile: Profile) => void;
  setMessage: (message: string) => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [linksText, setLinksText] = useState(JSON.stringify(profile.links, null, 2));

  async function saveProfile(event: FormEvent) {
    event.preventDefault();
    let links = draft.links;
    try {
      links = JSON.parse(linksText);
    } catch {
      setMessage("Social links must be valid JSON.");
      return;
    }
    const saved = await adminRequest<Profile>("/api/admin/profile", token, {
      method: "PATCH",
      body: JSON.stringify({ ...draft, links }),
    });
    onSaved(saved);
    setMessage("Profile updated.");
  }

  async function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);
    const saved = await adminRequest<Profile>("/api/admin/profile/image", token, {
      method: "POST",
      body: formData,
    });
    setDraft(saved);
    onSaved(saved);
    setMessage("Profile photo updated.");
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-xl font-semibold text-white">Profile / About</h2>
      <form className="mt-5 grid gap-4" onSubmit={saveProfile}>
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Name" value={draft.name} onChange={(value) => setDraft({ ...draft, name: value })} />
          <AdminField label="Role" value={draft.role} onChange={(value) => setDraft({ ...draft, role: value })} />
          <AdminField label="Email" value={draft.email} onChange={(value) => setDraft({ ...draft, email: value })} />
          <AdminField label="Location" value={draft.location} onChange={(value) => setDraft({ ...draft, location: value })} />
          <AdminField label="Availability" value={draft.availability ?? ""} onChange={(value) => setDraft({ ...draft, availability: value })} />
        </div>
        <AdminField label="Headline" value={draft.headline} onChange={(value) => setDraft({ ...draft, headline: value })} />
        <AdminTextarea label="Short bio" value={draft.bio} onChange={(value) => setDraft({ ...draft, bio: value })} />
        <AdminTextarea label="Longer story" value={draft.story} onChange={(value) => setDraft({ ...draft, story: value })} rows={7} />
        <AdminTextarea label="Social links JSON" value={linksText} onChange={setLinksText} rows={5} />
        <label className="field-label">
          Change profile photo
          <input className="field" type="file" accept="image/*" onChange={uploadImage} />
        </label>
        <button className="button-primary w-fit" type="submit">
          <Save size={18} aria-hidden="true" />
          Save Profile
        </button>
      </form>
    </section>
  );
}

const documentTypes: { label: string; value: DocumentType }[] = [
  { label: "Resume", value: "RESUME" },
  { label: "CV", value: "CV" },
  { label: "Cover Letter", value: "COVER_LETTER" },
  { label: "Other", value: "OTHER" },
];

function DocumentsPanel({
  token,
  documents,
  setDocuments,
  setMessage,
}: {
  token: string;
  documents: PortfolioDocument[];
  setDocuments: (documents: PortfolioDocument[]) => void;
  setMessage: (message: string) => void;
}) {
  const [documentType, setDocumentType] = useState<DocumentType>("RESUME");
  const [title, setTitle] = useState("Resume");
  const [downloadLabel, setDownloadLabel] = useState("Download Resume");

  async function uploadDocument(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("document", file);
    formData.append("documentType", documentType);
    formData.append("title", title);
    formData.append("downloadLabel", downloadLabel);
    formData.append("isCurrent", "true");
    formData.append("isPublic", documentType === "COVER_LETTER" ? "false" : "true");
    const response = await adminRequest<{ document: PortfolioDocument }>("/api/admin/documents", token, {
      method: "POST",
      body: formData,
    });
    setDocuments([
      response.document,
      ...documents
        .filter((document) => document.id !== response.document.id)
        .map((document) =>
          document.documentType === response.document.documentType
            ? { ...document, isCurrent: false }
            : document,
        ),
    ]);
    setMessage(`${response.document.title} uploaded.`);
    event.target.value = "";
  }

  async function updateDocument(document: PortfolioDocument, payload: Partial<PortfolioDocument>) {
    const saved = await adminRequest<PortfolioDocument>(`/api/admin/documents/${document.id}`, token, {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    setDocuments(
      documents.map((item) => {
        if (item.id === saved.id) return saved;
        if (saved.isCurrent && item.documentType === saved.documentType) return { ...item, isCurrent: false };
        return item;
      }),
    );
    setMessage("Document updated.");
  }

  async function archiveDocument(document: PortfolioDocument) {
    if (!window.confirm(`Archive ${document.title}?`)) return;
    const saved = await adminRequest<PortfolioDocument>(`/api/admin/documents/${document.id}`, token, { method: "DELETE" });
    setDocuments(documents.map((item) => (item.id === saved.id ? saved : item)));
    setMessage("Document archived.");
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-xl font-semibold text-white">Documents</h2>
      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <label className="field-label">
          Document type
          <select
            className="field"
            value={documentType}
            onChange={(event) => {
              const nextType = event.target.value as DocumentType;
              const label = documentTypes.find((type) => type.value === nextType)?.label ?? "Document";
              setDocumentType(nextType);
              setTitle(label);
              setDownloadLabel(`Download ${label}`);
            }}
          >
            {documentTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </label>
        <AdminField label="Title" value={title} onChange={setTitle} />
        <AdminField label="Download label" value={downloadLabel} onChange={setDownloadLabel} />
        <label className="field-label">
          Upload PDF
          <input className="field" type="file" accept="application/pdf" onChange={uploadDocument} />
        </label>
      </div>
      <p className="mt-3 text-sm text-slate-400">PDF only. Uploading marks the file current; cover letters default to private.</p>

      <div className="mt-6 grid gap-3">
        {documents.map((document) => (
          <div key={document.id} className="grid gap-3 rounded-md border border-white/10 bg-ink/60 p-4 md:grid-cols-[1fr_auto]">
            <div>
              <p className="font-semibold text-white">{document.title}</p>
              <p className="text-sm text-slate-400">
                {document.documentType.replace("_", " ")} / {document.originalFilename} / {document.uploadedAt ? new Date(document.uploadedAt).toLocaleDateString() : "No date"}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {document.isCurrent ? "Current" : "Old version"} / {document.isPublic ? "Public" : "Private"} {document.archived ? "/ Archived" : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <a className="icon-link" href={document.storageUrl} target="_blank" rel="noreferrer">
                <ExternalLink size={16} aria-hidden="true" />
                Open
              </a>
              <button className="icon-link" type="button" onClick={() => updateDocument(document, { isCurrent: true, archived: false })}>
                <FileText size={16} aria-hidden="true" />
                Current
              </button>
              <button className="icon-link" type="button" onClick={() => updateDocument(document, { isPublic: !document.isPublic })}>
                <Save size={16} aria-hidden="true" />
                {document.isPublic ? "Make Private" : "Make Public"}
              </button>
              <button className="icon-link" type="button" onClick={() => archiveDocument(document)}>
                <Archive size={16} aria-hidden="true" />
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProjectsPanel({
  token,
  projects,
  setProjects,
  setMessage,
}: {
  token: string;
  projects: Project[];
  setProjects: (projects: Project[]) => void;
  setMessage: (message: string) => void;
}) {
  const [draft, setDraft] = useState<Project>(emptyProject);

  async function saveProject(event: FormEvent) {
    event.preventDefault();
    const body = JSON.stringify(toProjectPayload(draft));
    const saved = draft.id
      ? await adminRequest<Project>(`/api/admin/projects/${draft.id}`, token, { method: "PATCH", body })
      : await adminRequest<Project>("/api/admin/projects", token, { method: "POST", body });
    setProjects([saved, ...projects.filter((project) => project.id !== saved.id)]);
    setDraft(emptyProject);
    setMessage("Project saved.");
  }

  async function archiveProject(project: Project) {
    if (!project.id || !window.confirm(`Archive ${project.title}?`)) return;
    const saved = await adminRequest<Project>(`/api/admin/projects/${project.id}`, token, { method: "DELETE" });
    setProjects(projects.map((item) => (item.id === saved.id ? saved : item)));
    setMessage("Project archived.");
  }

  async function uploadProjectImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file || !draft.id) return;
    const formData = new FormData();
    formData.append("image", file);
    const saved = await adminRequest<Project>(`/api/admin/projects/${draft.id}/image`, token, {
      method: "POST",
      body: formData,
    });
    setDraft(saved);
    setProjects(projects.map((project) => (project.id === saved.id ? saved : project)));
    setMessage("Project image updated.");
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-xl font-semibold text-white">Projects</h2>
      <form className="mt-5 grid gap-4" onSubmit={saveProject}>
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Title" value={draft.title} onChange={(value) => setDraft({ ...draft, title: value })} />
          <label className="field-label">
            Role / focus
            <input
              className="field"
              list="project-role-options"
              value={draft.role}
              onChange={(event) => setDraft({ ...draft, role: event.target.value })}
            />
            <datalist id="project-role-options">
              {roleOptions.map((role) => (
                <option key={role} value={role} />
              ))}
            </datalist>
          </label>
          <AdminField label="GitHub URL" value={draft.githubUrl ?? draft.repoUrl ?? ""} onChange={(value) => setDraft({ ...draft, githubUrl: value, repoUrl: value })} />
          <AdminField label="Live URL" value={draft.liveUrl ?? ""} onChange={(value) => setDraft({ ...draft, liveUrl: value })} />
          <AdminField label="Image URL" value={draft.imageUrl ?? ""} onChange={(value) => setDraft({ ...draft, imageUrl: value })} />
          <AdminField label="Display order" value={String(draft.displayOrder ?? 0)} onChange={(value) => setDraft({ ...draft, displayOrder: Number(value) })} />
          <label className="field-label">
            Status
            <select className="field" value={draft.status} onChange={(event) => setDraft({ ...draft, status: event.target.value as Project["status"] })}>
              <option>In Progress</option>
              <option>Completed</option>
              <option>Live</option>
              <option>Archived</option>
            </select>
          </label>
        </div>
        <AdminTextarea label="Short description" value={draft.summary} onChange={(value) => setDraft({ ...draft, summary: value })} />
        <AdminTextarea label="Case-study description" value={draft.caseStudy ?? ""} onChange={(value) => setDraft({ ...draft, caseStudy: value })} />
        <AdminField label="Stack / technologies, comma separated" value={draft.stack.join(", ")} onChange={(value) => setDraft({ ...draft, stack: splitList(value), technologies: splitList(value) })} />
        <AdminTextarea label="Problem solved" value={draft.problem} onChange={(value) => setDraft({ ...draft, problem: value })} rows={3} />
        <AdminTextarea label="Architecture / how it is built, one item per line" value={draft.architecture.join("\n")} onChange={(value) => setDraft({ ...draft, architecture: splitLines(value) })} />
        <AdminTextarea label="What I learned / highlights, one item per line" value={draft.highlights.join("\n")} onChange={(value) => setDraft({ ...draft, highlights: splitLines(value) })} />
        <AdminTextarea label="Technical challenges, one item per line" value={draft.technicalChallenges.join("\n")} onChange={(value) => setDraft({ ...draft, technicalChallenges: splitLines(value) })} />
        <label className="flex items-center gap-3 text-sm text-slate-200">
          <input type="checkbox" checked={Boolean(draft.featured)} onChange={(event) => setDraft({ ...draft, featured: event.target.checked })} />
          Featured project
        </label>
        {draft.id ? (
          <label className="field-label">
            Project image
            <input className="field" type="file" accept="image/*" onChange={uploadProjectImage} />
          </label>
        ) : null}
        <button className="button-primary w-fit" type="submit">
          <Plus size={18} aria-hidden="true" />
          {draft.id ? "Update Project" : "Create Project"}
        </button>
      </form>

      <div className="mt-6 grid gap-3">
        {projects.map((project) => (
          <div key={project.id ?? project.title} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/10 bg-ink/60 p-4">
            <div>
              <p className="font-semibold text-white">{project.title}</p>
              <p className="text-sm text-slate-400">{project.status}</p>
            </div>
            <div className="flex gap-2">
              <button className="icon-link" type="button" onClick={() => setDraft(project)}>
                <Save size={16} aria-hidden="true" />
                Edit
              </button>
              <button className="icon-link" type="button" onClick={() => archiveProject(project)}>
                <Trash2 size={16} aria-hidden="true" />
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function TestimonialsPanel({
  token,
  testimonials,
  setTestimonials,
  setMessage,
}: {
  token: string;
  testimonials: Testimonial[];
  setTestimonials: (testimonials: Testimonial[]) => void;
  setMessage: (message: string) => void;
}) {
  const [draft, setDraft] = useState<Partial<Testimonial>>({ personName: "", text: "", approved: false, displayOrder: 0 });

  async function saveTestimonial(event: FormEvent) {
    event.preventDefault();
    const body = JSON.stringify(draft);
    const saved = draft.id
      ? await adminRequest<Testimonial>(`/api/admin/testimonials/${draft.id}`, token, { method: "PATCH", body })
      : await adminRequest<Testimonial>("/api/admin/testimonials", token, { method: "POST", body });
    setTestimonials([saved, ...testimonials.filter((testimonial) => testimonial.id !== saved.id)]);
    setDraft({ personName: "", text: "", approved: false, displayOrder: 0 });
    setMessage("Testimonial saved.");
  }

  async function archiveTestimonial(testimonial: Testimonial) {
    if (!window.confirm(`Archive testimonial from ${testimonial.personName}?`)) return;
    const saved = await adminRequest<Testimonial>(`/api/admin/testimonials/${testimonial.id}`, token, { method: "DELETE" });
    setTestimonials(testimonials.map((item) => (item.id === saved.id ? saved : item)));
    setMessage("Testimonial archived.");
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-xl font-semibold text-white">Testimonials</h2>
      <form className="mt-5 grid gap-4" onSubmit={saveTestimonial}>
        <div className="grid gap-4 md:grid-cols-2">
          <AdminField label="Name" value={draft.personName ?? ""} onChange={(value) => setDraft({ ...draft, personName: value })} />
          <AdminField label="Role/title" value={draft.role ?? ""} onChange={(value) => setDraft({ ...draft, role: value })} />
          <AdminField label="Organization" value={draft.organization ?? ""} onChange={(value) => setDraft({ ...draft, organization: value })} />
          <AdminField label="LinkedIn/profile URL" value={draft.profileUrl ?? ""} onChange={(value) => setDraft({ ...draft, profileUrl: value })} />
        </div>
        <AdminTextarea label="Text" value={draft.text ?? ""} onChange={(value) => setDraft({ ...draft, text: value })} />
        <label className="flex items-center gap-3 text-sm text-slate-200">
          <input type="checkbox" checked={Boolean(draft.approved)} onChange={(event) => setDraft({ ...draft, approved: event.target.checked })} />
          Approved for public site
        </label>
        <button className="button-primary w-fit" type="submit">
          <Upload size={18} aria-hidden="true" />
          Save Testimonial
        </button>
      </form>
      <div className="mt-6 grid gap-3">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-white/10 bg-ink/60 p-4">
            <div>
              <p className="font-semibold text-white">{testimonial.personName}</p>
              <p className="text-sm text-slate-400">{testimonial.approved ? "Approved" : "Draft"} {testimonial.archived ? "/ Archived" : ""}</p>
            </div>
            <div className="flex gap-2">
              <button className="icon-link" type="button" onClick={() => setDraft(testimonial)}>
                <Image size={16} aria-hidden="true" />
                Edit
              </button>
              <button className="icon-link" type="button" onClick={() => archiveTestimonial(testimonial)}>
                <Trash2 size={16} aria-hidden="true" />
                Archive
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContactMessagesPanel({
  token,
  messages,
  setMessages,
  setMessage,
}: {
  token: string;
  messages: ContactMessage[];
  setMessages: (messages: ContactMessage[]) => void;
  setMessage: (message: string) => void;
}) {
  async function archiveMessage(contactMessage: ContactMessage) {
    const saved = await adminRequest<ContactMessage>(`/api/admin/contact-messages/${contactMessage.id}`, token, {
      method: "DELETE",
    });
    setMessages(messages.map((item) => (item.id === saved.id ? saved : item)));
    setMessage("Contact message archived.");
  }

  return (
    <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
      <h2 className="text-xl font-semibold text-white">Contact Messages</h2>
      <div className="mt-5 grid gap-3">
        {messages.length === 0 ? <p className="text-sm text-slate-400">No contact messages yet.</p> : null}
        {messages
          .filter((contactMessage) => !contactMessage.archived)
          .map((contactMessage) => (
            <article key={contactMessage.id} className="rounded-md border border-white/10 bg-ink/60 p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-white">{contactMessage.name}</p>
                  <a className="text-sm text-cyan-200 hover:text-cyan-100" href={`mailto:${contactMessage.email}`}>
                    {contactMessage.email}
                  </a>
                </div>
                <div className="text-right text-sm text-slate-400">
                  <p>{contactMessage.inquiryType}</p>
                  <p>{contactMessage.createdAt ? new Date(contactMessage.createdAt).toLocaleString() : "No timestamp"}</p>
                </div>
              </div>
              <p className="mt-4 whitespace-pre-wrap leading-7 text-slate-300">{contactMessage.message}</p>
              <button className="icon-link mt-4" type="button" onClick={() => archiveMessage(contactMessage)}>
                <Archive size={16} aria-hidden="true" />
                Archive
              </button>
            </article>
          ))}
      </div>
    </section>
  );
}

function AdminField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="field-label">
      {label}
      <input className="field" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function AdminTextarea({
  label,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  rows?: number;
}) {
  return (
    <label className="field-label">
      {label}
      <textarea className="field" rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function splitList(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function splitLines(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function toProjectPayload(project: Project) {
  return {
    title: project.title,
    shortDescription: project.summary,
    caseStudy: project.caseStudy,
    role: project.role,
    technologies: project.stack,
    githubUrl: project.githubUrl ?? project.repoUrl,
    liveUrl: project.liveUrl,
    featured: project.featured,
    status: project.status,
    displayOrder: project.displayOrder,
    problem: project.problem,
    architecture: project.architecture,
    highlights: project.highlights,
    technicalChallenges: project.technicalChallenges,
  };
}
