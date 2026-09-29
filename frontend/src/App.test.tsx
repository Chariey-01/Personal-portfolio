import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

const profile = {
  name: "Charity Jepkoech", alias: "Chariey", location: "Nairobi, Kenya", role: "Full Stack Software Engineer",
  email: "charityjepkoech007@gmail.com", headline: "Building practical full-stack systems.",
  bio: "I build React interfaces, Flask APIs, and database-backed projects.",
  story: "My path into engineering has not been perfectly linear, but I kept building.",
  profileImage: "/images/profile/charity-jepkoech.png", profileImageAlt: "Portrait of Charity Jepkoech",
  focusStack: ["React", "TypeScript", "Flask"], resumeUrl: "/api/uploads/resumes/current.pdf", cvUrl: null, coverLetterUrl: null,
  links: [{ label: "GitHub", href: "https://github.com/Chariey-01" }, { label: "LinkedIn", href: "https://linkedin.com/in/chariey" }],
};

const project = {
  id: 1, title: "AuRevia", slug: "aurevia", status: "Live", summary: "Team e-commerce SPA.",
  role: "Frontend engineer", stack: ["React", "TypeScript"], problem: "Build a product-shopping flow.",
  solution: "A routed shopping interface.", architecture: ["Routed screens"], technicalDecisions: ["Shared components"],
  highlights: ["Cart flow"], technicalChallenges: ["Shared UI"], lessons: ["Make shared conventions explicit."],
  repoUrl: "https://github.com/Chariey-01/REACT-PERSONAL-PROJECTS-SHOWCASE-APP", liveUrl: "https://react-personal-projects-showcase-ap.vercel.app/", year: 2026,
};

function response(data: unknown, status = 200) {
  return Promise.resolve(new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } }));
}

function mockApi(contactStatus = 201) {
  vi.spyOn(window, "fetch").mockImplementation((input) => {
    const url = String(input);
    if (url.endsWith("/api/profile")) return response(profile);
    if (url.endsWith("/api/projects/aurevia")) return response(project);
    if (url.endsWith("/api/projects")) return response([project]);
    if (url.endsWith("/api/testimonials")) return response([]);
    if (url.endsWith("/api/skills")) return response([{ id: 1, category: "Frontend", name: "React", detail: "Interfaces", familiarity: "Comfortable" }]);
    if (url.endsWith("/api/experience")) return response([{ id: 1, label: "Current", title: "Software Engineering Training", organization: "Moringa School", description: "Practical engineering training." }]);
    if (url.endsWith("/api/education")) return response([]);
    if (url.endsWith("/api/social-links")) return response([]);
    if (url.endsWith("/api/contact")) return response(contactStatus === 201 ? { message: "Message received." } : { error: "Please wait before sending another message." }, contactStatus);
    return response({ error: "Not found" }, 404);
  });
}

describe("portfolio visual rebuild", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    window.history.pushState({}, "", "/");
    mockApi();
  });

  it("renders the editorial identity and project-led homepage", async () => {
    render(<App />);
    expect(screen.getByRole("heading", { level: 1, name: /charity jepkoech/i })).toBeTruthy();
    expect(await screen.findByRole("heading", { name: /aurevia/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /view case study/i }).getAttribute("href")).toBe("/projects/aurevia");
    expect(screen.getByText(/tools arranged by the work/i)).toBeTruthy();
  });

  it("renders a single password field for an unauthenticated admin route", () => {
    window.history.pushState({}, "", "/admin");
    render(<App />);
    expect(screen.getByRole("heading", { name: /admin login/i })).toBeTruthy();
    expect(screen.getAllByLabelText(/^password$/i)).toHaveLength(1);
  });

  it("renders a project case study from its dedicated route", async () => {
    window.history.pushState({}, "", "/projects/aurevia");
    render(<App />);
    expect(await screen.findByRole("heading", { level: 1, name: "AuRevia" })).toBeTruthy();
    expect(screen.getByText(/technical decisions/i)).toBeTruthy();
    expect(screen.getByText(/shared components/i)).toBeTruthy();
  });

  it("validates contact form input before sending", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: /aurevia/i });
    await user.click(screen.getByRole("button", { name: /send message/i }));
    expect(screen.getByText(/please enter your name/i)).toBeTruthy();
  });

  it("submits a valid contact form and gives success feedback", async () => {
    const user = userEvent.setup();
    render(<App />);
    await screen.findByRole("heading", { name: /aurevia/i });
    await user.type(screen.getByLabelText(/^name$/i), "Recruiter");
    await user.type(screen.getByLabelText(/^email$/i), "recruiter@example.com");
    await user.type(screen.getByLabelText(/^message$/i), "I would like to discuss a full-stack engineering role.");
    await user.click(screen.getByRole("button", { name: /send message/i }));
    await waitFor(() => expect(screen.getByText(/message received/i)).toBeTruthy());
  });
});
