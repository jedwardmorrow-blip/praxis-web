import crypto from "node:crypto"
import { createClient } from "@supabase/supabase-js"

// Resend delivery webhook. Resend signs events with Svix; we verify the
// signature, then fold delivered/bounced/complained back onto the lead's
// email_status (matched by the Resend message id captured at send time). This
// is what makes email_status reflect true inbox delivery, not just "accepted".
//
// One-time setup: in the Resend dashboard add a webhook -> https://gopraxis.ai/api/resend-webhook
// for the email.delivered / email.bounced / email.complained / email.delivery_delayed
// events, then put its signing secret in Vercel as RESEND_WEBHOOK_SECRET and redeploy.

export const dynamic = "force-dynamic"

function cleanEnv(value: string | undefined) {
  return (value ?? "").trim().replace(/^"|"$/g, "").replace(/\\n/g, "").replace(/\n/g, "")
}

// Manual Svix verification (no extra dependency). Signature is base64 HMAC-SHA256
// of `${id}.${timestamp}.${body}` keyed by the base64-decoded secret.
function verifySvix(secret: string, id: string, ts: string, sig: string, body: string): boolean {
  if (!id || !ts || !sig) return false
  const timestamp = Number(ts)
  if (!Number.isFinite(timestamp)) return false
  // Reject stale/replayed events (5-minute tolerance).
  const skewSeconds = Math.abs(Math.floor(Date.now() / 1000) - timestamp)
  if (skewSeconds > 300) return false

  const key = Buffer.from(secret.replace(/^whsec_/, ""), "base64")
  const expected = crypto.createHmac("sha256", key).update(`${id}.${ts}.${body}`).digest("base64")
  const expectedBuf = Buffer.from(expected)

  // Header is space-separated "v1,<sig>" entries; any match is valid.
  return sig.split(" ").some((part) => {
    const candidate = part.split(",")[1]
    if (!candidate) return false
    const candidateBuf = Buffer.from(candidate)
    return candidateBuf.length === expectedBuf.length && crypto.timingSafeEqual(candidateBuf, expectedBuf)
  })
}

const EVENT_STATUS: Record<string, string> = {
  "email.delivered": "delivered",
  "email.bounced": "bounced",
  "email.complained": "complained",
  "email.delivery_delayed": "delayed",
}

async function applyDeliveryEvent(emailId: string, status: string) {
  const url = cleanEnv(process.env.SUPABASE_URL)
  const key = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!url || !key) return

  const supabase = createClient(url, key)
  const { data: rows, error } = await supabase
    .from("praxis_leads")
    .select("id, email_status")
    .or(`email_status->>prospect_id.eq.${emailId},email_status->>notify_id.eq.${emailId}`)
    .limit(1)

  if (error || !rows?.length) return
  const lead = rows[0] as { id: string; email_status: Record<string, unknown> | null }
  const current = lead.email_status ?? {}
  const which = current.prospect_id === emailId ? "prospect" : "notify"

  await supabase
    .from("praxis_leads")
    .update({
      email_status: { ...current, [which]: status, [`${which}_event_at`]: new Date().toISOString() },
    })
    .eq("id", lead.id)
}

export async function POST(req: Request) {
  const secret = cleanEnv(process.env.RESEND_WEBHOOK_SECRET)
  const body = await req.text()

  if (!secret) {
    console.error("RESEND_WEBHOOK_SECRET not configured; rejecting webhook")
    return Response.json({ error: "webhook not configured" }, { status: 500 })
  }

  const id = req.headers.get("svix-id") ?? ""
  const ts = req.headers.get("svix-timestamp") ?? ""
  const sig = req.headers.get("svix-signature") ?? ""
  if (!verifySvix(secret, id, ts, sig, body)) {
    return Response.json({ error: "invalid signature" }, { status: 401 })
  }

  let event: { type?: string; data?: { email_id?: string; id?: string } }
  try {
    event = JSON.parse(body)
  } catch {
    return Response.json({ error: "invalid payload" }, { status: 400 })
  }

  const status = event.type ? EVENT_STATUS[event.type] : undefined
  const emailId = event.data?.email_id ?? event.data?.id
  // Acknowledge events we don't track (sent/opened/clicked) so Resend stops retrying.
  if (status && emailId) await applyDeliveryEvent(emailId, status)

  return Response.json({ ok: true })
}
