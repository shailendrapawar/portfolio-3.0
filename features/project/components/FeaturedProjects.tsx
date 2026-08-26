import Link from "next/link";

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
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-accent sm:text-3xl">
          Featured Projects
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          A selection of things I&apos;ve built.
        </p>
      </div>

      <div className="flex w-full flex-wrap justify-center gap-6 animate-in fade-in duration-500">
        {featured.map((project) => (
          <div
            key={project.title}
            className="flex w-full justify-center sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <ProjectCard data={project} />
          </div>
        ))}
      </div>

      <Link
        href="/projects"
        className="rounded-full border border-border bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground transition-transform hover:scale-105"
      >
        All Projects
      </Link>
    </section>
  );
}
