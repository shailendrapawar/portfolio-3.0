import { Reveal } from "@/components/animations";
import ProjectList from "./components/ProjectList";
import type { IProject } from "./model";

export default function Project({ projects }: { projects: IProject[] }) {
  return (
    <div className="mx-auto flex w-full max-w-250 flex-col items-center gap-8 p-4">
      <Reveal className="flex w-full flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-accent sm:text-3xl">
          All Projects
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          Everything I&apos;ve built.
        </p>
      </Reveal>

      <ProjectList projects={projects} />
    </div>
  );
}
