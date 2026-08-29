"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { TechIcon } from "@/components/TechIcon";
import { Reveal } from "@/components/animations";
import { type IWorkExpirienceItem } from "../adapters";

// LinkedIn may be stored as a full URL or a bare handle; normalize to a URL.
function linkedinHref(value: string) {
  return /^https?:\/\//i.test(value)
    ? value
    : `https://www.linkedin.com/company/${value.replace(/^@/, "")}`;
}

export default function ExperienceTimeline({
  items,
}: {
  items: IWorkExpirienceItem[];
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  // Theme is only known on the client; default to light until it's resolved.
  useEffect(() => setMounted(true), []);
  const skillTheme = mounted && resolvedTheme === "dark" ? "dark" : "light";

  const toggle = (idx: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });

  if (!items.length) return null;

  // Most recent first (highest order at the top).
  const sorted = [...items].sort((a, b) => b.order - a.order);

  return (
    <ol className="relative mx-auto w-full max-w-250 overflow-x-clip py-4">
      {/* Center line with an upward-flowing highlight */}
      <div
        aria-hidden
        className="absolute left-4 top-0 z-0 h-full w-1 overflow-hidden rounded-full bg-gradient-to-b from-primary/70 via-secondary/70 to-accent/70 md:left-1/2 md:-translate-x-1/2"
      >
        <span className="timeline-flow absolute inset-x-0 top-0 h-1/3 bg-gradient-to-t from-transparent via-white/80 to-transparent" />
      </div>

      {sorted.map((item, i) => {
        const isLeft = i % 2 === 0;
        const skillCount = item.skills
          ? item.skills.split(",").filter(Boolean).length
          : 0;
        const skillSrc = `https://skillicons.dev/icons?i=${item.skills ?? ""}&theme=${skillTheme}`;

        const pointers = item.pointers ?? [];
        const isExpanded = expanded.has(i);
        const hasPointers = pointers.length > 0;

        return (
          <li
            key={`${item.company}-${item.position}`}
            className="relative mb-8 last:mb-0 md:mb-12 md:grid md:grid-cols-2 md:gap-x-12"
          >
            {/* Dot marker on the line */}
            <span
              aria-hidden
              className="absolute left-4 top-3 z-10 flex h-3 w-3 -translate-x-1/2 items-center justify-center md:left-1/2"
            >
              {item.isCurrent && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              )}
              <span className="relative h-3 w-3 rounded-full bg-primary ring-4 ring-background" />
            </span>

            {/* Card */}
            <Reveal
              direction={isLeft ? "right" : "left"}
              className={cn(
                "min-w-0 pl-12 md:pl-0",
                isLeft ? "md:col-start-1" : "md:col-start-2"
              )}
            >
              <div className="group relative flex flex-col gap-2 rounded-2xl border border-border bg-gradient-to-br from-card to-muted p-5 transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(37,99,235,0.25)]">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <span className="text-xs font-medium text-accent">
                    {item.startDate} – {item.isCurrent ? "Present" : item.endDate}
                  </span>
                  {item.isCurrent && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                      Current
                    </span>
                  )}
                </div>

                <h4 className="text-base font-semibold text-foreground">
                  {item.position}
                </h4>
                <p className="text-sm font-medium text-secondary">
                  {item.company}
                </p>
                {item.description && (
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}

                {isExpanded && hasPointers && (
                  <ul className="flex list-disc flex-col gap-1 pl-4 text-sm leading-relaxed text-muted-foreground">
                    {pointers.map((point, idx) => (
                      <li key={idx}>{point}</li>
                    ))}
                  </ul>
                )}

                {hasPointers && (
                  <button
                    type="button"
                    onClick={() => toggle(i)}
                    className="w-fit text-xs font-semibold text-primary transition-colors hover:text-accent"
                  >
                    {isExpanded ? "See less" : "See more"}
                  </button>
                )}

                {item.skills && (
                  <Image
                    key={skillSrc}
                    src={skillSrc}
                    alt="tech stack"
                    width={skillCount * 48}
                    height={48}
                    className="mt-1 h-7 w-auto self-start"
                    unoptimized
                  />
                )}

                {(item.linkedin || item.credentials) && (
                  <div className="mt-1 flex flex-wrap items-center gap-2">
                    {item.linkedin && (
                      <a
                        href={linkedinHref(item.linkedin)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-primary"
                      >
                        <TechIcon icon="mdi:linkedin" size={16} />
                        LinkedIn
                      </a>
                    )}
                    {item.credentials && (
                      <a
                        href={item.credentials}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        <TechIcon icon="mdi:certificate-outline" size={16} />
                        Credentials
                        <TechIcon icon="mdi:open-in-new" size={13} className="opacity-80" />
                      </a>
                    )}
                  </div>
                )}
              </div>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
