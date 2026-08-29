import Image from "next/image";

import { Reveal, Stagger, StaggerItem } from "@/components/animations";
import { AuthService } from "@/features/auth/service";

// Fallback shown if no profile picture has been set yet.
const FALLBACK_ILLUSTRATION =
  "https://res.cloudinary.com/soty762i/image/upload/v1787480000/test.png";

export default async function AboutMe() {
  // Fetched server-side (like LatestExperience) so the home page stays cacheable.
  const profile = await AuthService.getPublicProfile();
  const illustration = profile?.profilePicture?.url || FALLBACK_ILLUSTRATION;
  const name = profile?.name || "Shailendra Pawar";

  return (
    <div className="relative flex min-h-150 w-full max-w-full justify-center overflow-x-clip p-5 sm:min-h-90">
      <section className="relative z-10 flex w-full max-w-250 flex-col items-center justify-center gap-8 sm:flex-row-reverse sm:gap-12">
        <Stagger className="z-10 flex w-full flex-col items-center justify-center gap-5 text-foreground sm:flex-1 sm:items-start">
          <StaggerItem className="w-full">
            <h3 className="w-full text-center text-accent sm:text-xl md:text-xl">
              ABOUT ME
            </h3>
          </StaggerItem>

          <StaggerItem className="w-full">
            <h5 className="w-full text-center sm:text-xl lg:text-xl">
              Building <b className="text-secondary">Ideas</b> into{" "}
              <b className="text-secondary">Reality</b>
            </h5>
          </StaggerItem>

          <StaggerItem className="w-full">
            <p className="text-center text-sm text-muted-foreground sm:text-left sm:text-base md:text-lg">
              I&apos;m a software developer who loves turning ideas into clean,
              scalable, and meaningful digital experiences.
            </p>
          </StaggerItem>

          <StaggerItem className="w-full">
            <p className="text-center text-sm text-muted-foreground sm:text-left sm:text-base md:text-lg">
              From intuitive interfaces to robust backend systems, I enjoy
              building across the stack. Always learning, experimenting, and
              finding better ways to solve problems with technology.
            </p>
          </StaggerItem>
        </Stagger>

        <Reveal direction="left" className="flex w-full items-center justify-center sm:flex-1">
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
                alt={name}
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
        </Reveal>
      </section>
    </div>
  );
}
