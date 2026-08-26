// templateKey this template is registered under.
export const CONTACT_TEMPLATE_KEY = "contact" as const

// Data the contact-notification email is rendered from.
export type ContactTemplateData = {
  name: string
  email: string
  purpose: string
  message: string
}

// The rendered pieces every email template returns.
export type RenderedEmail = {
  subject: string
  text: string
  html: string
}

// Escapes user input before embedding it in the HTML body.
function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Dark theme, mapped to hex for email-client support (no oklch / CSS vars).
const THEME = {
  page: "#141414", // background — near-black
  card: "#1f1f1f", // card surface
  panel: "#2a2a2a", // muted surface
  border: "#333333", // border (≈ white/10%)
  foreground: "#ffffff",
  mutedForeground: "#aab4cf",
  primary: "#2563eb",
  accent: "#00f0ff",
  secondary: "#7c3aed",
}

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

  const fontStack =
    "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid ${THEME.border};">
        <p style="margin:0 0 2px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${THEME.mutedForeground};">${label}</p>
        <div style="font-size:15px;color:${THEME.foreground};">${value}</div>
      </td>
    </tr>`

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${THEME.page};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${THEME.page};padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${THEME.card};border:1px solid ${THEME.border};border-radius:16px;overflow:hidden;font-family:${fontStack};">
            <!-- Header -->
            <tr>
              <td style="background:${THEME.primary};background-image:linear-gradient(135deg,${THEME.primary} 0%,${THEME.secondary} 100%);padding:24px 28px;">
                <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.75);">Portfolio</p>
                <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">📬 New contact message</h1>
              </td>
            </tr>

            <!-- Purpose badge -->
            <tr>
              <td style="padding:24px 28px 0;">
                <span style="display:inline-block;padding:6px 14px;border-radius:999px;background:rgba(37,99,235,.15);border:1px solid ${THEME.primary};color:${THEME.accent};font-size:12px;font-weight:600;">${purpose}</span>
              </td>
            </tr>

            <!-- Details -->
            <tr>
              <td style="padding:12px 28px 4px;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                  ${row("Name", name)}
                  ${row("Email", `<a href="mailto:${email}" style="color:${THEME.accent};text-decoration:none;">${email}</a>`)}
                </table>
              </td>
            </tr>

            <!-- Message panel -->
            <tr>
              <td style="padding:16px 28px 4px;">
                <p style="margin:0 0 8px;font-size:11px;letter-spacing:.08em;text-transform:uppercase;color:${THEME.mutedForeground};">Message</p>
                <div style="padding:16px 18px;background:${THEME.panel};border:1px solid ${THEME.border};border-radius:12px;font-size:15px;line-height:1.6;color:${THEME.foreground};">${message}</div>
              </td>
            </tr>

            <!-- Reply button -->
            <tr>
              <td style="padding:20px 28px 28px;">
                <a href="mailto:${email}?subject=${replySubject}" style="display:inline-block;padding:11px 22px;border-radius:10px;background:${THEME.primary};color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;">Reply to ${name} &rarr;</a>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:16px 28px;border-top:1px solid ${THEME.border};">
                <p style="margin:0;font-size:12px;color:${THEME.mutedForeground};">Sent automatically from your portfolio contact form.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

  return {
    subject: `New contact message: ${data.purpose}`,
    text: `${data.name} <${data.email}> — ${data.purpose}\n\n${data.message}`,
    html,
  }
}
