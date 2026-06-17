import "../v4.css"
import "./check.css"

import type { Metadata } from "next"
import { Nav } from "@/components/v4/nav"
import { FooterV4 } from "@/components/v4/footer"

export const metadata: Metadata = {
  title: "Praxis Leverage Map",
  description:
    "A short workflow map for owner-led businesses: find the operating mess where AI could actually matter.",
  alternates: {
    canonical: "https://gopraxis.ai/check",
  },
  openGraph: {
    title: "Praxis Leverage Map",
    description:
      "Map one real operating mess and find the workflow where AI could create leverage.",
    url: "https://gopraxis.ai/check",
    siteName: "PRAXIS",
    locale: "en_US",
    type: "website",
  },
}

export default function CheckPage() {
  return (
    <div className="v4-page check-page">
      <Nav />
      <main>
        <section className="check-hero">
          <div className="check-hero-copy">
            <div className="check-kicker">Praxis Leverage Map</div>
            <h1>
              Pick one
              <br />
              real mess<span>.</span>
              <br />
              Find the
              <br />
              leverage.
            </h1>
            <div className="check-hero-actions" aria-label="Leverage map actions">
              <a className="check-start-primary" href="/check/start">
                Start the leverage map <span aria-hidden="true">→</span>
              </a>
              <a className="check-start-secondary" href="/check/start">
                Takes 3-5 min
              </a>
            </div>
            <div className="check-trust-line">No generic AI score. No email until the end.</div>
            <p>
              Map one messy operating moment and get a practical read on where AI, software, or
              better context could actually help the work run cleaner.
            </p>
          </div>
          <div className="check-hero-panel" aria-label="Leverage map promise">
            <div className="check-panel-top">
              <span>PX-LM · workflow scan</span>
              <span>3-5 min</span>
            </div>
            <div className="check-panel-core">
              <span>01</span>
              <strong>Describe the moment</strong>
              <span>02</span>
              <strong>Trace the handoff</strong>
              <span>03</span>
              <strong>See the pattern</strong>
            </div>
            <p>
              The output gives you a leverage pattern, the first fix to inspect, and what the
              workflow could look like after one focused improvement pass.
            </p>
            <a className="check-panel-start" href="/check/start">
              Begin with one real moment
            </a>
          </div>
        </section>
      </main>
      <FooterV4 />
    </div>
  )
}
