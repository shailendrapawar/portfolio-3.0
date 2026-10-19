"use client";

import Modal from "@/components/Modal";
import { getResumeUrls } from "@/lib/data/resume";
import { useResumeModal } from "../hooks/useResumeModal";

type ResumeButtonProps = {
  // The resume link set in the admin dashboard.
  resumeUrl?: string;
};

export default function ResumeButton({ resumeUrl }: ResumeButtonProps) {
  const { open, setOpen, openModal } = useResumeModal();

  const urls = getResumeUrls(resumeUrl);

  // Nothing to show until a resume link is set in the admin dashboard.
  if (!urls) return null;

  const { previewUrl, downloadUrl } = urls;

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="flex h-full w-[50%] cursor-pointer items-center justify-center rounded-tl-3xl bg-primary text-white shadow-sm shadow-black transition-all hover:w-[70%] active:shadow-none sm:text-lg md:text-2xl"
      >
        Resume
      </button>

      <Modal
        open={open}
        onOpenChange={setOpen}
        // Override the modal's centered/max-w-sm defaults to fill the screen.
        className="inset-0 h-full max-h-none w-full max-w-none translate-x-0 translate-y-0 gap-0 rounded-none p-0 sm:gap-0 sm:rounded-none sm:p-0"
      >
        <div className="flex h-full w-full flex-col">
          {/* pr-14 leaves room for the modal's built-in close button (top-right) */}
          <header className="flex items-center justify-between gap-4 border-b border-border bg-card px-4 py-3 pr-14">
            <h2 className="text-sm font-semibold text-foreground sm:text-base">
              Resume
            </h2>
            <a
              href={downloadUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-primary px-4 py-2 text-xs font-medium text-white transition-transform hover:scale-105 sm:text-sm"
            >
              Download
            </a>
          </header>

          <iframe
            src={previewUrl}
            title="Resume preview"
            allow="autoplay"
            className="w-full flex-1 border-0 bg-muted"
          />
        </div>
      </Modal>
    </>
  );
}
