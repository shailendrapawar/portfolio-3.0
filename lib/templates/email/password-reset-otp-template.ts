import {
  EMAIL_THEME as T,
  escapeHtml,
  emailLayout,
  type RenderedEmail,
} from "./shared"

// templateKey this template is registered under.
export const PASSWORD_RESET_OTP_TEMPLATE_KEY = "password-reset-otp" as const

// Data the password-reset OTP email is rendered from.
export type PasswordResetOtpTemplateData = {
  name?: string
  otp: string
  expiresInMinutes: number
}

/**
 * One-time code sent when a password reset is requested. Styled to match the
 * app's dark theme with inline styles for broad email-client support.
 */
export function passwordResetOtpTemplate(
  data: PasswordResetOtpTemplateData
): RenderedEmail {
  const name = data.name ? escapeHtml(data.name) : "there"
  const otp = escapeHtml(data.otp)
  const minutes = data.expiresInMinutes

  // Single boxed, monospaced code so it always renders on one line across email
  // clients (per-cell digits can wrap the last one). The right padding is nudged
  // up to visually offset the trailing letter-spacing.
  const codeBox = `<span style="display:inline-block;padding:12px 18px 12px 26px;border-radius:12px;background:${T.panel};border:1px solid ${T.border};font-family:'Courier New',Courier,monospace;font-size:24px;font-weight:700;letter-spacing:8px;color:${T.foreground};white-space:nowrap;">${otp}</span>`

  const content = `
    <tr>
      <td style="padding:24px 28px 0;">
        <p style="margin:0;font-size:16px;color:${T.foreground};">Hi ${name},</p>
        <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${T.mutedForeground};">
          We received a request to reset your password. Use the one-time code below to continue. If you didn't request this, you can safely ignore this email — your password won't change.
        </p>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding:24px 28px 4px;">${codeBox}</td>
    </tr>
    <tr>
      <td align="center" style="padding:10px 28px 24px;">
        <p style="margin:0;font-size:13px;color:${T.mutedForeground};">
          This code expires in <strong style="color:${T.foreground};">${minutes} minutes</strong>.
        </p>
      </td>
    </tr>`

  return {
    subject: `Your password reset code: ${data.otp}`,
    text: `Hi ${data.name ?? "there"},\n\nYour password reset code is ${data.otp}. It expires in ${minutes} minutes.\n\nIf you didn't request this, you can safely ignore this email — your password won't change.`,
    html: emailLayout({
      title: "🔐 Password reset code",
      content,
      footer: "For your security, never share this code with anyone.",
    }),
  }
}
