import type { Metadata } from "next"
import { Geist, Geist_Mono, Inter } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import AuthFetchInterceptor from "@/components/AuthFetchInterceptor"
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Shailendra Pawar | Full Stack Developer",
  description:
    "Portfolio of Shailendra Pawar — a MERN / full-stack developer.",
  icons: {
    icon: [
      { url: "/s-letter-light.png", media: "(prefers-color-scheme: light)" },
      { url: "/s-letter-dark.png", media: "(prefers-color-scheme: dark)" },
    ],
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
