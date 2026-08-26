"use client";

import ExperienceTimeline from "./components/ExperienceTimeline";
import { useSearchExperience } from "./hooks/useSearchExperience";
import { toTimelineItems } from "./adapters";

export default function Experience() {
  const { experiences, isLoading, error } = useSearchExperience();

  const items = toTimelineItems(experiences);

  return (
    <div className="mx-auto flex w-full max-w-250 flex-col items-center gap-8 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-accent sm:text-3xl">
          Experience
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          My professional journey so far.
        </p>
      </div>

      {isLoading && (
        <p className="text-sm text-muted-foreground">Loading experience…</p>
      )}
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}
      {!isLoading && !error && items.length === 0 && (
        <p className="text-sm text-muted-foreground">No experience yet.</p>
      )}

      <ExperienceTimeline items={items} />
    </div>
  );
}
