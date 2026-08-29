import Link from "next/link";

import { Reveal } from "@/components/animations";
import { WorkExperienceService } from "../service";
import type { IWorkExperience } from "../model";
import ExperienceTimeline from "./ExperienceTimeline";
import { toTimelineItems } from "../adapters";

export default async function LatestExperience() {
  // Fetched server-side so the home page can be statically cached (ISR).
  const { items } = await WorkExperienceService.search();
  const experiences = JSON.parse(JSON.stringify(items)) as IWorkExperience[];

  // API returns entries sorted by start date descending; take the latest two.
  const latest = toTimelineItems(experiences).slice(0, 2);

  return (
    <section className="mx-auto flex w-full max-w-250 flex-col items-center gap-8 p-4">
      <Reveal className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-accent sm:text-3xl">
          Experience
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          Where I&apos;ve been working recently.
        </p>
      </Reveal>

      <Reveal className="w-full">
        <ExperienceTimeline items={latest} />
      </Reveal>

      <Reveal>
        <Link
          href="/experience"
          className="inline-block rounded-full border border-border bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
        >
          All Experience
        </Link>
      </Reveal>
    </section>
  );
}
