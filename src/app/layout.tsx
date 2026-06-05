import Script from "next/script"
import type { Metadata, Viewport } from "next"
import {
  Big_Shoulders,
  IBM_Plex_Sans,
  IBM_Plex_Mono,
  Special_Elite,
} from "next/font/google"
import "./globals.css"

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
  title: {
    default: "PRAXIS. Operational Intelligence.",
    template: "%s | PRAXIS",
  },
  description:
    "Operator-led software firm. We build custom software, AI agents, and operational intelligence for owner-led companies. Discovery Sprint first.",
  icons: {
    icon: [
      { url: "/favicon.svg?v=4", type: "image/svg+xml" },
      { url: "/favicon-16x16.png?v=4", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png?v=4", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png?v=4", sizes: "48x48", type: "image/png" },
      { url: "/favicon.ico?v=4", sizes: "48x48" },
    ],
    apple: [{ url: "/apple-touch-icon.png?v=4", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    title: "PRAXIS. Operational Intelligence.",
    description:
      "Operator-led software firm. Custom software, AI agents, and operational intelligence for owner-led companies.",
    url: "https://gopraxis.ai",
    siteName: "PRAXIS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@gopraxis",
  },
  alternates: {
    canonical: "https://gopraxis.ai",
  },
}

export const viewport: Viewport = {
  themeColor: "#0a2545",
}

const fontVariables = [
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
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WBNB2EJBFX"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-WBNB2EJBFX');`}
        </Script>
        <Script
          id="reb2b"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `!function(key){if(window.reb2b)return;window.reb2b={loaded:true};var s=document.createElement("script");s.async=true;s.src="https://ddwl4m2hdecbv.cloudfront.net/b/"+key+"/"+key+".js.gz";document.getElementsByTagName("script")[0].parentNode.insertBefore(s,document.getElementsByTagName("script")[0]);}("VN080H30XV6J");`,
          }}
        />
      </body>
    </html>
  )
}
