import type { Profile, Project, TimelineItem } from "../types/portfolio";

export const profile: Profile = {
  name: "Charity Jepkoech",
  alias: "Chariey",
  location: "Nairobi, Kenya",
  role: "Full Stack Software Engineer",
  email: "charityjepkoech007@gmail.com",
  headline: "I am building toward full-stack product engineering.",
  bio: "I build React interfaces, Flask APIs, and database-backed projects. My current work is focused on clear state, readable backend logic, and deployable full-stack applications.",
  story:
    "My path into engineering has not been perfectly linear, but I kept building. I first studied Computer Science at Egerton University, where I gained early foundations, even though that university path was interrupted before completion. I later chose a more deliberate software-engineering route through Moringa School and through the work that has taught me the most: building applications, breaking them, rebuilding them, and learning in public. I tend to aim higher than my current level, which means I am often working on projects that stretch me. That has made me persistent, practical, and serious about becoming a stronger full-stack engineer.",
  profileImage: "/images/profile/charity-jepkoech.png",
  profileImageAlt: "Portrait of Charity Jepkoech",
  availability: "Open to full-stack software engineering opportunities",
  focusStack: ["React", "TypeScript", "Flask", "SQLAlchemy", "pytest"],
  resumeUrl: null,
  cvUrl: null,
  coverLetterUrl: null,
  links: [
    { label: "GitHub", href: "https://github.com/Chariey-01" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/charity-jepkoech-91b5b6330" },
    { label: "Vercel", href: "https://vercel.com/chariey-01s-projects" },
  ],
};

export const projects: Project[] = [
  {
    title: "AuRevia",
    status: "Live",
    summary:
      "Team e-commerce SPA with routed catalog, product, cart, and management screens. My focus was frontend flow, shared UI consistency, and stateful shopping interactions.",
    role: "Frontend engineer on a team project",
    stack: ["React", "React Router", "JSON Server", "Canvas API", "CSS", "Git"],
    problem:
      "Build a product-shopping flow that keeps catalog browsing, cart behavior, and management screens understandable across routes.",
    architecture: [
      "React Router separates landing, catalog, product, cart, and management views.",
      "JSON Server gives the frontend a REST-shaped data layer for CRUD practice.",
      "Shared components keep product cards, navigation, and forms consistent across team contributions.",
    ],
    highlights: [
      "Cart-oriented interaction design",
      "Client-side CRUD workflow against a local API shape",
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
    status: "Live",
    summary:
      "Solo learning tracker for roadmap progress, streaks, achievements, and local persistence. The project is strongest as a React state and responsive UI exercise.",
    role: "Solo developer",
    stack: ["React", "Tailwind CSS", "Vercel", "local persistence"],
    problem:
      "Turn a long learning plan into daily progress a learner can actually see and update.",
    architecture: [
      "Componentized React interface separates roadmap, progress, streak, and badge views.",
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
    status: "Completed",
    summary:
      "Python CLI project focused on object-oriented modeling, data structures, and testable backend logic without a browser UI.",
    role: "Backend-focused developer",
    stack: ["Python", "OOP", "pytest", "CLI", "data structures"],
    problem:
      "Model project-management behavior in Python while keeping business rules separate from command-line interaction.",
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
];

export const timeline: TimelineItem[] = [
  {
    label: "Current",
    title: "Software Engineering Training",
    organization: "Moringa School",
    description:
      "Coursework and project work in React, Python, Flask, databases, testing, and team-based development.",
  },
  {
    label: "Before Moringa",
    title: "Self-directed software learning",
    organization: "Independent study",
    description:
      "Built early practice projects before moving into a more structured full-stack training path.",
  },
];
