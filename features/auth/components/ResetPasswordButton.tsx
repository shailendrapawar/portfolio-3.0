"use client";

import { useState } from "react";

import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import ResetPasswordForm from "./ResetPasswordForm";

/**
 * Profile-section card that opens the password change flow in a modal, keeping
 * the profile tab compact.
 */
export default function ResetPasswordButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="mx-auto mt-6 flex w-full max-w-md flex-col gap-4 rounded-2xl border border-border bg-card p-6">
      <h2 className="text-center text-lg font-semibold text-foreground sm:text-xl">
        Security
      </h2>

      <div className="flex items-center justify-between gap-3">
        <span className="min-w-0 text-sm font-medium text-foreground">
          Change password
        </span>

        <Button
          type="button"
          onClick={() => setOpen(true)}
          className="shrink-0 rounded-full"
        >
          Change password
        </Button>
      </div>

      <Modal
        open={open}
        onOpenChange={setOpen}
        title="Change password"
        description="No current password needed — you're already signed in."
      >
        <ResetPasswordForm onSuccess={() => setOpen(false)} />
      </Modal>
    </div>
  );
}
