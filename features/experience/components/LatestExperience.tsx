import Link from "next/link";

import { workExpirienceItems } from "@/lib/data/workExperience";

import ExperienceTimeline from "./ExperienceTimeline";

export default function LatestExperience() {
  // Latest two experiences (highest order first).
  const latest = [...workExpirienceItems]
    .sort((a, b) => b.order - a.order)
    .slice(0, 2);

  return (
    <section className="mx-auto flex w-full max-w-250 flex-col items-center gap-8 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-accent sm:text-3xl">
          Experience
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          Where I&apos;ve been working recently.
        </p>
      </div>

      <ExperienceTimeline items={latest} />

      <Link
        href="/experience"
        className="rounded-full border border-border bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
      >
        All Experience
      </Link>
    </section>
  );
}
