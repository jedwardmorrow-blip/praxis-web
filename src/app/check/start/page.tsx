import "../../v4.css"
import "../check.css"

import type { Metadata } from "next"
import Link from "next/link"
import { Nav } from "@/components/v4/nav"
import { FooterV4 } from "@/components/v4/footer"
import { LeverageMapForm } from "../leverage-map-form"

export const metadata: Metadata = {
  title: "Start the Praxis Leverage Map",
  description:
    "Start the Praxis Leverage Map and turn one messy operating moment into a practical workflow readout.",
  alternates: {
    canonical: "https://gopraxis.ai/check/start",
  },
  openGraph: {
    title: "Start the Praxis Leverage Map",
    description:
      "Map one real operating mess and find the workflow where AI could create leverage.",
    url: "https://gopraxis.ai/check/start",
    siteName: "PRAXIS",
    locale: "en_US",
    type: "website",
  },
}

export default function StartLeverageMapPage() {
  return (
    <div className="v4-page check-page">
      <Nav />
      <main>
        <section className="check-start-shell">
          <div className="check-start-intro">
            <Link href="/check" className="check-back-link">
              ← Back to overview
            </Link>
            <span className="sec-tag">Praxis Leverage Map</span>
            <h1>
              Start with one real operating mess<span className="red">.</span>
            </h1>
            <p>
              Answer from the messy middle. The map works best when the example is specific,
              recent, and annoying enough that the team already feels it.
            </p>
          </div>
          <LeverageMapForm />
        </section>
      </main>
      <FooterV4 />
    </div>
  )
}
