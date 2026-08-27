import Link from "next/link";
import { FaGithub } from "react-icons/fa";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

import MagicBall from "@/components/MagicBall";
import { socialUrls } from "@/lib/data/socialItems";
import { AuthService } from "@/features/auth/service";
import Wizard from "./Wizard";
import ResumeButton from "./ResumeButton";

async function Landing() {
  // Fetched server-side so the home page stays cacheable (ISR), like the
  // experience section.
  const profile = await AuthService.getPublicProfile();
  const name = profile?.name || "Shailendra Pawar";
  const designation = profile?.designation || "Full Stack Developer";
  const bio =
    profile?.bio?.trim() ||
    "MERN stack wizard , with a knack for real-time features, and seemless user experience";

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] justify-center">
      <section className="flex min-h-[calc(100vh-80px)] w-full max-w-250 flex-col sm:flex-row">
        <main className="flex h-[50%] w-full flex-col items-start justify-center gap-8 p-3 sm:h-full sm:w-[50%] sm:gap-15 sm:pl-10">
          <h3 className="text-xl text-foreground sm:text-2xl md:text-4xl">
            Hi, I&apos;m <span className="text-accent">{name}</span>
          </h3>

          <h1 className="text-3xl text-secondary sm:text-5xl md:text-6xl">
            {designation}
          </h1>
          

          <p className="w-[80%] text-sm whitespace-pre-line text-muted-foreground sm:text-lg md:text-xl">
            {bio}
          </p>

          <div className="flex h-10 w-55 gap-2 text-foreground sm:h-12 sm:w-65 md:h-14 md:w-80">
            <ResumeButton />
            <Link
              className="flex h-full w-[50%] cursor-pointer items-center justify-center rounded-br-3xl border-2 border-primary transition-all hover:w-[70%] sm:text-lg md:text-2xl"
              href="/contact"
            >
              Let&apos;s talk?
            </Link>
          </div>
        </main>


        <aside className="relative flex h-[50%] w-full items-center justify-center sm:h-full sm:w-[50%] sm:pr-10">
          <div className="relative flex h-60 w-50 items-center justify-center sm:h-80 sm:w-65 md:h-95 md:w-80">
            <MagicBall
              extraClasses="-top-8 left-2 magicBall-anime"
              delay={0.7}
              title="GitHub"
              icon={
                <a href={socialUrls.github} target="_blank" className="h-full w-full">
                  <FaGithub className="h-full w-full text-black" />
                </a>
              }
            />
            <MagicBall
              extraClasses="-top-2 -right-5 magicBall-anime"
              delay={0.1}
              title="LinkedIn"
              icon={
                <a href={socialUrls.linkedin} target="_blank" className="h-full w-full">
                  <FaLinkedin className="h-full w-full text-black" />
                </a>
              }
            />

            <Wizard />

            <MagicBall
              extraClasses="-right-4 bottom-2 magicBall-anime"
              delay={0.2}
              title="LeetCode"
              icon={
                <a href={socialUrls.leetcode} target="_blank" className="h-full w-full">
                  <SiLeetcode className="h-full w-full text-black" />
                </a>
              }
            />
            <MagicBall
              extraClasses="-left-8 bottom-10 magicBall-anime"
              delay={0.5}
              title="Twitter"
              icon={
                <a href={socialUrls.twitter} target="_blank" className="h-full w-full">
                  <FaXTwitter className="h-full w-full text-black" />
                </a>
              }
            />
          </div>
        </aside>
      </section>
    </div>
  );
}

export default Landing;
