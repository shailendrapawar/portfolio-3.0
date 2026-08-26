export { default } from "@/features/home"

// ISR: statically cache the home page and regenerate at most once per minute.
export const revalidate = 60
