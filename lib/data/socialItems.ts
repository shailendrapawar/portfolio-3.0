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

// Resume hosted on Google Drive. Requires the file's sharing to be
// "Anyone with the link". Derived from the file ID so both URLs stay in sync.
const RESUME_FILE_ID = "1YjhRsnsJTi9tprizzl3K00exPDq2cMAo"

// Embeddable viewer for the iframe preview (works cross-origin + on mobile).
export const resumePreviewUrl = `https://drive.google.com/file/d/${RESUME_FILE_ID}/preview`

// Direct-download endpoint; Drive serves it with Content-Disposition: attachment.
export const resumeDownloadUrl = `https://drive.google.com/uc?export=download&id=${RESUME_FILE_ID}`
