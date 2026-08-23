"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";

import { TechIcon } from "@/components/TechIcon";
import { cn } from "@/lib/utils";
import {
  backendSkills,
  databaseSkills,
  frontendSkills,
  skills,
  toolSkills,
  type ISkills,
} from "@/lib/data/skillItems";

type CategoryKey = "frontend" | "backend" | "database" | "tool";

const categories: { title: string; key: CategoryKey; items: ISkills }[] = [
  { title: "Frontend", key: "frontend", items: frontendSkills },
  { title: "Backend", key: "backend", items: backendSkills },
  { title: "Database", key: "database", items: databaseSkills },
  { title: "Tools", key: "tool", items: toolSkills },
];

type View = "grouped" | "interactive";

/**
 * Picks the icon that contrasts with the current background:
 * dark mode -> light icon, light mode -> dark icon.
 * Falls back to defaultIcon when the variant is missing.
 * Returns defaultIcon until mounted to avoid hydration mismatch.
 */
function useSkillIcon() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (skill: ISkills[number]) => {
    if (!mounted) return skill.defaultIcon;
    return resolvedTheme === "dark"
      ? skill.lightIcon ?? skill.defaultIcon
      : skill.darkIcon ?? skill.defaultIcon;
  };
}

export default function SkillSet() {
  const [view, setView] = useState<View>("interactive");

  return (
    <div className="mx-auto flex w-full max-w-250 flex-col items-center gap-8 p-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-accent sm:text-3xl">
          My Stack
        </h2>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "grouped" ? <GroupedView /> : <InteractiveView />}
    </div>
  );
}

/* ---------------- View toggle ---------------- */

function ViewToggle({
  view,
  onChange,
}: {
  view: View;
  onChange: (v: View) => void;
}) {
  const options: { label: string; value: View }[] = [
    { label: "Interactive", value: "interactive" },
    { label: "Grouped", value: "grouped" },
  ];

  return (
    <div className="flex gap-1 rounded-full border border-border bg-muted p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "rounded-full px-4 py-1.5 text-xs font-medium transition-colors sm:text-sm",
            view === opt.value
              ? "bg-primary text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Grouped grid view ---------------- */

function GroupedView() {
  const iconFor = useSkillIcon();

  return (
    <div className="flex w-full flex-col gap-10 animate-in fade-in duration-500">
      {categories.map((category) => (
        <section key={category.key} className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold text-secondary sm:text-xl">
            {category.title}
          </h3>

          <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
            {category.items.map((skill) => (
              <div
                key={skill.code}
                className="group flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border border-border bg-card p-2.5 transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_0_22px_rgba(37,99,235,0.28)]"
              >
                <span className="transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:rotate-6 group-hover:scale-115">
                  <TechIcon icon={iconFor(skill)} size={30} />
                </span>
                <h4 className="text-center text-xs text-foreground">
                  {skill.name}
                </h4>

                <div className="h-0.5 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all duration-500 group-hover:brightness-110"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

/* ---------------- Interactive floating view ---------------- */

function InteractiveView() {
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(null);
  const iconFor = useSkillIcon();

  return (
    <div className="flex w-full flex-col items-center gap-8 animate-in fade-in duration-500">
      <div
        className="grid w-full grid-cols-4 place-items-center gap-4 sm:grid-cols-6 sm:gap-6"
        style={{ perspective: "600px" }}
      >
        {skills.map((skill, i) => {
          const isActive = activeCategory === skill.category;
          const isDimmed = activeCategory !== null && !isActive;

          return (
            <div
              key={skill.code}
              title={skill.name}
              className={cn(
                "skillAnime flex h-10 w-10 cursor-pointer items-center justify-center transition-[scale,filter,opacity] duration-300 ease-out sm:h-14 sm:w-14",
                i % 2 === 0 ? "animate-combo-one" : "animate-combo-two",
                isActive
                  ? "scale-125 grayscale-0"
                  : "grayscale hover:grayscale-0",
                isDimmed && "opacity-30"
              )}
              style={{
                animationDelay: `${(i % 5) * 0.35}s`,
                ...(isActive ? { animation: "none" } : {}),
              }}
            >
              <TechIcon
                icon={iconFor(skill)}
                size="100%"
                className="h-full w-full"
              />
            </div>
          );
        })}
      </div>

      {/* Category selector: hover on desktop, tap on touch devices */}
      <nav className="mx-auto flex w-full max-w-[340px] items-center justify-between rounded-full border border-border bg-card/60 px-1 py-1 shadow-lg backdrop-blur-xl sm:max-w-[480px] sm:px-2">
        {categories.map((item) => {
          const isActive = activeCategory === item.key;

          return (
            <button
              key={item.key}
              type="button"
              onMouseEnter={() => setActiveCategory(item.key)}
              onMouseLeave={() => setActiveCategory(null)}
              onClick={() =>
                setActiveCategory((prev) =>
                  prev === item.key ? null : item.key
                )
              }
              className={cn(
                "relative flex-1 rounded-full px-2 py-2 text-center text-[11px] font-medium transition-colors sm:text-sm",
                isActive
                  ? "text-accent"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.title}
              <span
                className={cn(
                  "absolute bottom-1 left-1/2 h-0.5 -translate-x-1/2 rounded-full bg-accent transition-all duration-300",
                  isActive ? "w-3/5 opacity-100" : "w-0 opacity-0"
                )}
              />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
