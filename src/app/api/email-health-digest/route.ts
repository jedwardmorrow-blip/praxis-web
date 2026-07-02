import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

// Daily email-health digest (Vercel Cron). Reads the last 24h of Leverage Map
// leads and reports how many prospect/notify emails were sent vs. failed, with
// the failed ones listed so Justin can follow up by hand. This is the monitoring
// the silent Resend outage exposed: email_status is captured per-send, but
// nothing READS it — this is what reads it.
//
// Caveat (acknowledged): the digest itself rides Resend, so a TOTAL Resend
// outage delays the digest too. Once the API key is valid, it reliably surfaces
// individual failures; its own non-arrival is a secondary signal that Resend is
// fully down.
//
// Wired in vercel.json crons -> { path: "/api/email-health-digest", schedule: "0 14 * * *" }.
// Set CRON_SECRET in Vercel to lock the endpoint; Vercel injects it as a Bearer
// token on cron invocations. Until it is set the route still runs (so it is not
// dead-on-arrival like a secret-gated endpoint) but logs a warning.

export const dynamic = "force-dynamic"

const NOTIFY_EMAILS = ["Justin@gopraxis.ai"]
const SITE_URL = "https://gopraxis.ai"
const WINDOW_HOURS = 24

type LeadRow = {
  id: string
  company: string | null
  contact_email: string | null
  signal_composite: number | null
  public_token: string | null
  created_at: string
  email_status: { prospect?: string; notify?: string } | null
  giveaway_flags: string[] | null
  guard_events: Array<{ field: string; reason: string }> | null
  specificity: { entities: string[]; missing: string[] } | null
}

type IntakeFailureRow = {
  company: string | null
  contact_email: string | null
  reason: string | null
  created_at: string
}

export async function POST(req: Request) {
  return handle(req)
}
// Vercel Cron invokes with GET; support both so a manual POST also works.
export async function GET(req: Request) {
  return handle(req)
}

async function handle(req: Request) {
  const cronSecret = cleanEnv(process.env.CRON_SECRET)
  if (cronSecret) {
    const auth = req.headers.get("authorization") ?? ""
    if (auth !== `Bearer ${cronSecret}`) {
      return Response.json({ error: "unauthorized" }, { status: 401 })
    }
  } else {
    console.warn("email-health-digest: CRON_SECRET not set; endpoint is unauthenticated")
  }

  const supabaseUrl = cleanEnv(process.env.SUPABASE_URL)
  const supabaseKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: "supabase not configured" }, { status: 500 })
  }

  const cutoff = new Date(Date.now() - WINDOW_HOURS * 3600 * 1000).toISOString()
  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from("praxis_leads")
    .select("id, company, contact_email, signal_composite, public_token, created_at, email_status, giveaway_flags, guard_events, specificity")
    .not("leverage_map", "is", null)
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("email-health-digest query error:", error)
    return Response.json({ error: "query failed" }, { status: 500 })
  }

  const leads = (data ?? []) as LeadRow[]

  // A submission whose INSERT failed writes NO praxis_leads row, so reading only
  // praxis_leads is blind to the exact silent-failure class this digest exists
  // to catch (the #778 tier-constraint bug). Read the dedicated failure table too.
  const { data: ifData } = await supabase
    .from("praxis_lead_intake_failures")
    .select("company, contact_email, reason, created_at")
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })
  const intakeFailures = (ifData ?? []) as IntakeFailureRow[]

  const failed = leads.filter(
    (l) => l.email_status?.prospect === "failed" || l.email_status?.notify === "failed",
  )
  // A prospect send marked "skipped" (missing key, malformed email, or a null map
  // token from a failed insert) is also a silent miss, not a success.
  const skipped = leads.filter((l) => l.email_status?.prospect === "skipped")
  // Give-away drift: readouts whose prospect-facing prose named a build component
  // (the closure is probabilistic, not deterministic). Quality signal, not an
  // email failure — surfaced so Justin can spot-check the give-away over real traffic.
  const drifted = leads.filter((l) => (l.giveaway_flags?.length ?? 0) > 0)
  // Guard fallbacks: the deterministic guard CAUGHT a leak/skeleton and replaced the
  // field with vetted prose (so nothing bad shipped). Higher-signal than drift — it
  // measures how often the model still needs the safety net, i.e. prompt-quality pressure.
  const guarded = leads.filter((l) => (l.guard_events?.length ?? 0) > 0)
  // Specificity gaps: readouts that echoed NONE of the owner's own extracted
  // words in one of the key conversion fields — the strongest template-drift
  // signal (the artifact passed every ban but does not read as THEIRS).
  const unspecific = leads.filter((l) => (l.specificity?.missing?.length ?? 0) > 0)
  const summary = {
    window_hours: WINDOW_HOURS,
    submissions: leads.length,
    prospect_failed: leads.filter((l) => l.email_status?.prospect === "failed").length,
    prospect_skipped: skipped.length,
    notify_failed: leads.filter((l) => l.email_status?.notify === "failed").length,
    failed_leads: failed.length,
    intake_failures: intakeFailures.length,
    giveaway_drift: drifted.length,
    guard_fallbacks: guarded.length,
    specificity_gaps: unspecific.length,
  }

  // Nothing happened in the window at all (no leads AND no intake failures): no noise.
  if (leads.length === 0 && intakeFailures.length === 0) {
    return Response.json({ ok: true, sent: false, reason: "no activity in window", summary })
  }

  const resendKey = cleanEnv(process.env.RESEND_API_KEY)
  if (!resendKey) {
    return Response.json({ ok: true, sent: false, reason: "resend not configured", summary })
  }

  const problems = failed.length + skipped.length + intakeFailures.length
  const hasFailures = problems > 0
  const subject = hasFailures
    ? `⚠️ Leverage Map email health · ${problems} issue(s), ${leads.length} delivered-attempts (24h)`
    : `Leverage Map email health · ${leads.length} submissions, all sent (24h)`

  const intakeRows = intakeFailures
    .map(
      (f) => `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(f.company ?? "—")}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(f.contact_email ?? "—")}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(f.reason ?? "insert failed")}</td>
      </tr>`,
    )
    .join("")

  const failRows = failed
    .map((l) => {
      const link = l.public_token ? `${SITE_URL}/check/map/${l.public_token}` : "—"
      return `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(l.company ?? "—")}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(l.contact_email ?? "—")}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">prospect:${escapeHtml(l.email_status?.prospect ?? "—")} / notify:${escapeHtml(l.email_status?.notify ?? "—")}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee"><a href="${escapeHtml(link)}">${l.public_token ? "map" : "—"}</a></td>
      </tr>`
    })
    .join("")

  const driftRows = drifted
    .map((l) => {
      const link = l.public_token ? `${SITE_URL}/check/map/${l.public_token}` : "—"
      return `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(l.company ?? "—")}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml((l.giveaway_flags ?? []).join(", "))}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee"><a href="${escapeHtml(link)}">${l.public_token ? "map" : "—"}</a></td>
      </tr>`
    })
    .join("")

  const guardRows = guarded
    .map((l) => {
      const link = l.public_token ? `${SITE_URL}/check/map/${l.public_token}` : "—"
      const detail = (l.guard_events ?? []).map((e) => `${e.field} (${e.reason})`).join(", ")
      return `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(l.company ?? "—")}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(detail)}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee"><a href="${escapeHtml(link)}">${l.public_token ? "map" : "—"}</a></td>
      </tr>`
    })
    .join("")

  const specificityRows = unspecific
    .map((l) => {
      const link = l.public_token ? `${SITE_URL}/check/map/${l.public_token}` : "—"
      return `<tr>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml(l.company ?? "—")}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee">${escapeHtml((l.specificity?.missing ?? []).join(", "))}</td>
        <td style="padding:6px 10px;border-bottom:1px solid #eee"><a href="${escapeHtml(link)}">${l.public_token ? "map" : "—"}</a></td>
      </tr>`
    })
    .join("")

  const redIf = (n: number) => (n ? "#C42130" : "#111")
  const amberIf = (n: number) => (n ? "#b8860b" : "#111")
  const html = `
    <div style="font-family:sans-serif;color:#111;max-width:640px">
      <h2 style="margin:0 0 8px">Leverage Map email health (last ${WINDOW_HOURS}h)</h2>
      <p style="margin:0 0 4px">Submissions saved: <strong>${leads.length}</strong></p>
      <p style="margin:0 0 4px">Intake (insert) failures — never saved: <strong style="color:${redIf(summary.intake_failures)}">${summary.intake_failures}</strong></p>
      <p style="margin:0 0 4px">Prospect sends failed: <strong style="color:${redIf(summary.prospect_failed)}">${summary.prospect_failed}</strong></p>
      <p style="margin:0 0 4px">Prospect sends skipped: <strong style="color:${redIf(summary.prospect_skipped)}">${summary.prospect_skipped}</strong></p>
      <p style="margin:0 0 4px">Notify sends failed: <strong style="color:${redIf(summary.notify_failed)}">${summary.notify_failed}</strong></p>
      <p style="margin:0 0 4px">Give-away drift (readout named a build component): <strong style="color:${amberIf(summary.giveaway_drift)}">${summary.giveaway_drift}</strong></p>
      <p style="margin:0 0 4px">Guard fallbacks (leak/skeleton caught and replaced): <strong style="color:${amberIf(summary.guard_fallbacks)}">${summary.guard_fallbacks}</strong></p>
      <p style="margin:0 0 16px">Specificity gaps (readout echoed none of the owner's words): <strong style="color:${amberIf(summary.specificity_gaps)}">${summary.specificity_gaps}</strong></p>
      ${
        intakeFailures.length
          ? `<p style="margin:0 0 8px;color:#C42130"><strong>Submissions that FAILED to save (no lead, no map, no email) — the silent-drop class:</strong></p>
             <table style="border-collapse:collapse;width:100%;font-size:13px;margin-bottom:16px">
               <tr><th align="left" style="padding:6px 10px">Company</th><th align="left" style="padding:6px 10px">Email</th><th align="left" style="padding:6px 10px">Reason</th></tr>
               ${intakeRows}
             </table>`
          : ""
      }
      ${
        failed.length
          ? `<p style="margin:0 0 8px;color:#C42130"><strong>Saved leads whose email send FAILED — follow up manually:</strong></p>
             <table style="border-collapse:collapse;width:100%;font-size:13px">
               <tr><th align="left" style="padding:6px 10px">Company</th><th align="left" style="padding:6px 10px">Email</th><th align="left" style="padding:6px 10px">Status</th><th align="left" style="padding:6px 10px">Map</th></tr>
               ${failRows}
             </table>`
          : ""
      }
      ${
        drifted.length
          ? `<p style="margin:16px 0 8px;color:#b8860b"><strong>Give-away drift — readout named a build component (spot-check the give-away):</strong></p>
             <table style="border-collapse:collapse;width:100%;font-size:13px">
               <tr><th align="left" style="padding:6px 10px">Company</th><th align="left" style="padding:6px 10px">Flagged term(s)</th><th align="left" style="padding:6px 10px">Map</th></tr>
               ${driftRows}
             </table>`
          : ""
      }
      ${
        guarded.length
          ? `<p style="margin:16px 0 8px;color:#b8860b"><strong>Guard fallbacks — a leak/skeleton was caught and replaced with vetted prose (model still needs the net):</strong></p>
             <table style="border-collapse:collapse;width:100%;font-size:13px">
               <tr><th align="left" style="padding:6px 10px">Company</th><th align="left" style="padding:6px 10px">Field (reason)</th><th align="left" style="padding:6px 10px">Map</th></tr>
               ${guardRows}
             </table>`
          : ""
      }
      ${
        unspecific.length
          ? `<p style="margin:16px 0 8px;color:#b8860b"><strong>Specificity gaps — a key field echoed none of the owner's own words (reads as a template to its one reader):</strong></p>
             <table style="border-collapse:collapse;width:100%;font-size:13px">
               <tr><th align="left" style="padding:6px 10px">Company</th><th align="left" style="padding:6px 10px">Fields with no echo</th><th align="left" style="padding:6px 10px">Map</th></tr>
               ${specificityRows}
             </table>`
          : ""
      }
      ${hasFailures ? "" : `<p style="margin:0;color:#1a7f37">All sends succeeded.</p>`}
      <p style="font-size:12px;color:#888;margin:18px 0 0">PRAXIS · automated email-health digest</p>
    </div>`

  try {
    const resend = new Resend(resendKey)
    const { error: sendError } = await resend.emails.send({
      from: "PRAXIS Leverage Map <noreply@gopraxis.ai>",
      to: NOTIFY_EMAILS,
      subject,
      html,
    })
    if (sendError) {
      console.error("email-health-digest send error:", sendError)
      return Response.json({ ok: false, sent: false, reason: "digest send failed", summary }, { status: 502 })
    }
  } catch (err) {
    console.error("email-health-digest send threw:", err)
    return Response.json({ ok: false, sent: false, reason: "digest send threw", summary }, { status: 502 })
  }

  return Response.json({ ok: true, sent: true, summary })
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
