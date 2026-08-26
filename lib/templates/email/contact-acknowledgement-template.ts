import {
  EMAIL_THEME as T,
  escapeHtml,
  emailLayout,
  type RenderedEmail,
} from "./shared"

// templateKey this template is registered under.
export const CONTACT_ACK_TEMPLATE_KEY = "contact-acknowledgement" as const

// Data the acknowledgement email is rendered from.
export type ContactAckTemplateData = {
  name: string
  purpose: string
  message: string
}

/**
 * Auto-reply sent to the person who submitted the contact form, confirming
 * their message was received and echoing a copy back to them.
 */
export function contactAcknowledgementTemplate(
  data: ContactAckTemplateData
): RenderedEmail {
  const name = escapeHtml(data.name)
  const purpose = escapeHtml(data.purpose)
  const message = escapeHtml(data.message).replace(/\n/g, "<br />")

  const content = `
    <tr>
      <td style="padding:24px 28px 0;">
        <p style="margin:0;font-size:16px;color:${T.foreground};">Hi ${name},</p>
        <p style="margin:12px 0 0;font-size:15px;line-height:1.6;color:${T.mutedForeground};">
          Thanks for reaching out — I've received your message and will get back to you as soon as I can. Here's a copy of what you sent for your records.
        </p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 28px 0;">
        <span style="display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(37,99,235,.15);border:1px solid ${T.primary};color:${T.accent};font-size:12px;font-weight:600;">${purpose}</span>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 4px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${T.mutedForeground};">Your message</p>
        <div style="padding:16px 18px;background:${T.panel};border:1px solid ${T.border};border-radius:12px;font-size:15px;line-height:1.6;color:${T.foreground};">${message}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 28px 28px;">
        <p style="margin:0;font-size:15px;color:${T.foreground};">Talk soon,</p>
        <p style="margin:2px 0 0;font-size:15px;font-weight:600;color:${T.accent};">Shailendra Pawar</p>
      </td>
    </tr>`

  return {
    subject: "Thanks for reaching out! 👋",
    text: `Hi ${data.name},\n\nThanks for reaching out — I've received your message and will get back to you as soon as I can.\n\nYour message (${data.purpose}):\n${data.message}\n\nTalk soon,\nShailendra Pawar`,
    html: emailLayout({
      title: "✨ Message received",
      content,
      footer: "This is an automated acknowledgement — I'll personally reply soon.",
    }),
  }
}
