"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateProfileInfo } from "../hooks/useUpdateProfileInfo";

export default function ProfileInfoForm() {
  const {
    name,
    setName,
    designation,
    setDesignation,
    bio,
    setBio,
    saving,
    error,
    success,
    handleSave,
  } = useUpdateProfileInfo();

  return (
    <div className="mx-auto mt-6 flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="text-lg font-semibold text-foreground">Profile details</h2>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="profile-name">Name</Label>
        <Input
          id="profile-name"
          value={name}
          disabled={saving}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="profile-designation">Designation</Label>
        <Input
          id="profile-designation"
          value={designation}
          disabled={saving}
          onChange={(e) => setDesignation(e.target.value)}
          placeholder="e.g. Full Stack Developer"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="profile-bio">Bio</Label>
        <Textarea
          id="profile-bio"
          value={bio}
          disabled={saving}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short intro/tagline shown on the landing page"
          className="min-h-28"
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}
      {success && <p className="text-sm text-primary">{success}</p>}

      <Button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="rounded-full"
      >
        {saving ? "Saving..." : "Save"}
      </Button>
    </div>
  );
}
