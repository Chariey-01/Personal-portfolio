export type ContactPayload = {
  name: string;
  email: string;
  message: string;
};

export async function submitContact(payload: ContactPayload) {
  const response = await fetch("/api/contact", {
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
