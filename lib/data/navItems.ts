import type { IconType } from "react-icons"
import { TbHome, TbBriefcase, TbFolder, TbMail } from "react-icons/tb"

export const navItems: INavItem[] = [
  {
    label: "Home",
    path: "/",
    icon: TbHome,
  },
  {
    label: "Experience",
    path: "/experience",
    icon: TbBriefcase,
  },
  {
    label: "Projects",
    path: "/projects",
    icon: TbFolder,
  },
  {
    label: "Contact",
    path: "/contact",
    icon: TbMail,
  },
]
export type INavItem = {
  label: string
  path: string
  icon: IconType
}
