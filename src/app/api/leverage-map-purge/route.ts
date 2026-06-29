import { createClient } from "@supabase/supabase-js"

// Nightly janitor (Vercel Cron). Deletes UNCLAIMED anonymous ungated leads whose
// retention window has passed, so the ungate experiment doesn't accumulate rows
// that were never converted. Funnel measurement is unaffected — that lives in
// praxis_funnel_events (not touched here); only the unclaimed lead row is removed.
//
// Wired in vercel.json crons -> { path: "/api/leverage-map-purge", schedule: "0 3 * * *" }.
//
// CRON_SECRET is ENFORCED fail-closed: unlike the read-only email-health digest,
// this route DELETEs, so an unauthenticated or unset secret is a data-loss vector.
// It hard-401s when the Bearer doesn't match AND when CRON_SECRET is not set.

export const dynamic = "force-dynamic"

export async function POST(req: Request) {
  return handle(req)
}
// Vercel Cron invokes with GET; support both.
export async function GET(req: Request) {
  return handle(req)
}

async function handle(req: Request) {
  const cronSecret = cleanEnv(process.env.CRON_SECRET)
  // Fail closed: no secret configured means no authenticated way to call a DELETE
  // endpoint, so refuse rather than run unauthenticated.
  if (!cronSecret) {
    console.error("leverage-map-purge: CRON_SECRET not set — refusing to run (fail-closed)")
    return Response.json({ error: "not configured" }, { status: 401 })
  }
  const auth = req.headers.get("authorization") ?? ""
  if (auth !== `Bearer ${cronSecret}`) {
    return Response.json({ error: "unauthorized" }, { status: 401 })
  }

  const supabaseUrl = cleanEnv(process.env.SUPABASE_URL)
  const supabaseKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: "supabase not configured" }, { status: 500 })
  }

  const cutoff = new Date().toISOString()
  const supabase = createClient(supabaseUrl, supabaseKey)

  // Defense-in-depth predicate: all four conditions must hold, so a row that was
  // ever claimed (email set, is_anonymous=false, anon_purge_after nulled) can never
  // be purged even if one flag is stale.
  const { data, error } = await supabase
    .from("praxis_leads")
    .delete()
    .eq("is_anonymous", true)
    .is("contact_email", null)
    .eq("variant", "ungated")
    .lt("anon_purge_after", cutoff)
    .select("id")

  if (error) {
    console.error("leverage-map-purge delete error:", error)
    return Response.json({ error: "purge failed" }, { status: 500 })
  }

  const deleted = data?.length ?? 0
  if (deleted) console.warn(`[leverage-map-purge] removed ${deleted} unclaimed anonymous lead(s) older than cutoff`)
  return Response.json({ ok: true, deleted, cutoff })
}

function cleanEnv(value: string | undefined) {
  return (value ?? "").trim().replace(/^"|"$/g, "").replace(/\\n/g, "").replace(/\n/g, "")
}
