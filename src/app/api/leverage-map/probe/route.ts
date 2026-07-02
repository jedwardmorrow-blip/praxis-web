import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { FREQUENCIES, priceProbeResult, type StoredLeverageMap } from "@/lib/leverage-map"

// Probe return: the readout's first_fix ends in a number the owner reads
// themselves ("count how many...", "the length of that list..."). This is where
// that number comes back. The map page invites the owner to log it; we price it
// deterministically against their own reported cost band and cadence, store it
// on the lead, emit a probe_return funnel event, and notify Justin — a returned
// probe number is the highest-intent signal the funnel produces (the owner did
// homework on their own business and came back with the result).
//
// The response is computed by priceProbeResult (pure, no model call): it must
// render instantly, never drift into template prose, and never leak the build.

export const dynamic = "force-dynamic"

const NOTIFY_EMAILS = ["Justin@gopraxis.ai"]
const SITE_URL = "https://gopraxis.ai"

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }

  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}

  // Honeypot: bots that fill every field short-circuit with a fake success —
  // no lookup, no write, no email. Mirrors the main route's _hp behavior.
  if (typeof body._hp === "string" && body._hp.trim()) {
    return Response.json({ ok: true, response: null })
  }

  const mapToken = asString(body.mapToken).slice(0, 64)
  const value = asString(body.value).slice(0, 200)
  const note = asString(body.note).slice(0, 500)

  if (!mapToken || mapToken.length < 16 || !value) {
    return Response.json({ error: "A map token and a probe result are required" }, { status: 400 })
  }

  const supabaseUrl = cleanEnv(process.env.SUPABASE_URL)
  const supabaseKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: "not configured" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: lead, error: lookupError } = await supabase
    .from("praxis_leads")
    .select("id, leverage_map, probe_result, variant, contact_email, is_anonymous")
    .eq("public_token", mapToken)
    .maybeSingle()

  if (lookupError) {
    console.error("probe lookup error:", lookupError)
    return Response.json({ error: "lookup failed" }, { status: 500 })
  }
  if (!lead?.leverage_map) {
    return Response.json({ error: "map not found" }, { status: 404 })
  }

  const map = lead.leverage_map as StoredLeverageMap

  // The owner can correct the cadence on the map (the quiz answer was a first
  // guess; the probe is the measurement). Only a known chip key is accepted;
  // anything else falls back to what they reported in the quiz.
  const rawFreq = asString(body.frequency)
  const frequency = rawFreq in FREQUENCIES ? (rawFreq as keyof typeof FREQUENCIES) : map.frequency
  const response = priceProbeResult(value, { costBand: map.costBand, frequency })

  const probeResult = {
    value,
    note: note || null,
    frequency: frequency || null,
    response,
    at: new Date().toISOString(),
  }

  const { error: updateError } = await supabase
    .from("praxis_leads")
    .update({ probe_result: probeResult })
    .eq("id", lead.id)

  if (updateError) {
    console.error("probe update error:", updateError)
    return Response.json({ error: "could not save" }, { status: 500 })
  }

  // Best-effort funnel event + notify: the probe is saved, so neither may fail
  // the request. probe_return is written server-side (not via the /api/events
  // beacon) so the event can never be spoofed apart from a real stored probe.
  try {
    await supabase.from("praxis_funnel_events").insert({
      event: "probe_return",
      lead_token: mapToken,
      variant: lead.variant ?? null,
      meta: { has_note: Boolean(note) },
    })
  } catch (error) {
    console.error("probe funnel event error:", error)
  }

  await notifyProbeReturn(map, value, note, mapToken, Boolean(lead.contact_email))

  return Response.json({ ok: true, response })
}

async function notifyProbeReturn(
  map: StoredLeverageMap,
  value: string,
  note: string,
  token: string,
  contactable: boolean,
) {
  const resendKey = cleanEnv(process.env.RESEND_API_KEY)
  if (!resendKey) return
  const resend = new Resend(resendKey)
  try {
    const { error } = await resend.emails.send({
      from: "PRAXIS Leverage Map <noreply@gopraxis.ai>",
      to: NOTIFY_EMAILS,
      subject: `[PROBE RETURNED] ${map.company || "Unknown"} came back with their number`,
      html: `
        <h2 style="font-family:sans-serif;color:#111">A prospect ran the probe and came back</h2>
        <p style="font-family:sans-serif;color:#333">This is the hottest signal the funnel produces: they measured their own leak and returned to the map with the result. Follow up while the number is fresh.</p>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:6px 12px;font-weight:700">Company</td><td style="padding:6px 12px">${escapeHtml(map.company || "—")}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:700">Pattern</td><td style="padding:6px 12px">${escapeHtml(map.result?.pattern_label ?? "—")}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:700">Probe result</td><td style="padding:6px 12px"><strong>${escapeHtml(value)}</strong></td></tr>
          ${note ? `<tr><td style="padding:6px 12px;font-weight:700">Their note</td><td style="padding:6px 12px">${escapeHtml(note)}</td></tr>` : ""}
          <tr><td style="padding:6px 12px;font-weight:700">Contactable</td><td style="padding:6px 12px">${contactable ? "Yes (email on file)" : "No (anonymous map)"}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:700">Map</td><td style="padding:6px 12px"><a href="${escapeHtml(`${SITE_URL}/check/map/${token}`)}">view</a></td></tr>
        </table>
      `,
    })
    if (error) console.error("probe notify error:", error)
  } catch (error) {
    console.error("probe notify threw:", error)
  }
}

function asString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function cleanEnv(value: string | undefined) {
  return (value ?? "").trim().replace(/^"|"$/g, "").replace(/\\n/g, "").replace(/\n/g, "")
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}
