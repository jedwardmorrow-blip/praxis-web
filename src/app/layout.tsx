import type { Metadata, Viewport } from "next"
import {
  Inter,
  Bebas_Neue,
  Big_Shoulders,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Special_Elite,
} from "next/font/google"
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

const bigShoulders = Big_Shoulders({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800", "900"],
  variable: "--font-big-shoulders",
  display: "swap",
  fallback: ["Big Shoulders Display", "system-ui", "sans-serif"],
})

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-plex-sans",
  display: "swap",
})

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex-mono",
  display: "swap",
})

const specialElite = Special_Elite({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-special-elite",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://gopraxis.ai"),
  title: "PRAXIS. Operational Intelligence.",
  description:
    "Operators who build software for other operators. Discovery Sprint first: one painful workflow, one working prototype, one clear implementation path.",
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
      "Operators who build software for other operators. Discovery Sprint first: one painful workflow, one working prototype, one clear implementation path.",
    url: "https://gopraxis.ai",
    siteName: "PRAXIS",
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary" },
}

export const viewport: Viewport = {
  themeColor: "#0a2545",
}

const fontVariables = [
  inter.variable,
  bebasNeue.variable,
  bigShoulders.variable,
  ibmPlexSans.variable,
  ibmPlexMono.variable,
  specialElite.variable,
].join(" ")

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${fontVariables}`}>
      <body className="antialiased bg-background text-foreground">
        {children}
      </body>
    </html>
  )
}
