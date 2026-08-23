"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FaServer, FaDatabase } from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { BsWindowSidebar } from "react-icons/bs";

import MagicBall from "@/components/MagicBall";

const wizards = {
  light:
    "https://res.cloudinary.com/soty762i/image/upload/v1787428920/purple-wizard-meditating.png",
  dark: "https://res.cloudinary.com/soty762i/image/upload/v1787428920/white-wizard-meditating.png",
};

export default function Services() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme is only known on the client; avoid hydration mismatch.
  useEffect(() => setMounted(true), []);

  // Render light by default so the image is in the initial HTML and can start
  // fetching immediately; swap to the dark variant once the theme is known.
  const src = mounted && resolvedTheme === "dark" ? wizards.dark : wizards.light;

  return (
    <div className="relative flex min-h-100 w-full animate-in fade-in items-center justify-center overflow-x-clip p-5 duration-500">
      <section className="flex h-150 w-full max-w-250 flex-col sm:h-100 sm:flex-row-reverse sm:justify-between sm:p-5">
        <aside className="flex h-[40%] w-full flex-col items-center justify-center gap-2 sm:h-full sm:w-[40%]">
          <h3 className="animate-in fade-in slide-in-from-bottom-2 text-center text-xl text-accent duration-500 md:text-2xl">
            Services
          </h3>

          <h4 className="animate-in fade-in slide-in-from-bottom-2 mt-3 text-center text-xl text-foreground delay-100 duration-500 md:text-2xl">
            What I provide as a{" "}
            <b className="text-secondary">Service</b>
          </h4>

          <p className="animate-in fade-in slide-in-from-bottom-2 mt-2 text-center text-sm text-muted-foreground delay-200 duration-700 md:text-lg">
            I provide full-stack web development services using modern
            technologies like React.js, Node.js, Express, and MongoDB. From
            building responsive UIs to creating secure APIs and deploying
            scalable applications, I help turn ideas into real,
            production-ready products.
          </p>
        </aside>

        <figure className="float-anime flex h-[60%] items-center justify-center sm:h-full sm:w-[50%]">
          <div className="service-ring relative flex h-60 w-60 items-center justify-center rounded-full border border-secondary sm:h-70 sm:w-70 md:h-90 md:w-90">
            <MagicBall
              title="API"
              extraClasses="-top-8 service-unrotate"
              icon={<FaLink className="h-5 w-5 text-black" />}
            />
            <MagicBall
              title="Database"
              extraClasses="-right-8 service-unrotate"
              icon={<FaDatabase className="h-5 w-5 text-black" />}
            />

            <div className="service-unrotate relative h-50 w-40 md:h-65 md:w-55">
              <Image
                key={src}
                src={src}
                alt="Wizard meditating"
                fill
                sizes="(max-width: 768px) 10rem, 13.75rem"
                className="object-contain"
                priority
                unoptimized
                suppressHydrationWarning
              />
            </div>

            <MagicBall
              title="Frontend"
              extraClasses="-bottom-8 service-unrotate"
              icon={<BsWindowSidebar className="h-5 w-5 text-black" />}
            />
            <MagicBall
              title="Server"
              extraClasses="-left-8 service-unrotate"
              icon={<FaServer className="h-5 w-5 text-black" />}
            />
          </div>
        </figure>
      </section>
    </div>
  );
}
