import type { SkillGroup } from "../types/portfolio";

// Skills intentionally stay in code: they change less often than projects/resume
// and keeping them typed here makes future edits obvious without CMS overhead.
export const skillGroups: SkillGroup[] = [
  {
    category: "Frontend",
    items: [
      { name: "React", detail: "component structure, routing, API integration" },
      { name: "TypeScript", detail: "typed props, shared portfolio data, safer refactors" },
      { name: "Tailwind CSS", detail: "responsive layouts, reusable visual tokens" },
      { name: "JavaScript", detail: "state, events, browser APIs" },
    ],
  },
  {
    category: "Backend",
    items: [
      { name: "Flask", detail: "application factory, routes, validation, CORS" },
      { name: "Python", detail: "domain logic, CLI workflows, pytest coverage" },
      { name: "REST APIs", detail: "request validation, errors, contact flow" },
      { name: "SQLAlchemy", detail: "models, persistence, database configuration" },
    ],
  },
  {
    category: "Data",
    items: [
      { name: "PostgreSQL", detail: "production-ready relational database target" },
      { name: "SQLite", detail: "local development and test persistence" },
      { name: "Schema design", detail: "entities, relationships, constraints" },
      { name: "Query modeling", detail: "data access shaped around user workflows" },
    ],
  },
  {
    category: "Testing & Tools",
    items: [
      { name: "GitHub", detail: "public repositories and project review workflow" },
      { name: "pytest", detail: "backend API behavior tests" },
      { name: "Vitest", detail: "React shell and contact-form behavior tests" },
      { name: "Deployment", detail: "Vercel frontend, Python backend-ready setup" },
    ],
  },
];
