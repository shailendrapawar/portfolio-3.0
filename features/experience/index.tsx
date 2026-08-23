import { workExpirienceItems } from "@/lib/data/workExperience";

import ExperienceTimeline from "./components/ExperienceTimeline";

export default function Experience() {
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

      <ExperienceTimeline items={workExpirienceItems} />
    </div>
  );
}
