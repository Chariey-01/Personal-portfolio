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
};

const PortfolioContentContext = createContext<PortfolioContent | null>(null);

export function PortfolioContentProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState(fallbackProfile);
  const [projects, setProjects] = useState(fallbackProjects);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getProfile(), getProjects(), getTestimonials()])
      .then(([apiProfile, apiProjects, apiTestimonials]) => {
        if (!active) return;
        setProfile(apiProfile);
        setProjects(apiProjects);
        setTestimonials(apiTestimonials);
        setError(null);
      })
      .catch((err: Error) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const value = useMemo(
    () => ({ profile, projects, testimonials, loading, error }),
    [profile, projects, testimonials, loading, error],
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
