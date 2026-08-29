"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useResetPassword } from "../hooks/useResetPassword";

/**
 * Password fields only — no card/heading chrome, so it drops cleanly inside a
 * Modal (which provides its own title/frame). `onSuccess` fires after the
 * password is updated (e.g. to close the modal).
 */
export default function ResetPasswordForm({
  onSuccess,
}: {
  onSuccess?: () => void;
}) {
  const {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    saving,
    error,
    success,
    handleSave,
  } = useResetPassword(onSuccess);

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="new-password">New password</Label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          disabled={saving}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="At least 8 characters"
          autoComplete="new-password"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="confirm-password">Confirm password</Label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          disabled={saving}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter new password"
          autoComplete="new-password"
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
        {saving ? "Saving..." : "Update password"}
      </Button>
    </div>
  );
}
