// The rendered pieces every email template returns.
export type RenderedEmail = {
  subject: string
  text: string
  html: string
}

// Dark theme, mapped to hex for email-client support (no oklch / CSS vars).
export const EMAIL_THEME = {
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

export const EMAIL_FONT_STACK =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif"

// Escapes user input before embedding it in an HTML body.
export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

/**
 * Wraps template content in the shared dark card shell: gradient header
 * (eyebrow + title), the passed `content`, and a muted footer note.
 */
export function emailLayout(opts: {
  title: string
  eyebrow?: string
  content: string
  footer?: string
}): string {
  const t = EMAIL_THEME
  const eyebrow = opts.eyebrow ?? "Shailendra's Portfolio"

  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:${t.page};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${t.page};padding:32px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:${t.card};border:1px solid ${t.border};border-radius:16px;overflow:hidden;font-family:${EMAIL_FONT_STACK};">
            <tr>
              <td style="background:${t.primary};background-image:linear-gradient(135deg,${t.primary} 0%,${t.secondary} 100%);padding:24px 28px;">
                <p style="margin:0;font-size:12px;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.75);">${eyebrow}</p>
                <h1 style="margin:6px 0 0;font-size:22px;line-height:1.3;color:#ffffff;font-weight:700;">${opts.title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:8px 0 0;">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${opts.content}</table>
              </td>
            </tr>
            ${
              opts.footer
                ? `<tr>
              <td style="padding:16px 28px;border-top:1px solid ${t.border};">
                <p style="margin:0;font-size:12px;color:${t.mutedForeground};">${opts.footer}</p>
              </td>
            </tr>`
                : ""
            }
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`
}
