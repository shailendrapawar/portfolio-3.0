"use client"
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INavItem, navItems } from "../lib/data/navItems";
import { TbMenu3, TbX, TbSettings } from "react-icons/tb";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuthState } from "@/features/auth/hooks/useAuthState";
export default function Navbar() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isAuthenticated } = useAuthState();

  // Show the Admin link only to authenticated users.
  const items: INavItem[] = isAuthenticated
    ? [...navItems, { label: "Admin", path: "/admin", icon: TbSettings }]
    : navItems;

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);


  return (
    <main className="h-20  w-full relative py-2 px-4 z-50">
      <section className="flex justify-between items-center gap-5 h-full rounded-full px-5 relative bg-primary text-primary-foreground">
      <Link href="/" aria-label="Home" className="ml-3 flex items-center">
        <Image
          src="/s-letter.png"
          alt="Shailendra Pawar logo"
          width={40}
          height={40}
          priority
          className="h-10 w-auto"
        />
      </Link>
      <nav className="hidden md:flex h-full items-center gap-5">
        {items.map((route:INavItem) => (
          <Link
            key={route.path}
            href={route.path}
            className={cn(
              "border-b-2 border-transparent transition-colors hover:text-white w-20 text-center",
              isActive(route.path) && "border-white border-b-2 text-white"
            )}
          >
            {route.label}
          </Link>
        ))}
      </nav>
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-black/80 text-white backdrop-blur-md">
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setIsMobileMenuOpen(false)}
            className="absolute top-6 right-6"
          >
            <TbX className="size-8 cursor-pointer" />
          </button>

          <nav className="flex flex-col items-start gap-6">
            {items.map((route:INavItem) => (
              <Link
                key={route.path}
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
            ))}
          </nav>
        </div>
      )}

      <aside className="mr-3 md:hidden" onClick={() => setIsMobileMenuOpen(true)}>
       <TbMenu3 className="size-8 cursor-pointer" />
      </aside>
      
      </section>
    </main>
  )
}