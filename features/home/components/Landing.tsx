import Link from "next/link";
import { FaGithub, FaFacebook } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

import MagicBall from "@/components/MagicBall";
import Wizard from "./Wizard";

const urls = {
  linkedin: "https://www.linkedin.com/in/shailendra-pawar792/",
  github: "https://github.com/shailendrapawar/",
  facebook: "https://www.facebook.com/shailendra.pawar.50159",
  leetcode: "https://leetcode.com/u/shailendrapawar/",
  resume:
    "https://drive.google.com/drive/folders/1-OdardWOtvSyZfOf8WlEV3P45mQkgqAH?usp=drive_link",
};

function Landing() {
  return (
    <div className="relative flex min-h-[calc(100vh-80px)] justify-center">
      <section className="flex min-h-[calc(100vh-80px)] w-full max-w-250 flex-col sm:flex-row">
        <main className="flex h-[50%] w-full flex-col items-start justify-center gap-8 p-3 sm:h-full sm:w-[50%] sm:gap-15 sm:pl-10">
          <h3 className="text-xl text-foreground sm:text-2xl md:text-4xl">
            Hi, I&apos;m{" "}
            <span className="text-accent">Shailendra Pawar</span>
          </h3>

          <h1 className="text-3xl text-secondary sm:text-5xl md:text-6xl">
            Full Stack Developer
          </h1>

          <p className="w-[80%] text-sm text-muted-foreground sm:text-lg md:text-xl">
            MERN stack wizard , with a knack for real-time features, and seemless
            user experience
          </p>

          <div className="flex h-10 w-55 gap-2 text-foreground sm:h-12 sm:w-65 md:h-14 md:w-80">
            <a
              className="flex h-full w-[50%] cursor-pointer items-center justify-center rounded-tl-3xl bg-primary text-white shadow-sm shadow-black transition-all hover:w-[70%] active:shadow-none sm:text-lg md:text-2xl"
              href={urls.resume}
              target="_blank"
            >
              Resume
            </a>
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
                <a href={urls.github} target="_blank" className="h-full w-full">
                  <FaGithub className="h-full w-full text-black" />
                </a>
              }
            />
            <MagicBall
              extraClasses="-top-2 -right-5 magicBall-anime"
              delay={0.1}
              title="LinkedIn"
              icon={
                <a href={urls.linkedin} target="_blank" className="h-full w-full">
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
                <a href={urls.leetcode} target="_blank" className="h-full w-full">
                  <SiLeetcode className="h-full w-full text-black" />
                </a>
              }
            />
            <MagicBall
              extraClasses="-left-8 bottom-10 magicBall-anime"
              delay={0.5}
              title="Facebook"
              icon={
                <a href={urls.facebook} target="_blank" className="h-full w-full">
                  <FaFacebook className="h-full w-full text-black" />
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
