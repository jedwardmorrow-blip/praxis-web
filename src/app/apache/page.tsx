import type { Metadata } from "next"

import { ApachePackageShell } from "./ApachePackageShell"
import "./apache.css"

export const metadata: Metadata = {
  title: "Apache Growth Review | Praxis",
  description:
    "A private Praxis review package for Apache Business Systems covering revenue strategy, brand direction, and the recommended website rebuild path.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://gopraxis.ai/apache" },
  openGraph: {
    title: "Apache Growth Review | Praxis",
    description:
      "A private review package for Apache Business Systems: strategy, revenue map, brand system, and next-step recommendations.",
    url: "https://gopraxis.ai/apache",
    siteName: "PRAXIS",
    locale: "en_US",
    type: "website",
  },
}

export default function ApachePage() {
  return <ApachePackageShell />
}
