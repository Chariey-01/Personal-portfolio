import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { profile as fallbackProfile, projects as fallbackProjects } from "./profile";
import { getProfile, getProjects, getTestimonials } from "../services/portfolio";
import type { Profile, Project, Testimonial } from "../types/portfolio";

type PortfolioContent = {
  profile: Profile;
  projects: Project[];
  testimonials: Testimonial[];
  loading: boolean;
  error: string | null;
  usingFallback: boolean;
};

const PortfolioContentContext = createContext<PortfolioContent | null>(null);

function normalizeProject(raw: Project): Project {
  const stack = Array.isArray(raw.stack) && raw.stack.length > 0
    ? raw.stack
    : Array.isArray(raw.technologies)
      ? raw.technologies
      : [];
  const summary =
    raw.summary?.trim() ||
    raw.shortDescription?.trim() ||
    raw.caseStudy?.trim() ||
    "";

  const bundled = fallbackProjects.find((project) => project.slug && project.slug === raw.slug);
  const imageAlt =
    raw.imageAlt?.trim() ||
    (raw.imageUrl && raw.imageUrl === bundled?.imageUrl ? bundled.imageAlt : undefined);

  return {
    ...raw,
    imageAlt,
    stack,
    technologies: stack,
    summary,
    architecture: Array.isArray(raw.architecture) ? raw.architecture : [],
    highlights: Array.isArray(raw.highlights) ? raw.highlights : [],
    technicalChallenges: Array.isArray(raw.technicalChallenges) ? raw.technicalChallenges : [],
    problem: raw.problem?.trim() || summary,
    status: raw.status || "In Progress",
    archived: Boolean(raw.archived),
  };
}

export function PortfolioContentProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState(fallbackProfile);
  const [projects, setProjects] = useState(() => fallbackProjects.map(normalizeProject));
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingFallback, setUsingFallback] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadPortfolio() {
      try {
        const [apiProfile, apiProjects, apiTestimonials] = await Promise.all([
          getProfile(),
          getProjects(),
          getTestimonials(),
        ]);
        if (!active) return;

        const normalized = (Array.isArray(apiProjects) ? apiProjects : []).map(normalizeProject);
        setProfile(apiProfile ?? fallbackProfile);
        // Prefer API data when the request succeeds. If the API returns an empty list,
        // keep the verified bundled projects so the public site never looks blank.
        if (normalized.length > 0) {
          setProjects(normalized);
          setUsingFallback(false);
        } else {
          setProjects(fallbackProjects.map(normalizeProject));
          setUsingFallback(true);
        }
        setTestimonials(Array.isArray(apiTestimonials) ? apiTestimonials : []);
        setError(null);
      } catch (err) {
        if (!active) return;
        const message = err instanceof Error ? err.message : "Portfolio API unavailable.";
        setError(message);
        setProjects(fallbackProjects.map(normalizeProject));
        setProfile(fallbackProfile);
        setUsingFallback(true);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadPortfolio();
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({ profile, projects, testimonials, loading, error, usingFallback }),
    [profile, projects, testimonials, loading, error, usingFallback],
  );

  return <PortfolioContentContext.Provider value={value}>{children}</PortfolioContentContext.Provider>;
}

export function usePortfolioContent() {
  const context = useContext(PortfolioContentContext);
  if (!context) {
    throw new Error("usePortfolioContent must be used inside PortfolioContentProvider.");
  }
  return context;
}
