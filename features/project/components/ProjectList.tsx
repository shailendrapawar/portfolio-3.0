"use client";

import { useMemo, useState } from "react";

import { cn } from "@/lib/utils";
import { Reveal, Stagger, StaggerItem } from "@/components/animations";

import ProjectCard from "./ProjectCard";
import { IProject } from "../model";
type Filter = "all" | "frontend" | "fullstack" | "app";

const filters: { label: string; value: Filter }[] = [
  { label: "All", value: "all" },
  { label: "Frontend", value: "frontend" },
  { label: "Full Stack", value: "fullstack" },
  { label: "App", value: "app" },
];

interface IProjectListProps {
  projects: IProject[];
}

export default function ProjectList({ projects }: IProjectListProps) {
  const [active, setActive] = useState<Filter>("all");

  const visible = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.category === active),
    [active, projects]
  );

  return (
    <div className="flex min-h-[calc(100vh-40vh)] w-full flex-col items-center gap-8">
      <Reveal className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setActive(filter.value)}
            className={cn(
              "rounded-full border px-4 py-2 text-xs font-medium shadow-lg backdrop-blur-xl transition-colors sm:text-sm",
              active === filter.value
                ? "border-primary bg-primary text-white shadow-sm"
                : "border-border bg-card/60 text-muted-foreground hover:text-foreground"
            )}
          >
            {filter.label}
          </button>
        ))}
      </Reveal>

      {/* Keyed on `active` so switching filters replays the stagger. */}
      <Stagger
        key={active}
        inView={false}
        className="flex w-full flex-wrap justify-center gap-6"
      >
        {visible.map((project) => (
          <StaggerItem
            key={project.title}
            className="flex w-full justify-center sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
          >
            <ProjectCard data={project} />
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  );
}
