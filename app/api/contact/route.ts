import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);

  const { name, email, subject, message } = data ?? {};

  if (!name || !email || !subject || !message) {
    return NextResponse.json(
      { error: "All fields are required." },
      { status: 400 }
    );
  }

  // TODO: integrate an email provider (Resend, Nodemailer, EmailJS, etc.).
  console.log("Contact form submission:", { name, email, subject, message });

  return NextResponse.json({ ok: true });
}
