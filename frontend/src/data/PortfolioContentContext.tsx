import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { profile as fallbackProfile, projects as fallbackProjects, timeline as fallbackExperience } from "./profile";
import { skillGroups as fallbackSkillGroups } from "./skills";
import { getEducation, getExperience, getProfile, getProjects, getSkills, getSocialLinks, getTestimonials } from "../services/portfolio";
import type { EducationItem, ExperienceItem, Profile, Project, Skill, SocialLink, Testimonial } from "../types/portfolio";

type PortfolioContent = {
  profile: Profile;
  projects: Project[];
  testimonials: Testimonial[];
  skills: Skill[];
  experience: ExperienceItem[];
  education: EducationItem[];
  socialLinks: SocialLink[];
  loading: boolean;
  error: string | null;
};

const PortfolioContentContext = createContext<PortfolioContent | null>(null);

export function PortfolioContentProvider({ children }: { children: React.ReactNode }) {
  const [profile, setProfile] = useState(fallbackProfile);
  const [projects, setProjects] = useState(fallbackProjects);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [skills, setSkills] = useState<Skill[]>(
    fallbackSkillGroups.flatMap((group, groupIndex) =>
      group.items.map((item, itemIndex) => ({
        ...item,
        category: group.category,
        familiarity: "Worked with",
        displayOrder: groupIndex * 10 + itemIndex,
      })),
    ),
  );
  const [experience, setExperience] = useState<ExperienceItem[]>(fallbackExperience);
  const [education, setEducation] = useState<EducationItem[]>([]);
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    Promise.all([getProfile(), getProjects(), getTestimonials(), getSkills(), getExperience(), getEducation(), getSocialLinks()])
      .then(([apiProfile, apiProjects, apiTestimonials, apiSkills, apiExperience, apiEducation, apiSocialLinks]) => {
        if (!active) return;
        setProfile(apiProfile);
        setProjects(apiProjects);
        setTestimonials(apiTestimonials);
        setSkills(apiSkills);
        setExperience(apiExperience);
        setEducation(apiEducation);
        setSocialLinks(apiSocialLinks);
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
    () => ({ profile, projects, testimonials, skills, experience, education, socialLinks, loading, error }),
    [profile, projects, testimonials, skills, experience, education, socialLinks, loading, error],
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
