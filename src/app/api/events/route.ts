import { createClient } from "@supabase/supabase-js"

// First-party funnel beacon. Best-effort and side-effect-light: validates the
// event, writes one row to praxis_funnel_events, and always returns 204 (an
// analytics call must never surface an error to the page). No PII is stored —
// session_id is an anon client id, lead_token is the public map token.

export const dynamic = "force-dynamic"

const ALLOWED = new Set(["quiz_start", "quiz_complete", "booking_click"])

function cleanEnv(value: string | undefined) {
  return (value ?? "").trim().replace(/^"|"$/g, "").replace(/\\n/g, "").replace(/\n/g, "")
}

function asString(value: unknown, max: number): string | null {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, max) : null
}

// Ungate A/B arm tag — only the two known values persist; anything else is null
// (a bad value must never fail a best-effort beacon write).
function asVariant(value: unknown): string | null {
  return value === "gated" || value === "ungated" ? value : null
}

export async function POST(req: Request) {
  const noContent = () => new Response(null, { status: 204 })

  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return noContent()
  }

  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}
  const event = typeof body.event === "string" ? body.event : ""
  if (!ALLOWED.has(event)) return noContent()

  const url = cleanEnv(process.env.SUPABASE_URL)
  const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!url || !key) return noContent()

  try {
    const supabase = createClient(url, key)
    await supabase.from("praxis_funnel_events").insert({
      event,
      session_id: asString(body.sessionId, 80),
      lead_token: asString(body.leadToken, 64),
      variant: asVariant(body.variant),
      meta: body.meta && typeof body.meta === "object" ? body.meta : null,
    })
  } catch {
    // swallow — never fail a beacon
  }

  return noContent()
}
