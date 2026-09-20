import { type RenderedEmail } from "./shared"
import {
  contactTemplate,
  CONTACT_TEMPLATE_KEY,
  type ContactTemplateData,
} from "./contact-template"
import {
  contactAcknowledgementTemplate,
  CONTACT_ACK_TEMPLATE_KEY,
  type ContactAckTemplateData,
} from "./contact-acknowledgement-template"
import {
  passwordResetOtpTemplate,
  PASSWORD_RESET_OTP_TEMPLATE_KEY,
  type PasswordResetOtpTemplateData,
} from "./password-reset-otp-template"

export type { RenderedEmail }
export {
  CONTACT_TEMPLATE_KEY,
  CONTACT_ACK_TEMPLATE_KEY,
  PASSWORD_RESET_OTP_TEMPLATE_KEY,
}

// Registry of every email template, keyed by its templateKey. Add new
// templates here and extend `EmailTemplateData` with their data shape.
const templates = {
  [CONTACT_TEMPLATE_KEY]: contactTemplate,
  [CONTACT_ACK_TEMPLATE_KEY]: contactAcknowledgementTemplate,
  [PASSWORD_RESET_OTP_TEMPLATE_KEY]: passwordResetOtpTemplate,
}

// Maps each templateKey to the data its template expects, so callers get a
// type error if they pass the wrong shape for a given key.
export type EmailTemplateData = {
  [CONTACT_TEMPLATE_KEY]: ContactTemplateData
  [CONTACT_ACK_TEMPLATE_KEY]: ContactAckTemplateData
  [PASSWORD_RESET_OTP_TEMPLATE_KEY]: PasswordResetOtpTemplateData
}

export type EmailTemplateKey = keyof typeof templates

/**
 * Renders the template for `key`, embedding `data`, and returns the
 * subject/text/html pieces. Throws if the key is unknown.
 */
export function renderEmailTemplate<K extends EmailTemplateKey>(
  key: K,
  data: EmailTemplateData[K]
): RenderedEmail {
  const template = templates[key] as (d: EmailTemplateData[K]) => RenderedEmail
  if (!template) {
    throw new Error(`Unknown email template: ${key}`)
  }
  return template(data)
}
