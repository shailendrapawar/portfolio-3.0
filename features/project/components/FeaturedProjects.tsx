import Link from "next/link";

import { Reveal, Stagger, StaggerItem } from "@/components/animations";
import { ProjectService } from "../service";
import type { IProject } from "../model";
import ProjectCard from "./ProjectCard";

export default async function FeaturedProjects() {
  // Fetched server-side so the home page can be statically cached (ISR).
  const { items } = await ProjectService.search({ isFeatured: true });
  // Mongoose docs aren't serializable across the server→client boundary.
  const featured = JSON.parse(JSON.stringify(items)) as IProject[];

  return (
    <section className="mx-auto flex w-full max-w-250 flex-col items-center gap-8 p-4">
      <Reveal className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-accent sm:text-3xl">
          Featured Projects
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          A selection of things I&apos;ve built.
        </p>
      </Reveal>

      <Stagger className="flex w-full flex-wrap justify-center gap-6">
        {featured.map((project) => (
          <StaggerItem
            key={project.title}
            className="flex w-full justify-center sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <ProjectCard data={project} />
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal>
        <Link
          href="/projects"
          className="inline-block rounded-full border border-border bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
        >
          All Projects
        </Link>
      </Reveal>
    </section>
  );
}
