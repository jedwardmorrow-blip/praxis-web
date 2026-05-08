import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"

// Force dynamic rendering: env vars are bound at request time, not build time.
// Module-level supabase/resend init would otherwise crash page-data collection.
export const dynamic = "force-dynamic"

const NOTIFY_EMAILS = ["Justin@gopraxis.ai", "Greg@gopraxis.ai"]

export async function POST(req: Request) {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const resend = new Resend(process.env.RESEND_API_KEY)

  let body: Record<string, string>
  try {
    body = await req.json()
  } catch {
    return Response.json({ error: "Invalid request body" }, { status: 400 })
  }

  const formType = body.form_type || "main"

  // Map free-text referral to constrained source enum
  const rawReferral = (body.referral || body.source || "").toLowerCase()
  let source: string
  if (formType === "cannabis" || rawReferral.includes("icbc")) {
    source = "icbc"
  } else if (rawReferral.includes("referral") || rawReferral.includes("friend") || rawReferral.includes("recommend")) {
    source = "referral"
  } else if (rawReferral.includes("greg")) {
    source = "greg_network"
  } else if (rawReferral.includes("justin")) {
    source = "justin_network"
  } else {
    source = "inbound_form"
  }

  // Build the world_model_notes from extra fields
  const notes: string[] = []
  if (body.title) notes.push(`Role: ${body.title}`)
  if (body.phone) notes.push(`Phone: ${body.phone}`)
  if (body.industry) notes.push(`Industry: ${body.industry}`)
  if (body.team_size) notes.push(`Team size: ${body.team_size}`)
  if (body.revenue_range) notes.push(`Revenue range: ${body.revenue_range}`)
  if (body.current_tools) notes.push(`Current tools: ${body.current_tools}`)
  if (body.states) notes.push(`States: ${body.states}`)
  if (body.prior_attempts) notes.push(`Prior attempts: ${body.prior_attempts}`)
  if (body.referral) notes.push(`Referral (raw): ${body.referral}`)
  if (formType) notes.push(`Form: ${formType}`)

  // Write to praxis_leads
  const { data: lead, error: dbError } = await supabase
    .from("praxis_leads")
    .insert({
      company: body.company || body.business || "Unknown",
      contact_name: body.name || null,
      contact_email: body.email || null,
      source: source,
      stage: "Identified",
      pain_summary: body.challenge || null,
      world_model_notes: notes.length > 0 ? notes.join("\n") : null,
    })
    .select("id")
    .single()

  if (dbError) {
    console.error("Supabase insert error:", dbError)
    return Response.json({ error: "Failed to save lead" }, { status: 500 })
  }

  // Send email notification
  const subject = `New Praxis lead${formType === "cannabis" ? " [Cannabis/ICBC]" : ""}: ${body.company || body.business || "Unknown company"}`

  const emailLines = [
    `<h2 style="font-family:sans-serif;color:#111">New intake submission</h2>`,
    `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">`,
  ]

  const fields: [string, string | undefined][] = [
    ["Company / Business", body.company || body.business],
    ["Name", body.name],
    ["Email", body.email],
    ["States", body.states],
    ["Team size", body.team_size],
    ["Challenge", body.challenge],
    ["Prior attempts", body.prior_attempts],
    ["Current tools", body.current_tools],
    ["How they found us", body.referral || body.source],
    ["Form", formType],
    ["Lead ID", lead?.id],
  ]

  for (const [label, value] of fields) {
    if (!value) continue
    emailLines.push(
      `<tr>
        <td style="padding:8px 12px;background:#f5f5f5;font-weight:600;width:180px;vertical-align:top">${label}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${value}</td>
      </tr>`
    )
  }

  emailLines.push(`</table>`)

  try {
    await resend.emails.send({
      from: "PRAXIS Intake <noreply@gopraxis.ai>",
      to: NOTIFY_EMAILS,
      subject,
      html: emailLines.join("\n"),
    })
  } catch (emailError) {
    // Don't fail the request if email fails — lead is already saved
    console.error("Resend error:", emailError)
  }

  return Response.json({ ok: true })
}
