import type { Link, Project, SkillGroup, TimelineItem } from "../types/portfolio";

export const profile = {
  name: "Charity Jepkoech",
  alias: "Chariey",
  location: "Nairobi, Kenya",
  role: "Full Stack Software Engineer",
  email: "charityjepkoech007@gmail.com",
  resumeUrl:
    "https://docs.google.com/document/d/1mq5TU1nlRbyqxIw4jSzwdRa3av-gFaEES8tuF-1zmK8/edit?usp=sharing",
  links: [
    { label: "GitHub", href: "https://github.com/Chariey-01" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/charity-jepkoech-91b5b6330" },
    { label: "Vercel", href: "https://vercel.com/chariey-01s-projects" },
  ] satisfies Link[],
};

export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    items: ["JavaScript", "TypeScript", "React", "HTML", "CSS", "Tailwind CSS"],
  },
  {
    category: "Backend",
    items: ["Python", "Flask", "REST APIs", "SQLAlchemy", "CLI applications"],
  },
  {
    category: "Data",
    items: ["PostgreSQL", "SQLite", "schema design", "query modeling"],
  },
  {
    category: "Engineering",
    items: ["Git", "GitHub", "pytest", "CI/CD", "deployment workflows"],
  },
];

export const projects: Project[] = [
  {
    title: "AuRevia",
    status: "shipped",
    summary:
      "Collaborative e-commerce SPA with routed product flows, cart state, admin-style management screens, and a canvas-led landing experience.",
    role: "Frontend engineer on a team project",
    stack: ["React", "React Router", "JSON Server", "Canvas API", "CSS", "Git"],
    problem:
      "Create a product-shopping experience that demonstrates route design, stateful UI, and team collaboration.",
    architecture: [
      "React Router separates landing, catalog, product, cart, and management views.",
      "JSON Server provides a local REST-shaped data layer for CRUD practice.",
      "Reusable UI components keep product cards, navigation, and forms consistent.",
    ],
    highlights: [
      "Cart-oriented interaction design",
      "Client-side CRUD workflow",
      "Canvas animation used as enhancement rather than core navigation",
    ],
    technicalChallenges: [
      "Keeping team contributions consistent across shared UI conventions",
      "Managing client state across routed flows without overcomplicating the app",
    ],
    liveUrl: "https://react-personal-projects-showcase-ap.vercel.app/",
    repoUrl: "https://github.com/Chariey-01/REACT-PERSONAL-PROJECTS-SHOWCASE-APP",
  },
  {
    title: "Learning Roadmap App",
    status: "shipped",
    summary:
      "Personal full-stack learning tracker focused on progress visibility, streaks, achievements, and lightweight persistence.",
    role: "Solo developer",
    stack: ["React", "Tailwind CSS", "Vercel", "local persistence"],
    problem:
      "Help a learner translate long-term study goals into visible daily progress and momentum.",
    architecture: [
      "Componentized React interface organizes roadmap, progress, streaks, and badges.",
      "Stateful interactions keep learning progress visible without leaving the page.",
      "Vercel deployment keeps the project simple to share and review.",
    ],
    highlights: ["Streak tracking", "Achievement badges", "Countdown-oriented motivation"],
    technicalChallenges: [
      "Balancing motivational UI with clear progress information",
      "Keeping the experience responsive across small screens",
    ],
    liveUrl: "https://progress-tracking-app.vercel.app/",
    repoUrl: "https://github.com/Chariey-01/PROGRESS-TRACKING-APP",
  },
  {
    title: "Python Project Management CLI",
    status: "shipped",
    summary:
      "Python command-line project used to practice object-oriented modeling, data structures, and testable backend logic.",
    role: "Backend-focused developer",
    stack: ["Python", "OOP", "pytest", "CLI", "data structures"],
    problem:
      "Model project-management behavior in Python while keeping business rules testable from the command line.",
    architecture: [
      "Object-oriented modules separate domain logic from command-line interaction.",
      "pytest coverage validates important behavior without relying on manual CLI checks.",
      "Data structures represent project entities and relationships.",
    ],
    highlights: ["OOP domain modeling", "pytest workflow", "CLI-first backend practice"],
    technicalChallenges: [
      "Designing classes that remain easy to test",
      "Keeping command interaction separate from core rules",
    ],
    repoUrl: "https://github.com/Chariey-01/Python-Project-Management-CLI",
  },
  {
    title: "Delivaroo / Send It",
    status: "needs-details",
    summary:
      "[ADD DETAILS] Flagship delivery/logistics project requested for the portfolio, but details were not present in this repository.",
    role: "[ADD ROLE]",
    stack: ["[ADD STACK]"],
    problem: "[ADD PROBLEM SOLVED]",
    architecture: ["[ADD ARCHITECTURE NOTES]"],
    highlights: ["[ADD IMPORTANT FEATURES]"],
    technicalChallenges: ["[ADD TECHNICAL CHALLENGES]"],
  },
  {
    title: "CAMPUSPULSE",
    status: "needs-details",
    summary:
      "[ADD DETAILS] Flagship campus/community project requested for the portfolio, but details were not present in this repository.",
    role: "[ADD ROLE]",
    stack: ["[ADD STACK]"],
    problem: "[ADD PROBLEM SOLVED]",
    architecture: ["[ADD ARCHITECTURE NOTES]"],
    highlights: ["[ADD IMPORTANT FEATURES]"],
    technicalChallenges: ["[ADD TECHNICAL CHALLENGES]"],
  },
  {
    title: "DevCrypt",
    status: "needs-details",
    summary:
      "[ADD DETAILS] Flagship security/developer-tooling project requested for the portfolio, but details were not present in this repository.",
    role: "[ADD ROLE]",
    stack: ["[ADD STACK]"],
    problem: "[ADD PROBLEM SOLVED]",
    architecture: ["[ADD ARCHITECTURE NOTES]"],
    highlights: ["[ADD IMPORTANT FEATURES]"],
    technicalChallenges: ["[ADD TECHNICAL CHALLENGES]"],
  },
];

export const timeline: TimelineItem[] = [
  {
    label: "Current",
    title: "Software Engineering Training",
    organization: "Moringa School",
    description:
      "Building full-stack foundations through React, Python, Flask, databases, testing, and team project work.",
  },
  {
    label: "Before Moringa",
    title: "Self-directed software learning",
    organization: "Independent study",
    description:
      "Started with offline tutorials and practice projects, then moved toward structured engineering habits and production-minded project work.",
  },
  {
    label: "Add details",
    title: "[ADD EDUCATION OR EXPERIENCE]",
    organization: "[ADD ORGANIZATION]",
    description:
      "Add verified employment, education, certifications, or community leadership here. No unsupported dates or credentials were invented.",
  },
];
