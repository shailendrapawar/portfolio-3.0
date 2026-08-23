export type ContactPayload = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default async function sendEmailService(data: ContactPayload) {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to send message");

  return res.json();
}
