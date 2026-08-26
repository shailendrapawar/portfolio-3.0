"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import MagicBall from "@/components/MagicBall";

import sendEmailService from "./services/sendEmailService";

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const subjectOptions = [
  "Project Collaboration",
  "Freelance Inquiry",
  "Job Opportunity",
  "Resume/Portfolio Feedback",
  "General Inquiry",
  "Others",
];

const initialData = { name: "", email: "", purpose: "", message: "" };

export default function Contact() {
  const [emailData, setEmailData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEmailData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setStatus(null);

    const { name, email, purpose, message } = emailData;

    if (!name || !email || !purpose || !message) {
      setStatus({ type: "error", text: "All fields are required." });
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setStatus({ type: "error", text: "Please enter a valid email." });
      return;
    }

    try {
      setLoading(true);
      await sendEmailService({ name, email, purpose, message });
      setEmailData(initialData);
      setStatus({
        type: "success",
        text: "Message sent! I'll get back to you soon.",
      });
    } catch (err) {
      console.error(err);
      setStatus({
        type: "error",
        text: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 flex min-h-[calc(100vh-5rem)] w-full items-center justify-center overflow-x-clip p-5">
      <main className="relative z-10 flex w-full max-w-200 items-center justify-center">
        <section className="relative z-10 flex w-full max-w-160 flex-col items-start gap-5 rounded-2xl border border-border bg-card/60 p-6 shadow-lg backdrop-blur-xl sm:p-8">
          <h3 className="text-3xl font-semibold text-accent">Get in Touch🫣</h3>

          <p className="text-xl text-foreground">
            Hello,
            <br />
            <span className="text-secondary">Feel free to connect</span>
          </p>

          <form
            onSubmit={handleSubmit}
            className="z-10 flex w-full max-w-100 flex-col gap-3 self-center sm:w-[90%]"
          >
            <Input
              name="name"
              value={emailData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              disabled={loading}
              className="h-11 rounded-full px-4"
            />

            <Input
              name="email"
              type="email"
              value={emailData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled={loading}
              className="h-11 rounded-full px-4"
            />

            <Select
              value={emailData.purpose}
              onValueChange={(value) =>
                setEmailData((prev) => ({ ...prev, purpose: String(value) }))
              }
              disabled={loading}
            >
              <SelectTrigger className="h-11 w-full rounded-full px-4">
                <SelectValue placeholder="What's this regarding?" />
              </SelectTrigger>
              <SelectContent>
                {subjectOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Textarea
              name="message"
              value={emailData.message}
              onChange={handleChange}
              placeholder="Enter your message"
              disabled={loading}
              className="min-h-32 rounded-2xl px-4 py-3"
            />

            {status && (
              <p
                className={cn(
                  "text-sm",
                  status.type === "error" ? "text-destructive" : "text-primary"
                )}
              >
                {status.text}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="h-10 w-24 self-end rounded-full"
            >
              {loading ? "Sending..." : "SEND"}
            </Button>
          </form>
        </section>

        {/* Decorative floating magic balls */}
        <MagicBall extraClasses="-z-10 top-16 right-[15%] magicBall-anime" delay={0} />
        <MagicBall
          extraClasses="-z-10 bottom-20 left-[5%] md:left-[15%] magicBall-anime"
          delay={0.5}
        />
        <MagicBall
          extraClasses="-z-10 top-52 right-[5%] md:right-[15%] magicBall-anime"
          delay={1.2}
        />
        <MagicBall
          extraClasses="-z-10 bottom-5 right-[20%] md:right-[30%] magicBall-anime"
          delay={1.9}
        />
        <MagicBall extraClasses="-z-10 top-40 left-[25%] magicBall-anime" delay={0.3} />
      </main>
    </div>
  );
}
