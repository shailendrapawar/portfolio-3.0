"use client";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useUpdateResume } from "../hooks/useUpdateResume";

export default function ResumeForm() {
  const {
    open,
    setOpen,
    openModal,
    url,
    setUrl,
    savedUrl,
    preview,
    saving,
    error,
    success,
    handleSave,
  } = useUpdateResume();

  return (
    <div className="mx-auto mt-6 flex w-full max-w-md flex-col gap-3 rounded-2xl border border-border bg-card p-6">
      <h2 className="text-center text-lg font-semibold text-foreground sm:text-xl">
        Resume
      </h2>

      <p className="text-center text-sm text-muted-foreground">
        {savedUrl ? (
          <>
            Current link:{" "}
            <a
              href={savedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary underline underline-offset-2 break-all"
            >
              {savedUrl}
            </a>
          </>
        ) : (
          "No resume link set yet."
        )}
      </p>

      <Button type="button" onClick={openModal} className="rounded-full">
        {savedUrl ? "Update resume link" : "Add resume link"}
      </Button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Resume link"
        description="Paste a public link (Google Drive set to 'Anyone with the link', or a direct PDF URL). Preview it below before saving."
        className="max-w-lg"
      >
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="resume-url" className="text-muted-foreground">
              Link
            </Label>
            <Input
              id="resume-url"
              type="url"
              value={url}
              disabled={saving}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/file/d/.../view"
            />
          </div>

          {preview ? (
            <div className="h-72 w-full overflow-hidden rounded-lg border border-border bg-muted">
              <iframe
                src={preview.previewUrl}
                title="Resume preview"
                className="h-full w-full border-0"
              />
            </div>
          ) : (
            <p className="rounded-lg border border-dashed border-border px-3 py-6 text-center text-xs text-muted-foreground">
              Enter a link above to preview it here.
            </p>
          )}

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
      </Modal>
    </div>
  );
}
