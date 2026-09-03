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
  caseStudy?: string;
  role: string;
  stack: string[];
  technologies?: string[];
  problem: string;
  architecture: string[];
  highlights: string[];
  technicalChallenges: string[];
  githubUrl?: string;
  repoUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
  featured?: boolean;
  displayOrder?: number;
  archived?: boolean;
};

export type SkillGroup = {
  category: string;
  items: {
    name: string;
    detail: string;
  }[];
};

export type TimelineItem = {
  label: string;
  title: string;
  organization: string;
  description: string;
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
