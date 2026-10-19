import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AuthFetchInterceptor from "@/components/AuthFetchInterceptor"
import { cn } from "@/lib/utils";

const SITE_TITLE = "Shailendra Pawar | SDE"
const SITE_DESCRIPTION =
  "Portfolio of Shailendra Pawar — Software Development Engineer (SDE) building scalable, real-time web applications."

export const metadata: Metadata = {
  // Base URL used to resolve relative OG/Twitter image URLs to absolute ones.
  // Set NEXT_PUBLIC_SITE_URL to your production domain; falls back to the
  // Vercel deployment URL, then localhost for dev.
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ||
      (process.env.VERCEL_PROJECT_PRODUCTION_URL
        ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
        : "http://localhost:3000")
  ),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  icons: {
    icon: [
      { url: "/s-letter-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/s-letter-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
  },
  // Share preview (image is auto-added from app/opengraph-image.tsx).
  openGraph: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    type: "website",
    siteName: "Shailendra Pawar",
  },
  // X/Twitter card (image auto-added from app/twitter-image.tsx).
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
}

const inter = Inter({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", inter.variable)}
    >
      <body className="min-h-screen w-full h-full ">
        <AuthFetchInterceptor />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>

  )
}
