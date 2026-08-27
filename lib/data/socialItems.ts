import type { IconType } from "react-icons"
import { FaGithub } from "react-icons/fa"
import { FaLinkedin, FaXTwitter } from "react-icons/fa6"
import { SiLeetcode } from "react-icons/si"

export type ISocialLink = {
  key: string
  label: string
  href: string
  icon: IconType
  // Whether this link shows in the site footer.
  inFooter: boolean
}

// Single source of truth for personal social profiles.
export const socialLinks: ISocialLink[] = [
  {
    key: "github",
    label: "GitHub",
    href: "https://github.com/shailendrapawar/",
    icon: FaGithub,
    inFooter: true,
  },
  {
    key: "linkedin",
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/shailendra-pawar792/",
    icon: FaLinkedin,
    inFooter: true,
  },
  {
    key: "leetcode",
    label: "LeetCode",
    href: "https://leetcode.com/u/shailendrapawar/",
    icon: SiLeetcode,
    inFooter: true,
  },
  {
    key: "twitter",
    label: "Twitter",
    href: "https://x.com/shailendra_07__",
    icon: FaXTwitter,
    inFooter: false,
  },
]

// Footer subset — excludes profiles flagged out (e.g. Twitter).
export const footerLinks = socialLinks.filter((s) => s.inFooter)

// Quick href lookup by key, e.g. socialUrls.github — for call sites that
// place links individually rather than iterating (see Landing).
export const socialUrls: Record<string, string> = Object.fromEntries(
  socialLinks.map((s) => [s.key, s.href])
)

// Resume lives in Drive; a personal link but not a social profile.
export const resumeUrl =
  "https://drive.google.com/drive/folders/1-OdardWOtvSyZfOf8WlEV3P45mQkgqAH?usp=drive_link"
