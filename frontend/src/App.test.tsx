import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "./App";

function mockApi(contactResponse = new Response(JSON.stringify({ message: "Message received." }), {
  status: 201,
  headers: { "Content-Type": "application/json" },
})) {
  vi.spyOn(window, "fetch").mockImplementation((input) => {
    const url = String(input);
    if (url.includes("/api/profile")) {
      return Promise.resolve(
        new Response(
          JSON.stringify({
            name: "Charity Jepkoech",
            alias: "Chariey",
            location: "Nairobi, Kenya",
            role: "Full Stack Software Engineer",
            email: "charityjepkoech007@gmail.com",
            headline: "I am building toward full-stack product engineering.",
            bio: "I build React interfaces, Flask APIs, and database-backed projects.",
            story: "My path into engineering has not been perfectly linear, but I kept building.",
            profileImage: "/images/profile/charity-jepkoech.jpg",
            profileImageAlt: "Portrait of Charity Jepkoech",
            focusStack: ["React", "TypeScript", "Flask"],
            resumeUrl: "/api/uploads/resumes/current.pdf",
            coverLetterUrl: "/api/uploads/cover-letters/current.pdf",
            links: [{ label: "GitHub", href: "https://github.com/Chariey-01" }],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    }
    if (url.includes("/api/projects")) {
      return Promise.resolve(
        new Response(
          JSON.stringify([
            {
              title: "AuRevia",
              status: "Live",
              summary: "Team e-commerce SPA.",
              role: "Frontend engineer",
              stack: ["React"],
              problem: "Build a product-shopping flow.",
              architecture: ["Routed screens"],
              highlights: ["Cart flow"],
              technicalChallenges: ["Shared UI"],
              repoUrl: "https://github.com/Chariey-01/REACT-PERSONAL-PROJECTS-SHOWCASE-APP",
              liveUrl: "https://react-personal-projects-showcase-ap.vercel.app/",
            },
            {
              title: "Learning Roadmap App",
              status: "Live",
              summary: "Solo learning tracker.",
              role: "Solo developer",
              stack: ["React"],
              problem: "Track learning progress.",
              architecture: ["Componentized React"],
              highlights: ["Streak tracking"],
              technicalChallenges: ["Responsive UI"],
            },
            {
              title: "Python Project Management CLI",
              status: "Completed",
              summary: "Python CLI project.",
              role: "Backend-focused developer",
              stack: ["Python"],
              problem: "Model project-management behavior.",
              architecture: ["OOP modules"],
              highlights: ["pytest workflow"],
              technicalChallenges: ["Testable classes"],
            },
          ]),
          { status: 200, headers: { "Content-Type": "application/json" } },
        ),
      );
    }
    if (url.includes("/api/testimonials")) {
      return Promise.resolve(new Response(JSON.stringify([]), { status: 200, headers: { "Content-Type": "application/json" } }));
    }
    return Promise.resolve(contactResponse.clone());
  });
}

describe("portfolio app", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    window.history.pushState({}, "", "/");
    mockApi();
  });

  it("renders one password field for the Chariey admin login", () => {
    window.history.pushState({}, "", "/admin");

    render(<App />);

    expect(screen.getByRole("heading", { name: /admin login/i })).toBeInTheDocument();
    expect(screen.getAllByLabelText(/^password$/i)).toHaveLength(1);
  });

  it("renders the primary application shell and one logical h1", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { level: 1, name: /Charity Jepkoech/i })).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(await screen.findAllByText(/Documents/i)).not.toHaveLength(0);
    expect(screen.getByRole("img", { name: /portrait of Charity Jepkoech/i })).toHaveAttribute(
      "src",
      "/images/profile/charity-jepkoech.jpg",
    );
    expect(screen.queryByRole("link", { name: /view charity's portfolio/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("img", { name: /portfolio preview/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/visit portfolio/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /send message/i })).toBeInTheDocument();
  });

  it("renders navigation and major portfolio sections", async () => {
    render(<App />);

    const nav = screen.getByRole("navigation");
    expect(within(nav).getByRole("link", { name: /about/i })).toHaveAttribute("href", "#about");
    expect(within(nav).getByRole("link", { name: /^projects$/i })).toHaveAttribute("href", "#projects");
    expect(within(nav).getByRole("link", { name: /experience/i })).toHaveAttribute("href", "#experience");
    expect(await within(nav).findAllByRole("link", { name: /view resume/i })).toHaveLength(1);
    expect(screen.getByRole("heading", { name: /tools I can discuss/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /education and training, kept separate from employment/i })).toBeInTheDocument();
  });

  it("renders featured projects and preserves verified links", async () => {
    render(<App />);

    expect(screen.getByRole("heading", { name: "AuRevia" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Learning Roadmap App" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Python Project Management CLI" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
      "href",
      "https://github.com/Chariey-01",
    );
    expect(screen.queryByText(/Delivaroo \/ Send It/i)).not.toBeInTheDocument();
    await userEvent.click(screen.getAllByText(/Documents/i)[0]);
    expect((await screen.findAllByRole("link", { name: /download resume/i }))[0]).toHaveAttribute("href", "/api/uploads/resumes/current.pdf");
    expect(screen.getAllByRole("link", { name: /download cover letter/i })[0]).toHaveAttribute("href", "/api/uploads/cover-letters/current.pdf");
  });

  it("validates the contact form before submitting", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(screen.getByText(/please enter your name/i)).toBeInTheDocument();
  });

  it("shows success feedback after a valid contact submission", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByLabelText(/name/i), "Recruiter");
    await user.type(screen.getByLabelText(/email/i), "recruiter@example.com");
    await user.type(screen.getByLabelText(/message/i), "I would like to discuss a role with you.");
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/message received/i)).toBeInTheDocument();
  });

  it("shows API error feedback after a failed contact submission", async () => {
    const user = userEvent.setup();
    mockApi(
      new Response(JSON.stringify({ error: "Please wait before sending another message." }), {
        status: 429,
        headers: { "Content-Type": "application/json" },
      }),
    );
    render(<App />);

    const form = screen.getByRole("button", { name: /send message/i }).closest("form");
    expect(form).toBeTruthy();
    await user.type(within(form as HTMLFormElement).getByLabelText(/name/i), "Recruiter");
    await user.type(within(form as HTMLFormElement).getByLabelText(/email/i), "recruiter@example.com");
    await user.type(
      within(form as HTMLFormElement).getByLabelText(/message/i),
      "I would like to discuss a role with you.",
    );
    await user.click(screen.getByRole("button", { name: /send message/i }));

    expect(await screen.findByText(/please wait before sending another message/i)).toBeInTheDocument();
  });

  it("falls back to bundled projects when the portfolio API fails", async () => {
    vi.spyOn(window, "fetch").mockImplementation(() => Promise.reject(new Error("backend down")));
    render(<App />);

    expect(await screen.findByRole("heading", { name: "Delivaroo" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "CampusPulse" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "AuRevia" })).toBeInTheDocument();
    const cliCard = screen.getByRole("heading", { name: "Python Project Management CLI" }).closest("article");
    expect(cliCard).toBeTruthy();
    expect(within(cliCard as HTMLElement).getByRole("img")).toHaveAttribute("src", "/images/projects/python-cli.jpg");
    expect(within(cliCard as HTMLElement).getByRole("img")).toHaveAttribute(
      "alt",
      expect.stringMatching(/add-user command/i),
    );
    expect(within(cliCard as HTMLElement).getByRole("link", { name: /code/i })).toHaveAttribute(
      "href",
      "https://github.com/Chariey-01/Python-Project-Management-CLI",
    );
    expect(within(cliCard as HTMLElement).queryByRole("link", { name: /live/i })).not.toBeInTheDocument();
    expect(screen.getByRole("img", { name: /delivaroo application interface/i })).toHaveAttribute(
      "src",
      "/images/projects/delivaroo.jpg",
    );
    expect(screen.getByText(/portfolio API is unavailable/i)).toBeInTheDocument();
  });

  it("renders the Engineering in Practice section", async () => {
    render(<App />);
    expect(await screen.findByRole("heading", { name: /Engineering in Practice/i })).toBeInTheDocument();
  });

});
