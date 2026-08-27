"use client";

import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useUpdateProfilePicture } from "../hooks/useUpdateProfilePicture";

export default function ProfilePictureForm() {
  const {
    currentUrl,
    preview,
    file,
    selectFile,
    handleSave,
    busy,
    error,
    success,
  } = useUpdateProfilePicture();

  const shown = preview || currentUrl;

  return (
    <div className="mx-auto mt-6 flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Profile picture</h2>

      <div className="relative h-40 w-40 overflow-hidden rounded-full border border-border bg-muted">
        {shown && (
          <Image
            key={shown}
            src={shown}
            alt="Profile picture"
            fill
            sizes="10rem"
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <label className="w-full cursor-pointer">
        <span className="mb-1.5 block text-xs font-medium text-muted-foreground">
          Choose a new image (max 5MB)
        </span>
        <input
          type="file"
          accept="image/*"
          disabled={busy}
          onChange={(e) => selectFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-muted-foreground file:mr-3 file:cursor-pointer file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:brightness-110"
        />
      </label>

      {error && <p className="w-full text-sm text-destructive">{error}</p>}
      {success && <p className="w-full text-sm text-primary">{success}</p>}

      <Button
        type="button"
        onClick={handleSave}
        disabled={!file || busy}
        className="w-full rounded-full"
      >
        {busy ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
