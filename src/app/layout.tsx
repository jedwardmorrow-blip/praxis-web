import type { Metadata } from "next"
import { Inter, Bebas_Neue } from "next/font/google"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const bebasNeue = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas-neue",
  display: "swap",
})

export const metadata: Metadata = {
  title: "PRAXIS. Operational Intelligence.",
  description:
    "We work with operators running medium-complex businesses. We listen, build context, and ship software built for how your operation actually runs.",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
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
    <html lang="en" className={`dark ${inter.variable} ${bebasNeue.variable}`}>
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
