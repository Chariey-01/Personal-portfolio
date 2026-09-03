export type ContactPayload = {
  name: string;
  email: string;
  inquiryType: string;
  message: string;
};

export const inquiryTypes = [
  "Job Opportunity",
  "Freelance / Project Proposal",
  "Collaboration",
  "Internship Opportunity",
  "Technical Discussion",
  "Mentorship / Networking",
  "Other",
] as const;

export async function submitContact(payload: ContactPayload) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "";
  const response = await fetch(`${apiBaseUrl}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => null)) as { error?: string } | null;
    throw new Error(data?.error ?? "Message could not be sent.");
  }

  return response.json() as Promise<{ message: string }>;
}
