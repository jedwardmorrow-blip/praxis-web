import "../../../v4.css"
import "../../check.css"

import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { createClient } from "@supabase/supabase-js"
import { Nav } from "@/components/v4/nav"
import { FooterV4 } from "@/components/v4/footer"
import { LeverageMapReadout } from "../../leverage-map-readout"
import { MapActions } from "./map-actions"
import type { StoredLeverageMap } from "@/lib/leverage-map"

export const dynamic = "force-dynamic"

function cleanEnv(value: string | undefined) {
  return (value ?? "").trim().replace(/^"|"$/g, "").replace(/\\n/g, "").replace(/\n/g, "")
}

async function fetchMap(token: string): Promise<StoredLeverageMap | null> {
  if (!token || token.length < 16) return null
  const url = cleanEnv(process.env.SUPABASE_URL)
  const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!url || !key) return null

  const supabase = createClient(url, key)
  const { data, error } = await supabase
    .from("praxis_leads")
    .select("leverage_map")
    .eq("public_token", token)
    .maybeSingle()

  if (error || !data?.leverage_map) return null
  return data.leverage_map as StoredLeverageMap
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ token: string }>
}): Promise<Metadata> {
  const { token } = await params
  const map = await fetchMap(token)
  if (!map) return { title: "Leverage Map", robots: { index: false } }
  return {
    title: `${map.company} · Leverage Map`,
    description: `${map.result.pattern_label} — a Praxis Leverage Map.`,
    robots: { index: false, follow: false },
    alternates: { canonical: `https://gopraxis.ai/check/map/${token}` },
  }
}

export default async function LeverageMapPage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const map = await fetchMap(token)
  if (!map) notFound()

  return (
    <div className="v4-page check-page check-map-page">
      <Nav />
      <main>
        <section className="check-map-shell">
          <Link href="/check" className="check-back-link">
            ← Praxis Leverage Map
          </Link>

          <LeverageMapReadout company={map.company} score={map.score} result={map.result} />

          <div className="lm-session-next">
            <span>Recommended next step</span>
            <h3>Want Justin to map this with you?</h3>
            <p>
              Start with a focused 30-minute intro call. We trace the handoff, name the first
              useful intervention, and decide together whether it is worth a full 60-90 minute AI
              Leverage Session.
            </p>
          </div>

          <MapActions patternLabel={map.result.pattern_label} firstFix={map.result.first_fix} />
        </section>
      </main>
      <FooterV4 />
    </div>
  )
}
