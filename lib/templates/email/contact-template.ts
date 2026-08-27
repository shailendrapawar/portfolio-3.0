import {
  EMAIL_THEME as T,
  escapeHtml,
  emailLayout,
  type RenderedEmail,
} from "./shared"

// templateKey this template is registered under.
export const CONTACT_TEMPLATE_KEY = "contact" as const

// Data the contact-notification email is rendered from.
export type ContactTemplateData = {
  name: string
  email: string
  purpose: string
  message: string
}

export type { RenderedEmail }

/**
 * Notification sent to the site owner when someone submits the contact form.
 * The passed `data` is embedded into the subject and body. Styled to match the
 * app's dark theme with inline styles for broad email-client support.
 */
export function contactTemplate(data: ContactTemplateData): RenderedEmail {
  const name = escapeHtml(data.name)
  const email = escapeHtml(data.email)
  const purpose = escapeHtml(data.purpose)
  const message = escapeHtml(data.message).replace(/\n/g, "<br />")
  const replySubject = encodeURIComponent(`Re: ${data.purpose}`)

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${T.border};">
        <p style="margin:0 0 2px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${T.mutedForeground};">${label}</p>
        <div style="font-size:15px;color:${T.foreground};">${value}</div>
      </td>
    </tr>`

  const content = `
    <tr>
      <td style="padding:24px 28px 0;">
        <span style="font-size:13px;font-weight:600;color:${T.mutedForeground};margin-right:8px;">Purpose:</span>
        <span style="display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(37,99,235,.15);border:1px solid ${T.primary};color:${T.accent};font-size:12px;font-weight:600;">${purpose}</span>
      </td>
    </tr>
    <tr>
      <td style="padding:12px 28px 4px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
          ${row("Name", name)}
          ${row("Email", `<a href="mailto:${email}" style="color:${T.accent};text-decoration:none;">${email}</a>`)}
        </table>
      </td>
    </tr>
    <tr>
      <td style="padding:16px 28px 4px;">
        <p style="margin:0 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${T.mutedForeground};">Message</p>
        <div style="padding:16px 18px;background:${T.panel};border:1px solid ${T.border};border-radius:12px;font-size:15px;line-height:1.6;color:${T.foreground};">${message}</div>
      </td>
    </tr>
    <tr>
      <td style="padding:20px 28px 28px;">
        <a href="mailto:${email}?subject=${replySubject}" style="display:inline-block;padding:11px 22px;border-radius:10px;background:${T.primary};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Reply to ${name} &rarr;</a>
      </td>
    </tr>`

  return {
    subject: `New contact message: ${data.purpose}`,
    text: `${data.name} <${data.email}> — ${data.purpose}\n\n${data.message}`,
    html: emailLayout({
      title: "📬 New contact message",
      content,
      footer: "Sent automatically from your portfolio contact form.",
    }),
  }
}
