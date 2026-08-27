export type ContactPayload = {
  name: string;
  email: string;
  purpose: string;
  message: string;
};

export default async function sendEmailService(data: ContactPayload) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await res.json().catch(() => null);

  // Surface the server's message (e.g. the rate-limit notice) to the caller.
  if (!res.ok || !body?.success) {
    throw new Error(body?.message ?? "Failed to send message");
  }

  return body;
}
