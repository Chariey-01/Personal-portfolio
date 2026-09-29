export type Link = {
  label: string;
  href: string;
};

export type Profile = {
  id?: number;
  name: string;
  alias: string;
  location: string;
  role: string;
  email: string;
  headline: string;
  bio: string;
  story: string;
  profileImage: string;
  profileImageAlt: string;
  availability?: string;
  focusStack: string[];
  resumeUrl?: string | null;
  cvUrl?: string | null;
  coverLetterUrl?: string | null;
  links: Link[];
};

export type Project = {
  id?: number;
  title: string;
  slug?: string;
  status: "In Progress" | "Completed" | "Live" | "Archived" | "shipped" | "in-progress" | "needs-details";
  summary: string;
  shortDescription?: string;
  longDescription?: string | null;
  caseStudy?: string;
  role: string;
  stack: string[];
  technologies?: string[];
  problem: string;
  solution?: string | null;
  architecture: string[];
  technicalDecisions?: string[];
  highlights: string[];
  technicalChallenges: string[];
  lessons?: string[];
  result?: string | null;
  year?: number | null;
  published?: boolean;
  accentFrom?: string | null;
  accentTo?: string | null;
  images?: ProjectImage[];
  githubUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  displayOrder?: number;
  archived?: boolean;
};

export type ProjectImage = {
  id: number;
  imageUrl: string;
  altText: string;
  caption?: string | null;
  displayOrder: number;
};

export type SkillGroup = {
  category: string;
  items: {
    name: string;
    detail: string;
  }[];
};

export type Skill = {
  id?: number;
  category: string;
  name: string;
  detail: string;
  familiarity: "Comfortable" | "Worked with" | "Growing" | "Currently learning" | string;
  displayOrder?: number;
  archived?: boolean;
};

export type TimelineItem = {
  label: string;
  title: string;
  organization: string;
  description: string;
};

export type ExperienceItem = TimelineItem & {
  id?: number;
  startDate?: string | null;
  endDate?: string | null;
  displayOrder?: number;
  archived?: boolean;
};

export type EducationItem = {
  id?: number;
  institution: string;
  program: string;
  description?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  displayOrder?: number;
  archived?: boolean;
};

export type SocialLink = {
  id?: number;
  label: string;
  url: string;
  displayOrder?: number;
  archived?: boolean;
};

export type Testimonial = {
  id: number;
  personName: string;
  role?: string;
  organization?: string;
  text: string;
  imageUrl?: string;
  profileUrl?: string;
  approved: boolean;
  displayOrder: number;
  archived?: boolean;
};

export type DocumentType = "RESUME" | "CV" | "COVER_LETTER" | "OTHER";

export type PortfolioDocument = {
  id: number;
  title: string;
  documentType: DocumentType;
  filename: string;
  originalFilename: string;
  storageUrl: string;
  uploadedAt: string | null;
  isCurrent: boolean;
  isPublic: boolean;
  downloadLabel?: string;
  archived?: boolean;
};

export type ContactMessage = {
  id: number;
  name: string;
  email: string;
  inquiryType: string;
  message: string;
  createdAt: string | null;
  archived?: boolean;
};
