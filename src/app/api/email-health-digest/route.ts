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
    .select("id, company, contact_email, signal_composite, public_token, created_at, email_status")
    .not("leverage_map", "is", null)
    .gte("created_at", cutoff)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("email-health-digest query error:", error)
    return Response.json({ error: "query failed" }, { status: 500 })
  }

  const leads = (data ?? []) as LeadRow[]
  const failed = leads.filter(
    (l) => l.email_status?.prospect === "failed" || l.email_status?.notify === "failed",
  )
  const summary = {
    window_hours: WINDOW_HOURS,
    submissions: leads.length,
    prospect_failed: leads.filter((l) => l.email_status?.prospect === "failed").length,
    notify_failed: leads.filter((l) => l.email_status?.notify === "failed").length,
    failed_leads: failed.length,
  }

  // No submissions in the window: nothing to report, no noise.
  if (leads.length === 0) {
    return Response.json({ ok: true, sent: false, reason: "no submissions in window", summary })
  }

  const resendKey = cleanEnv(process.env.RESEND_API_KEY)
  if (!resendKey) {
    return Response.json({ ok: true, sent: false, reason: "resend not configured", summary })
  }

  const hasFailures = failed.length > 0
  const subject = hasFailures
    ? `⚠️ Leverage Map email health · ${failed.length} FAILED of ${leads.length} (24h)`
    : `Leverage Map email health · ${leads.length} submissions, all sent (24h)`

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

  const html = `
    <div style="font-family:sans-serif;color:#111;max-width:640px">
      <h2 style="margin:0 0 8px">Leverage Map email health (last ${WINDOW_HOURS}h)</h2>
      <p style="margin:0 0 4px">Submissions: <strong>${leads.length}</strong></p>
      <p style="margin:0 0 4px">Prospect sends failed: <strong style="color:${summary.prospect_failed ? "#C42130" : "#111"}">${summary.prospect_failed}</strong></p>
      <p style="margin:0 0 16px">Notify sends failed: <strong style="color:${summary.notify_failed ? "#C42130" : "#111"}">${summary.notify_failed}</strong></p>
      ${
        hasFailures
          ? `<p style="margin:0 0 8px;color:#C42130"><strong>These prospects did NOT get their map — follow up manually:</strong></p>
             <table style="border-collapse:collapse;width:100%;font-size:13px">
               <tr><th align="left" style="padding:6px 10px">Company</th><th align="left" style="padding:6px 10px">Email</th><th align="left" style="padding:6px 10px">Status</th><th align="left" style="padding:6px 10px">Map</th></tr>
               ${failRows}
             </table>`
          : `<p style="margin:0;color:#1a7f37">All sends succeeded.</p>`
      }
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
