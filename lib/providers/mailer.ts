import nodemailer, { type Transporter } from "nodemailer"

import { ENV } from "../env"
import { ApiError } from "../api/error"
import {
  renderEmailTemplate,
  type EmailTemplateKey,
  type EmailTemplateData,
} from "../templates/email"

// "auto"   — system-generated (e.g. the contact-form notification).
// "manual" — composed by the owner (manual email options, added later).
export type MailType = "auto" | "manual"

export type SendMailOptions<K extends EmailTemplateKey = EmailTemplateKey> = {
  /** Recipient(s). Defaults to `MAIL_TO` (the site owner's inbox). */
  to?: string
  /** How this mail originated. Defaults to "auto". */
  type?: MailType
  /** Which email template to render. */
  templateKey: K
  /** Data embedded into the chosen template (shape depends on `templateKey`). */
  data: EmailTemplateData[K]
  /** Overrides the template's subject when provided. */
  subject?: string
  /** Set so replies go to the original sender (e.g. the contact-form email). */
  replyTo?: string
}

/**
 * Server-side SMTP mailer built on nodemailer. The transporter is created once
 * in the constructor and reused; exposed as a singleton (`mailer`) so the
 * connection pool is set up on first import only.
 */
class MailerService {
  private readonly transporter: Transporter
  private readonly from: string
  private readonly defaultTo: string

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: ENV.mail.host,
      port: ENV.mail.port,
      secure: ENV.mail.secure,
      auth: {
        user: ENV.mail.user,
        pass: ENV.mail.password,
      },
    })
    this.from = ENV.mail.from
    this.defaultTo = ENV.mail.to
  }

  /**
   * Renders `templateKey` with `data` and sends it. Throws an `ApiError(502)`
   * if delivery fails so routes can surface a clean message via `handleError`.
   */
  async send<K extends EmailTemplateKey>(options: SendMailOptions<K>) {
    if (!ENV.mail.user || !ENV.mail.password) {
      throw new ApiError(500, "Mail service is not configured")
    }

    const rendered = renderEmailTemplate(options.templateKey, options.data)
    const type: MailType = options.type ?? "auto"

    try {
      return await this.transporter.sendMail({
        from: this.from,
        to: options.to || this.defaultTo,
        subject: options.subject ?? rendered.subject,
        text: rendered.text,
        html: rendered.html,
        replyTo: options.replyTo,
        // Tags the origin so auto vs manual mail can be told apart downstream.
        headers: { "X-Mail-Type": type },
      })
    } catch (error) {
      console.error("Failed to send email:", error)
      throw new ApiError(502, "Failed to send email")
    }
  }
}

/** Singleton mailer — transporter configured once on first import. */
export const mailer = new MailerService()
