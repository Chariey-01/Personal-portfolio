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
    "My path into engineering has not been perfectly linear, but I kept building. I previously studied Computer Science at Egerton University, where I built early foundations in computing. That path was interrupted before completion, and I later pursued independent software engineering study through edX and freeCodeCamp before joining Moringa School for practical full-stack training. The work that has taught me the most is building applications, breaking them, rebuilding them, and learning in public. I tend to aim higher than my current level, which means I am often working on projects that stretch me. That has made me persistent, practical, and serious about becoming a stronger full-stack engineer.",
  // Replace the file under public/images/profile/ and update this path when a new portrait is provided.
  profileImage: "/images/profile/charity-jepkoech.jpg",
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
    title: "Delivaroo",
    slug: "delivaroo",
    status: "Live",
    summary: "Team parcel-delivery app for creating, pricing, tracking, and administering deliveries.",
    role: "Team full-stack project",
    stack: ["React", "Vite", "Redux Toolkit", "Flask", "PostgreSQL", "JWT"],
    problem: "Give senders and administrators one place to create parcels, price them, and follow delivery status.",
    architecture: [
      "The React and Redux Toolkit client talks to a Flask REST API over HTTP.",
      "PostgreSQL stores users and parcels, and JWT protects account and admin actions.",
      "Vercel serves the public app. The API is a separate service, so the live link is the user-facing site.",
    ],
    highlights: [
      "Parcel creation, tracking numbers, and status changes",
      "JWT authentication with an administrator view of parcels",
      "Jest and pytest coverage in the repository",
    ],
    technicalChallenges: [
      "Keeping the React client and Flask API on one contract across a team Git workflow",
      "Separating the public application URL from the backend host",
    ],
    liveUrl: "https://delivaroo.vercel.app",
    repoUrl: "https://github.com/Chariey-01/Delivaroo",
    imageUrl: "/images/projects/delivaroo.jpg",
  },
  {
    title: "CampusPulse",
    slug: "campuspulse",
    status: "Live",
    summary: "Campus guide for browsing, reviewing, and bookmarking places, with admin moderation.",
    role: "Full-stack project",
    stack: ["React", "Vite", "Flask", "PostgreSQL", "JWT"],
    problem: "Help students find useful places around campus and give admins a way to moderate what gets published.",
    architecture: [
      "A React single-page app and a Flask REST API stay separate and talk only over HTTP.",
      "PostgreSQL models places, reviews, bookmarks, and visit plans, including both a join table and an association object.",
      "JWT and role checks distinguish student actions from admin moderation.",
    ],
    highlights: [
      "Search and category filters for approved places",
      "Reviews, bookmarks, and visit plans",
      "Admin approval before a submitted place goes public",
    ],
    technicalChallenges: [
      "Modeling bookmarks and visit plans as different kinds of many-to-many relationships",
      "Keeping protected frontend routes aligned with backend role checks",
    ],
    liveUrl: "https://campuspulse-two.vercel.app",
    repoUrl: "https://github.com/Chariey-01/CAMPUSPULSE",
    imageUrl: "/images/projects/campuspulse.jpg",
  },
  {
    title: "AuRevia",
    slug: "aurevia",
    status: "Live",
    summary: "Team shopping SPA with a catalog, product pages, cart, and an admin portal.",
    role: "Frontend engineer on a team project",
    stack: ["React", "React Router", "Vite", "CSS"],
    problem:
      "Keep catalog browsing, the cart, and product management understandable as separate routes in one team codebase.",
    architecture: [
      "React Router splits the landing page, shop, product page, cart, and admin portal.",
      "Cart quantity lives in React state so the shop and cart edit the same list.",
      "Product records live in the repository data file used by the shopping screens.",
    ],
    highlights: [
      "Routed shopping flow from landing page to cart",
      "Admin screens for adding, editing, and deleting products",
      "Shared navigation across team contributions",
    ],
    technicalChallenges: [
      "Keeping cart updates consistent between the shop and the cart page",
      "Agreeing on shared UI structure across a group project",
    ],
    liveUrl: "https://react-personal-projects-showcase-ap.vercel.app/",
    repoUrl: "https://github.com/Chariey-01/REACT-PERSONAL-PROJECTS-SHOWCASE-APP",
    imageUrl: "/images/projects/aurevia.jpg",
  },
  {
    title: "Learning Roadmap App",
    slug: "learning-roadmap-app",
    status: "Live",
    summary: "Solo React tracker for roadmap tasks, streaks, and achievement badges.",
    role: "Solo developer",
    stack: ["React", "Vite", "CSS"],
    problem: "Turn a long learning plan into tasks, streaks, and badges that can be checked off in the browser.",
    architecture: [
      "One React component tree renders the roadmap tracks, task checks, streaks, and badges.",
      "The interface is styled in the component itself rather than with a UI framework.",
      "Vercel publishes the static client for review.",
    ],
    highlights: ["Roadmap tracks", "Streak tracking", "Achievement badges"],
    technicalChallenges: [
      "Showing a large roadmap without burying the next task",
      "Keeping the layout usable on a phone",
    ],
    liveUrl: "https://progress-tracking-app.vercel.app/",
    repoUrl: "https://github.com/Chariey-01/PROGRESS-TRACKING-APP",
    imageUrl: "/images/projects/roadmap.jpg",
  },
  {
    title: "Python Project Management CLI",
    slug: "python-project-management-cli",
    status: "Completed",
    summary: "Python command-line app for users, projects, and tasks, saved to a local JSON file.",
    role: "Backend-focused developer",
    stack: ["Python", "JSON"],
    problem: "Model users, projects, and tasks in Python while keeping those rules separate from command-line prompts.",
    architecture: [
      "Models for users, projects, and tasks sit apart from the CLI entry point.",
      "A project manager service applies the commands and validation.",
      "A JSON file stores the data between runs, and unit tests cover the models.",
    ],
    highlights: ["User, project, and task commands", "JSON persistence", "Unit tests for the models"],
    technicalChallenges: [
      "Validating email input without mixing that check into every command",
      "Keeping the CLI prompts thin so the models stay testable",
    ],
    repoUrl: "https://github.com/Chariey-01/Python-Project-Management-CLI",
    imageUrl: "/images/projects/python-cli.jpg",
    imageAlt:
      "Terminal screenshot of the Python Project Management CLI showing the add-user command, the message User added successfully, and the usage menu",
  },
];

export const timeline: TimelineItem[] = [
  {
    label: "Training",
    title: "Software Engineering Training",
    organization: "Moringa School",
    description:
      "Hands-on full-stack training, not employment. The work covers Python and Flask, JavaScript and React, REST APIs, SQL and PostgreSQL, authentication, Git and GitHub, testing, debugging, deployment, and collaborative projects.",
  },
  {
    label: "Independent learning",
    title: "Self-directed software engineering study",
    organization: "edX and freeCodeCamp",
    description:
      "Before Moringa School I studied independently through edX and freeCodeCamp, using practical programming exercises to keep building. I am not listing certificates from that period.",
  },
  {
    label: "Formal studies",
    title: "Computer Science studies",
    organization: "Egerton University",
    description:
      "I studied Computer Science at Egerton University and built a foundation in programming, computational thinking, and problem-solving. I did not complete the degree.",
  },
];
