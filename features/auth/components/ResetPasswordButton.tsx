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
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-foreground">Password</h2>
        <p className="text-sm text-muted-foreground">
          Set a new password for your account.
        </p>
      </div>

      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="w-fit rounded-full"
      >
        Change password
      </Button>

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
