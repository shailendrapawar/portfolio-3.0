"use client"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INavItem, navItems } from "../lib/data/navItems";
import { TbMenu3, TbX, TbSettings } from "react-icons/tb";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils";
import { FadeIn, Stagger, StaggerItem } from "@/components/animations";
import { useAuthState } from "@/features/auth/hooks/useAuthState";
export default function Navbar() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthState();
  const { resolvedTheme } = useTheme();

  // Avoid hydration mismatch: render the default logo until mounted, then swap
  // to the theme-appropriate one. The files are named by mode: -dark is the
  // white logo (for dark mode), -light is the black logo (for light mode).
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const logoSrc =
    mounted && resolvedTheme === "dark"
      ? "/s-letter-dark.png"
      : "/s-letter-light.png";

  // Show the Admin link only to authenticated users.
  const items: INavItem[] = isAuthenticated
    ? [...navItems, { label: "Admin", path: "/admin", icon: TbSettings }]
    : navItems;

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);


  return (
    <>
    <main className="sticky top-0 mx-auto h-20 w-full max-w-250 relative py-2 px-4 z-50 backdrop-blur-md">
      <section className="flex justify-between items-center gap-5 h-full rounded-full px-5 relative backdrop-blur-md text-foreground">
      <FadeIn direction="left">
        <Link href="/" aria-label="Home" className="ml-3 flex items-center">
          <Image
            src={logoSrc}
            alt="Shailendra Pawar logo"
            width={40}
            height={40}
            priority
            className="h-10 w-auto"
          />
        </Link>
      </FadeIn>
      <Stagger inView={false} className="hidden md:flex h-full items-center gap-5">
        {items.map((route:INavItem) => (
          <StaggerItem key={route.path} className="w-20">
            <Link
              href={route.path}
              className={cn(
                "block w-full border-b-2 border-transparent text-center transition-colors text-muted-foreground hover:text-foreground",
                isActive(route.path) && "border-primary text-foreground"
              )}
            >
              {route.label}
            </Link>
          </StaggerItem>
        ))}
      </Stagger>

      <FadeIn
        direction="right"
        className="mr-3 md:hidden"
      >
        <aside onClick={() => setIsMobileMenuOpen(true)}>
          <TbMenu3 className="size-8 cursor-pointer" />
        </aside>
      </FadeIn>

      </section>
    </main>

    <FadeIn
      show={isMobileMenuOpen}
      duration={0.25}
      direction="none"
      className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-black/80 text-white backdrop-blur-md"
    >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setIsMobileMenuOpen(false)}
          className="absolute top-6 right-6"
        >
          <TbX className="size-8 cursor-pointer" />
        </button>

        <Stagger inView={false} delay={0.1} className="flex flex-col items-start gap-6">
          {items.map((route:INavItem) => (
            <StaggerItem key={route.path}>
              <Link
                href={route.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "inline-flex items-center gap-2.5 border-b-2 border-transparent pb-1.5 text-2xl font-medium transition-colors hover:text-white/80",
                  isActive(route.path) && "border-white text-white"
                )}
              >
                <route.icon className="size-6" />
                {route.label}
              </Link>
            </StaggerItem>
          ))}
        </Stagger>
      </FadeIn>
    </>
  )
}