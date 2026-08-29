"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import {
  FaServer,
  FaDatabase,
  FaLaptopCode,
  FaChartLine,
  FaCloud,
} from "react-icons/fa";
import { FaLink } from "react-icons/fa6";
import { BsWindowSidebar } from "react-icons/bs";

import MagicBall from "@/components/MagicBall";
import { Reveal, Stagger, StaggerItem } from "@/components/animations";

const wizards = {
  light:
    "https://res.cloudinary.com/soty762i/image/upload/v1787428920/purple-wizard-meditating.png",
  dark: "https://res.cloudinary.com/soty762i/image/upload/v1787428920/white-wizard-meditating.png",
};

const serviceCards = [
  { title: "Full-Stack Web Development", Icon: FaLaptopCode },
  { title: "Backend & API Development", Icon: FaServer },
  { title: "SaaS & Business Applications", Icon: FaChartLine },
  { title: "Deployment & Cloud Solutions", Icon: FaCloud },
];

export default function Services() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme is only known on the client; avoid hydration mismatch.
  useEffect(() => setMounted(true), []);

  // Render light by default so the image is in the initial HTML and can start
  // fetching immediately; swap to the dark variant once the theme is known.
  const src = mounted && resolvedTheme === "dark" ? wizards.dark : wizards.light;

  return (
    <div className="relative flex min-h-100 w-full items-center justify-center overflow-x-clip p-5">
      <section className="flex w-full max-w-250 flex-col items-center gap-8 sm:flex-row sm:items-center sm:gap-12 sm:p-5 lg:gap-16">
        <aside className="flex w-full flex-col items-center gap-4 sm:flex-1 sm:items-start">
          <Stagger className="flex w-full flex-col items-center gap-4 sm:items-start">
            <StaggerItem className="w-full">
              <h3 className="w-full text-center text-xl text-accent md:text-2xl">
                Services
              </h3>
            </StaggerItem>

            <StaggerItem className="w-full">
              <h4 className="w-full text-center text-xl text-foreground md:text-2xl">
                What I provide as a <b className="text-secondary">Service</b>
              </h4>
            </StaggerItem>
          </Stagger>

          <Stagger
            delay={0.15}
            className="mt-2 grid w-full grid-cols-1 gap-3 sm:grid-cols-2"
          >
            {serviceCards.map((service) => (
              <StaggerItem key={service.title}>
                <div className="group relative flex h-full flex-col items-center justify-center gap-2 rounded-2xl border border-border bg-gradient-to-br from-card to-muted p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_10px_30px_rgba(37,99,235,0.25)]">
                  {/* Ambient glow revealed on hover */}
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-tr from-primary via-accent to-secondary opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-30"
                  />

                  {/* Icon badge */}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-white shadow-sm ring-1 ring-white/20 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6">
                    <service.Icon className="h-4 w-4" />
                  </span>

                  <h5 className="text-sm font-semibold text-foreground">
                    {service.title}
                  </h5>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </aside>

        {/* p-8 reserves space for the magic balls, which orbit ~2rem beyond
            the ring; without it the balls overflow into the gap inconsistently */}
        <Reveal
          direction="right"
          className="flex w-full items-center justify-center p-8 sm:w-auto sm:shrink-0"
        >
          <div className="float-anime">
          <div className="service-ring relative flex h-60 w-60 items-center justify-center rounded-full border border-secondary sm:h-70 sm:w-70 md:h-76 md:w-76">
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

            <div className="service-unrotate relative h-50 w-40 md:h-55 md:w-46">
              <Image
                key={src}
                src={src}
                alt="Wizard meditating"
                fill
                sizes="(max-width: 768px) 10rem, 11.5rem"
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
          </div>
        </Reveal>
      </section>
    </div>
  );
}
