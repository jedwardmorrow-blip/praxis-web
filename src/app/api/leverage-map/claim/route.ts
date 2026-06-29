import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import { firstNameOf, type PublicLeverageResult } from "@/lib/leverage-map"

// Claim an anonymous (ungated) Leverage Map: the owner saw their map without an
// email, then chose to save it. This upgrades the anonymous lead — sets the email,
// clears the purge marker — then sends their keepable copy and a "now contactable"
// heads-up to Justin. Idempotent: a row that is already claimed is a no-op.

export const dynamic = "force-dynamic"

const NOTIFY_EMAILS = ["Justin@gopraxis.ai"]
const SITE_URL = "https://gopraxis.ai"

type StoredMap = {
  company?: string
  firstName?: string
  result?: PublicLeverageResult
}

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return Response.json({ error: "Invalid request" }, { status: 400 })
  }

  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}
  const mapToken = asString(body.mapToken).slice(0, 64)
  const email = asString(body.email).slice(0, 180)
  const name = asString(body.name).slice(0, 120)

  if (!mapToken || !email.includes("@")) {
    return Response.json({ error: "A map token and a valid email are required" }, { status: 400 })
  }

  const supabaseUrl = cleanEnv(process.env.SUPABASE_URL)
  const supabaseKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!supabaseUrl || !supabaseKey) {
    return Response.json({ error: "not configured" }, { status: 500 })
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: lead, error: lookupError } = await supabase
    .from("praxis_leads")
    .select("id, is_anonymous, contact_name, leverage_map, public_token")
    .eq("public_token", mapToken)
    .maybeSingle()

  if (lookupError) {
    console.error("claim lookup error:", lookupError)
    return Response.json({ error: "lookup failed" }, { status: 500 })
  }
  if (!lead) {
    return Response.json({ error: "map not found" }, { status: 404 })
  }
  // Already claimed (or a gated lead): no-op, do not re-send.
  if (!lead.is_anonymous) {
    return Response.json({ ok: true, alreadyClaimed: true })
  }

  const { data: updated, error: updateError } = await supabase
    .from("praxis_leads")
    .update({
      contact_email: email,
      contact_name: name || lead.contact_name || null,
      is_anonymous: false,
      anon_purge_after: null,
    })
    .eq("id", lead.id)
    .eq("is_anonymous", true) // guard against a race: only the first claim wins
    .select("id")

  if (updateError) {
    console.error("claim update error:", updateError)
    return Response.json({ error: "could not save" }, { status: 500 })
  }
  // Lost the race to a concurrent claim (0 rows updated): the other request owns
  // the emails. Return success without re-sending — keeps claim idempotent.
  if (!updated || updated.length === 0) {
    return Response.json({ ok: true, alreadyClaimed: true })
  }

  // Best-effort emails: the row is already upgraded, so a send failure must not
  // fail the claim. Mirror the main route's email_status shape for the digest.
  const stored = (lead.leverage_map ?? {}) as StoredMap
  const firstName = name ? firstNameOf(name) : stored.firstName || "there"
  const prospect = await emailClaimedMap(email, firstName, stored.result, mapToken)
  const notify = await notifyClaim(stored.company ?? "Unknown", email, mapToken, stored.result)
  await supabase
    .from("praxis_leads")
    .update({
      email_status: {
        prospect: prospect.status,
        prospect_id: prospect.id,
        notify: notify.status,
        notify_id: notify.id,
        claimed: true,
        at: new Date().toISOString(),
      },
    })
    .eq("id", lead.id)

  return Response.json({ ok: true })
}

type EmailSend = { status: "sent" | "failed" | "skipped"; id: string | null }

async function emailClaimedMap(
  email: string,
  firstName: string,
  result: PublicLeverageResult | undefined,
  token: string,
): Promise<EmailSend> {
  const resendKey = cleanEnv(process.env.RESEND_API_KEY)
  if (!resendKey) return { status: "skipped", id: null }
  const mapUrl = `${SITE_URL}/check/map/${token}`
  const bookingUrl = cleanEnv(process.env.NEXT_PUBLIC_PRAXIS_BOOKING_URL)
  const pattern = result?.pattern_label ?? "your leverage map"
  const firstFix = result?.first_fix ?? ""
  const resend = new Resend(resendKey)
  try {
    const { data, error } = await resend.emails.send({
      from: "PRAXIS Leverage Map <noreply@gopraxis.ai>",
      to: [email],
      replyTo: "Justin@gopraxis.ai",
      subject: `Your Praxis Leverage Map · ${pattern}`,
      html: `
        <div style="background:#0a2545;color:#F1E8D2;font-family:'IBM Plex Sans',Arial,sans-serif;padding:32px 28px;max-width:560px;margin:0 auto">
          <p style="color:#C9A24B;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 18px">Praxis Leverage Map</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi ${escapeHtml(firstName)}, here's your saved leverage map.</p>
          ${
            firstFix
              ? `<p style="font-size:16px;line-height:1.6;margin:0 0 8px">We read it as a <strong>${escapeHtml(pattern)}</strong> pattern. The first place to look:</p>
                 <p style="font-size:16px;line-height:1.6;border-left:2px solid #C9A24B;padding-left:14px;margin:0 0 22px;color:#F1E8D2">${escapeHtml(firstFix)}</p>`
              : ""
          }
          <p style="margin:0 0 22px">
            <a href="${escapeHtml(mapUrl)}" style="background:#C42130;color:#F1E8D2;text-decoration:none;padding:13px 22px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;display:inline-block">Open your full map →</a>
          </p>
          ${
            bookingUrl
              ? `<p style="font-size:14px;line-height:1.6;margin:0 0 8px;color:#F1E8D2cc">Want to map it with Justin? <a href="${escapeHtml(bookingUrl)}" style="color:#C9A24B">Book a 30-minute intro call</a>.</p>`
              : `<p style="font-size:14px;line-height:1.6;margin:0 0 8px;color:#F1E8D2cc">Want to map it with Justin? Reply to this email and we'll set up an AI Leverage Session.</p>`
          }
          <p style="font-size:12px;line-height:1.6;margin:24px 0 0;color:#F1E8D299">PRAXIS · Operational Intelligence · gopraxis.ai</p>
        </div>
      `,
    })
    if (error) {
      console.error("claim prospect email error:", error)
      return { status: "failed", id: null }
    }
    return { status: "sent", id: data?.id ?? null }
  } catch (error) {
    console.error("claim prospect email threw:", error)
    return { status: "failed", id: null }
  }
}

async function notifyClaim(
  company: string,
  email: string,
  token: string,
  result: PublicLeverageResult | undefined,
): Promise<EmailSend> {
  const resendKey = cleanEnv(process.env.RESEND_API_KEY)
  if (!resendKey) return { status: "skipped", id: null }
  const resend = new Resend(resendKey)
  try {
    const { data, error } = await resend.emails.send({
      from: "PRAXIS Leverage Map <noreply@gopraxis.ai>",
      to: NOTIFY_EMAILS,
      subject: `[CLAIMED] Ungated lead now contactable: ${company}`,
      html: `
        <h2 style="font-family:sans-serif;color:#111">Anonymous ungated lead claimed — now contactable</h2>
        <p style="font-family:sans-serif;color:#333">An ungated visitor who saw their map anonymously just saved it by email. Follow up.</p>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">
          <tr><td style="padding:6px 12px;font-weight:700">Company</td><td style="padding:6px 12px">${escapeHtml(company)}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:700">Email</td><td style="padding:6px 12px">${escapeHtml(email)}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:700">Pattern</td><td style="padding:6px 12px">${escapeHtml(result?.pattern_label ?? "—")}</td></tr>
          <tr><td style="padding:6px 12px;font-weight:700">Map</td><td style="padding:6px 12px"><a href="${escapeHtml(`${SITE_URL}/check/map/${token}`)}">view</a></td></tr>
        </table>
      `,
    })
    if (error) {
      console.error("claim notify error:", error)
      return { status: "failed", id: null }
    }
    return { status: "sent", id: data?.id ?? null }
  } catch (error) {
    console.error("claim notify threw:", error)
    return { status: "failed", id: null }
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
