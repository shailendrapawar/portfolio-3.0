"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { type IProject } from "@/lib/data/projectItems";

import ProjectCard from "./ProjectCard";

type Filter = "all" | "frontend" | "fullstack" | "app";

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Full Stack", value: "fullstack" },
  { label: "App", value: "app" },
];

export default function ProjectList({ projects }: { projects: IProject[] }) {
  const [active, setActive] = useState<Filter>("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.category === active),
    [active, projects]
  );

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <nav className="flex flex-wrap justify-center gap-1 rounded-full border border-border bg-muted p-1">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActive(filter.value)}
            className={cn(
              "rounded-full px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm",
              active === filter.value
                ? "bg-primary text-white shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.label}
          </button>
        ))}
      </nav>

      <div className="flex w-full flex-wrap justify-center gap-6 animate-in fade-in duration-500">
        {visible.map((project) => (
          <div
            key={project.title}
            className="flex w-full justify-center sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <ProjectCard data={project} />
          </div>
        ))}
      </div>
    </div>
  );
}
