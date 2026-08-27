"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { memo, useEffect, useMemo, useState } from "react";
import { FaLink, FaGithub } from "react-icons/fa6";
import { IProject } from "../model";



function ProjectCard({ data }: { data: IProject }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme is only known on the client; avoid a hydration mismatch by rendering
  // the light badge until the resolved theme is available.
  useEffect(() => setMounted(true), []);

  // `skills` is now a string[]; tolerate the legacy comma-separated string too.
  const skillList = Array.isArray(data.skills)
    ? data.skills
    : data.skills
      ? String(data.skills).split(",")
      : [];

  // skillicons expects a comma-separated list, so join the array back for the URL.
  const skillsParam = skillList.filter(Boolean).join(",");

  const skillSrc = useMemo(() => {
    const theme = mounted && resolvedTheme === "dark" ? "dark" : "light";
    return `https://skillicons.dev/icons?i=${skillsParam}&theme=${theme}`;
  }, [skillsParam, mounted, resolvedTheme]);

  // skillicons renders each icon at ~48px square; size the width to the count.
  const skillCount = skillsParam ? skillsParam.split(",").length : 0;

  // `img` is now an object ({ url, id }); tolerate the legacy string shape too.
  const DEFAULT_IMG =
    "https://res.cloudinary.com/soty762i/image/upload/v1787680320/defualt-project-img.jpg";
  const imgSrc =
    (typeof data.img === "string" ? data.img : data.img?.url) || DEFAULT_IMG;

  return (
    <div className="group relative aspect-[3/4] w-full max-w-[340px] overflow-hidden rounded-2xl border border-border bg-card">
      {/* Background image */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src={imgSrc}
          alt={data.title}
          fill
          sizes="(max-width: 640px) 100vw, 340px"
          className="object-cover transition-transform duration-700 will-change-transform group-hover:scale-110"
          unoptimized
        />

        {/* Dark gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
      </div>

      {/* Top action buttons */}
      <div className="absolute inset-x-4 top-4 z-10 flex -translate-y-2 justify-between opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
        {data.live && (
          <a
            href={data.live}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full border border-border bg-primary px-3 py-1.5 text-sm text-primary-foreground backdrop-blur-md transition-transform hover:scale-105"
          >
            <FaLink className="h-4 w-4" />
            Live
          </a>
        )}

        {data.github && (
          <a
            href={data.github}
            target="_blank"
            rel="noopener noreferrer"
            className="ml-auto flex items-center gap-2 rounded-full border border-border bg-primary px-3 py-1.5 text-sm text-primary-foreground backdrop-blur-md transition-transform hover:scale-105"
          >
            <FaGithub className="h-4 w-4" />
            Code
          </a>
        )}
      </div>

      {/* Bottom content */}
      <div className="absolute inset-x-0 bottom-0 z-10 p-5">
        <h3 className="mb-2 line-clamp-1 text-lg font-bold text-white">
          {data.title}
        </h3>

        <p className="mb-4 line-clamp-3 text-sm text-white/75">
          {data.description}
        </p>

        {skillCount > 0 && (
          <div className="flex justify-start">
            <Image
              key={skillSrc}
              src={skillSrc}
              alt="tech stack"
              width={skillCount * 48}
              height={48}
              className="h-9 w-auto"
              unoptimized
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(ProjectCard);
