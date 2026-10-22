import type { ContactMessage, PortfolioDocument, Profile, Project, Testimonial } from "../types/portfolio";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";

async function requestJson<T>(path: string, options: RequestInit = {}) {
  let response: Response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, options);
  } catch {
    throw new Error(`Network error while requesting ${path}. Check VITE_API_BASE_URL and backend availability.`);
  }
  const data = (await response.json().catch(() => null)) as T & { error?: string };
  if (!response.ok) {
    throw new Error(data?.error ?? `Request failed (${response.status}) for ${path}.`);
  }
  return data;
}

export function getProfile() {
  return requestJson<Profile>("/api/profile");
}

export function getProjects() {
  return requestJson<Project[]>("/api/projects");
}

export function getTestimonials() {
  return requestJson<Testimonial[]>("/api/testimonials");
}

export function getResume() {
  return requestJson<{ resume: { storageUrl: string } | null }>("/api/resume");
}

export function getAdminDocuments(token: string) {
  return adminRequest<PortfolioDocument[]>("/api/admin/documents", token);
}

export function getAdminContactMessages(token: string) {
  return adminRequest<ContactMessage[]>("/api/admin/contact-messages", token);
}

export function adminRequest<T>(path: string, token: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData) && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  return requestJson<T>(path, { ...options, headers });
}

export function loginAdmin(username: string, password: string) {
  return requestJson<{ token: string }>("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
}
