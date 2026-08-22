"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { INavItem, navItems } from "../lib/navItems";
import { TbMenu3 } from "react-icons/tb";
import { useState } from "react";
import { cn } from "@/lib/utils";
export default function Navbar() {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);


  return (
    <main className="h-20  w-full relative py-2">
      <section className="flex justify-between items-center gap-5 h-full rounded-full px-5 relative bg-primary text-primary-foreground">
      <h1>LOGO</h1>
      <nav className="hidden md:flex h-full items-center gap-5">
        {navItems.map((route:INavItem) => (
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
        <nav className="md:hidden absolute top-16 left-1/2 -translate-x-1/2 w-4/5 h-auto flex flex-col items-center justify-center gap-4 rounded-b-3xl py-5 bg-secondary text-primary-foreground ">
          {navItems.map((route:INavItem) => (
            <Link
              key={route.path}
              href={route.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "border-b-2 border-transparent transition-colors hover:text-white w-1/3 text-center",
                isActive(route.path) && "border-white border-b-2 text-white"
              )}
            >
              {route.label}
            </Link>
          ))}
        </nav>
      )}

      <aside className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
       <TbMenu3 className="size-8 cursor-pointer" />
      </aside>
      
      </section>
    </main>
  )
}