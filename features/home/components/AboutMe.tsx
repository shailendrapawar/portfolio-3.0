"use client";

import Image from "next/image";

const illustration =
  "https://res.cloudinary.com/soty762i/image/upload/v1787480000/test.png";

export default function AboutMe() {
  return (
    <div className="relative flex min-h-150 w-full max-w-full justify-center overflow-x-clip p-5 sm:min-h-90">
      <section className="animate-in fade-in relative z-10 flex w-full max-w-250 flex-col items-center justify-center gap-8 duration-500 sm:flex-row-reverse sm:gap-12">
        <aside className="z-10 flex w-full flex-col items-center justify-center gap-5 text-foreground sm:flex-1 sm:items-start">
          <h3 className="w-full animate-in fade-in slide-in-from-bottom-2 text-center text-accent duration-500 sm:text-xl md:text-xl">
            ABOUT ME
          </h3>

          <h5 className="w-full animate-in fade-in slide-in-from-bottom-2 text-center delay-100 duration-500 sm:text-xl lg:text-xl">
            Building <b className="text-secondary">Ideas</b> into{" "}
            <b className="text-secondary">Reality</b>
          </h5>

          <p className="animate-in fade-in slide-in-from-bottom-2 text-center text-sm text-muted-foreground delay-200 duration-700 sm:text-left sm:text-base md:text-lg">
            I&apos;m a software developer who loves turning ideas into clean,
            scalable, and meaningful digital experiences.
          </p>

          <p className="animate-in fade-in slide-in-from-bottom-2 text-center text-sm text-muted-foreground delay-300 duration-700 sm:text-left sm:text-base md:text-lg">
            From intuitive interfaces to robust backend systems, I enjoy building
            across the stack. Always learning, experimenting, and finding better
            ways to solve problems with technology.
          </p>
        </aside>

        <figure className="flex w-full items-center justify-center sm:flex-1">
          <div className="group relative flex items-end justify-center">
            {/* Pedestal card behind the photo */}
            <div className="relative h-[17rem] w-64 overflow-hidden rounded-3xl border border-border bg-gradient-to-b from-card to-muted sm:h-[19rem] sm:w-72">
              {/* Ambient gradient glow */}
              <div
                aria-hidden
                className="absolute -inset-3 -z-10 rounded-[2rem] bg-gradient-to-tr from-primary via-accent to-secondary opacity-40 blur-2xl transition-opacity duration-500 group-hover:opacity-70"
              />
              {/* Inner top sheen for depth */}
              <div
                aria-hidden
                className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent"
              />

              {/* Photo contained within the pedestal */}
              <Image
                src={illustration}
                alt="Shailendra Pawar"
                fill
                sizes="(max-width: 640px) 16rem, 18rem"
                className="pointer-events-none object-contain object-center drop-shadow-[0_18px_30px_rgba(0,0,0,0.5)]"
                unoptimized
              />
            </div>

            {/* Ground shadow anchoring the figure */}
            <div
              aria-hidden
              className="absolute bottom-1 left-1/2 h-3 w-1/2 -translate-x-1/2 rounded-[50%] bg-black/20 blur-lg transition-all duration-500 group-hover:w-3/5 group-hover:opacity-60"
            />
          </div>
        </figure>
      </section>
    </div>
  );
}
