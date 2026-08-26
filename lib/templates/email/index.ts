import {
  contactTemplate,
  CONTACT_TEMPLATE_KEY,
  type ContactTemplateData,
  type RenderedEmail,
} from "./contact-template"

export type { RenderedEmail }
export { CONTACT_TEMPLATE_KEY }

// Registry of every email template, keyed by its templateKey. Add new
// templates here and extend `EmailTemplateData` with their data shape.
const templates = {
  [CONTACT_TEMPLATE_KEY]: contactTemplate,
}

// Maps each templateKey to the data its template expects, so callers get a
// type error if they pass the wrong shape for a given key.
export type EmailTemplateData = {
  [CONTACT_TEMPLATE_KEY]: ContactTemplateData
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
