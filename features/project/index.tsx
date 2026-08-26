"use client"

import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuthState } from "@/features/auth/hooks/useAuthState";

import ProjectList from "./components/ProjectList";
import { useSearchProjects } from "./hooks/useSearchProjects";

export default function Project() {
    const{projects,isLoading,error}=useSearchProjects()
    const { isAuthenticated } = useAuthState()

  return (
    <div className="mx-auto flex w-full max-w-250 flex-col items-center gap-8 p-4">
      <div className="flex w-full flex-col items-center gap-2 text-center">
        <h2 className="text-2xl font-semibold text-accent sm:text-3xl">
          All Projects
        </h2>
        <p className="max-w-xl text-sm text-muted-foreground md:text-base">
          Everything I&apos;ve built.
        </p>

        {isAuthenticated && (
          <Link href="/admin/projects" className={cn(buttonVariants(), "mt-2")}>
            Manage
          </Link>
        )}
      </div>

      {/* <Suspense fallback={<div>Loading...</div>}> */}
        <ProjectList projects={projects} isLoading={isLoading} error={error} />
      {/* </Suspense> */}
    </div>
  );
}
