export type Link = {
  label: string;
  href: string;
};

export type Project = {
  title: string;
  status: "shipped" | "in-progress" | "needs-details";
  summary: string;
  role: string;
  stack: string[];
  problem: string;
  architecture: string[];
  highlights: string[];
  technicalChallenges: string[];
  repoUrl?: string;
  liveUrl?: string;
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export type TimelineItem = {
  label: string;
  title: string;
  organization: string;
  description: string;
};
