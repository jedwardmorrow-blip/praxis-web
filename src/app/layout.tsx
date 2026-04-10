import type { Metadata } from "next"
import { Inter, Oswald } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["700"],
  variable: "--font-oswald",
  display: "swap",
})

export const metadata: Metadata = {
  title: "PRAXIS. Operational Intelligence.",
  description:
    "We work with operators running medium-complex businesses. We listen, build context, and ship software built for how your operation actually runs.",
  openGraph: {
    title: "PRAXIS. Operational Intelligence.",
    description:
      "Purpose-built software and AI systems for operators with medium-complex operations.",
    url: "https://gopraxis.ai",
    siteName: "PRAXIS",
    locale: "en_US",
    type: "website",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${oswald.variable}`}>
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
