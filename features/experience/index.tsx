import { Reveal } from "@/components/animations";
import ExperienceTimeline from "./components/ExperienceTimeline";
import { toTimelineItems } from "./adapters";
import type { IWorkExperience } from "./model";

export default function Experience({
  experiences,
}: {
  experiences: IWorkExperience[];
}) {
  const items = toTimelineItems(experiences);

  return (
    <div className="mx-auto flex min-h-[calc(100vh-40vh)] w-full max-w-250 flex-col items-center gap-8 p-4">
      <Reveal className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-accent sm:text-3xl">
          Experience
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          My professional journey so far.
        </p>
      </Reveal>

      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">No experience yet.</p>
      )}

      <ExperienceTimeline items={items} />
    </div>
  );
}
