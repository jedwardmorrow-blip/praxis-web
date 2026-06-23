import { createClient } from "@supabase/supabase-js"
import { Resend } from "resend"
import {
  BROKEN_MOMENTS,
  CONSEQUENCES,
  COST_BANDS,
  FREQUENCIES,
  FRICTIONS,
  LEVERAGE_PATTERNS,
  PAIN_STATEMENTS,
  PEOPLE_TOUCHES,
  SESSION_OPENNESS,
  TEAM_SIZES,
  TRUTH_LOCATIONS,
  fallbackAiResult,
  firstNameOf,
  isThinSubmission,
  scoreLeverageMap,
  toPublicResult,
  type LeverageMapAiResult,
  type LeverageMapInput,
  type LeverageMapScore,
  type StoredLeverageMap,
} from "@/lib/leverage-map"

export const dynamic = "force-dynamic"

const NOTIFY_EMAILS = ["Justin@gopraxis.ai"]
const SITE_URL = "https://gopraxis.ai"

type EmailStatus = "sent" | "failed" | "skipped"

export async function POST(req: Request) {
  let raw: unknown
  try {
    raw = await req.json()
  } catch {
    return Response.json({ error: "Invalid leverage map submission" }, { status: 400 })
  }

  // Honeypot: a hidden field real users never see. Bots fill it; we keep the
  // public endpoint cheap by skipping the model call, the lead insert, and the email.
  const honeypot = raw && typeof raw === "object" ? asString((raw as Record<string, unknown>)._hp) : ""

  const input = sanitizeInput(raw)

  const required = [input.company, input.name, input.email, input.brokenMoment]
  if (required.some((value) => !value?.trim())) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  const score = scoreLeverageMap(input)

  if (honeypot) {
    return Response.json({
      ok: true,
      leadId: null,
      mapToken: null,
      score,
      result: toPublicResult(fallbackAiResult(input, score)),
      deterministicFallback: true,
    })
  }

  const aiResult = await generateAiResult(input, score)

  // Internal triage flag: a thin/likely-junk lead looks identical to a real
  // early one at the score level, so flag it where Justin will see it.
  if (isThinSubmission(input)) {
    aiResult.internal.disqualification_flags = [
      "Thin submission — low content; qualify before spending build time.",
      ...aiResult.internal.disqualification_flags,
    ]
  }

  const token = crypto.randomUUID().replace(/-/g, "")
  const lead = await saveLead(input, score, aiResult, token)
  const mapToken = lead ? token : null

  // Send the prospect email first so its outcome can be reported to Justin and
  // recorded on the lead — a swallowed Resend failure must not stay invisible.
  const prospectStatus: EmailStatus = mapToken ? await emailProspectMap(input, aiResult, mapToken) : "skipped"
  const notifyStatus: EmailStatus = await notifyJustin(input, score, aiResult, lead?.id ?? null, mapToken, prospectStatus)
  if (lead?.id) await updateLeadEmailStatus(lead.id, prospectStatus, notifyStatus)

  return Response.json({
    ok: true,
    leadId: lead?.id ?? null,
    mapToken,
    score,
    // Only the public slice reaches the browser — never the internal block.
    result: toPublicResult(aiResult),
    deterministicFallback: !process.env.OPENAI_API_KEY,
  })
}

function sanitizeInput(raw: unknown): LeverageMapInput {
  const body = raw && typeof raw === "object" ? (raw as Record<string, unknown>) : {}
  return {
    company: asString(body.company).slice(0, 160),
    name: asString(body.name).slice(0, 120),
    email: asString(body.email).slice(0, 180),
    phone: asString(body.phone).slice(0, 80),
    role: asString(body.role).slice(0, 140),
    businessKind: asString(body.businessKind).slice(0, 180),
    teamSize: asKnown(body.teamSize, TEAM_SIZES),
    brokenMoment: asKnown(body.brokenMoment, BROKEN_MOMENTS),
    momentStory: asString(body.momentStory).slice(0, 1600),
    peopleTouches: asKnownArray(body.peopleTouches, PEOPLE_TOUCHES),
    truthLocations: asKnownArray(body.truthLocations, TRUTH_LOCATIONS),
    frictions: asKnownArray(body.frictions, FRICTIONS),
    consequences: asKnownArray(body.consequences, CONSEQUENCES),
    painStatement: asKnown(body.painStatement, PAIN_STATEMENTS),
    frequency: asKnown(body.frequency, FREQUENCIES),
    costBand: asKnown(body.costBand, COST_BANDS),
    perfectEmployee: asString(body.perfectEmployee).slice(0, 1200),
    openToSession: asKnown(body.openToSession, SESSION_OPENNESS),
  }
}

async function generateAiResult(input: LeverageMapInput, score: LeverageMapScore): Promise<LeverageMapAiResult> {
  const fallback = fallbackAiResult(input, score)
  const apiKey = cleanEnv(process.env.OPENAI_API_KEY)
  if (!apiKey) return fallback

  const model = cleanEnv(process.env.OPENAI_LEVERAGE_MAP_MODEL) || cleanEnv(process.env.OPENAI_MODEL) || "gpt-4.1"

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.35,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content:
            "You are the Praxis Leverage Map interpreter. Praxis sells practical operational AI work to owner-led businesses. Return only valid JSON. Do not recommend generic AI tools. Do not say 'diagnostic', 'maturity', 'competency', or 'quiz'. Do not promise ROI. Write like a sharp operator mapping one real workflow. Keep it specific to the submitted operating mess. The user-facing result should feel like a useful mini-consulting artifact, not a score report. " +
            "Three hard rules that decide whether this is good: " +
            "(1) BINDING CONSTRAINT — name the specific mechanism that actually caused the loss, not just the visible symptom. If a job died over a weekend, the binding constraint is response latency / after-hours coverage, not merely 'no central log'. Diagnose the mechanism and make the readout address it. " +
            "(2) DO NOT HAND OVER THE WHOLE SOLUTION — first_fix is the single smallest useful proof step the owner can take this week to feel the leverage, NOT the complete fix. Never prescribe a fix that depends on the exact behavior that is already failing (do not tell a team that fails to log things to 'just log things in a sheet'); the fix must route around the failing human dependency. Leave the deeper, higher-judgment work for the session. " +
            "(3) BRIDGE TO THE SESSION — what_the_session_unlocks must name, specific to their workflow, the deeper leverage that a 30-minute call plus a focused build opens up that the DIY first step will not: sequencing, what to automate vs. assign, removing the human-memory dependency. Concrete, honest, never a hard sell. Also surface one second-order cost they probably have not priced (wasted marketing spend, warranty/contract bleed, owner time).",
        },
        {
          role: "user",
          content: JSON.stringify({
            instructions: {
              output_shape: {
                pattern_label: "short label, may combine primary + secondary",
                result_title: "one of the provided result bands",
                operator_readout: "specific multi-sentence read of their mess; quote or mirror their submitted language where useful; NAME the binding constraint (the actual mechanism that caused the loss), not just the visible symptom",
                what_you_are_already_doing_right: "one grounding note that reduces defensiveness and names the useful signal they already provided",
                where_it_costs_you: "specific operational spot where leverage is hiding and how the cost shows up; include one second-order cost they probably have not priced (wasted marketing spend, warranty/contract bleed, owner time)",
                what_an_intervention_looks_like: "the shape of the real intervention that addresses the binding constraint and routes around the failing human dependency; plain-English, specific to their workflow; no generic AI tool list; this is the direction, not the whole build",
                first_fix: "the single smallest useful PROOF step they can take this week to feel the leverage; NOT the complete solution; must not rely on the behavior that is already failing",
                why_this_is_fixable: "explain why this is a tractable workflow issue, not a personal/team failure",
                ninety_day_picture: "what good looks like after acting for 90 days, without ROI promises; consistent with the intervention (do not promise outcomes the prescribed change does not produce)",
                what_the_session_unlocks: "specific to their workflow, the deeper leverage a 30-minute intro call plus a focused build opens up that the DIY first step will not: sequencing so it survives a busy week, what to automate vs. who to make accountable, removing the human-memory dependency; concrete and honest, never a hard sell",
                internal: {
                  session_questions: "array of exactly 3 strong questions Justin should ask; never for user display",
                  follow_up_opener: "one natural follow-up opener using their mess",
                  crm_summary: "one internal CRM summary sentence",
                  confidence: "low | medium | high",
                  lead_score: "integer 1-9 based on fit and urgency",
                  likely_buyer_mindset: "what this buyer is probably thinking",
                  recommended_offer: "AI Leverage Session | Discovery Sprint | Clarifying workflow call | Nurture",
                  sales_angle: "specific sales angle Justin should take",
                  urgency_reason: "why now, or why not yet",
                  follow_up_subject: "short email subject",
                  follow_up_sms: "short text-safe follow-up",
                  disqualification_flags: "array of short flags, empty if none",
                },
              },
              guardrails: [
                "Mine momentStory and perfectEmployee hardest; those are the real signal.",
                "Use the submitted answer language when useful so the readout feels personally observed.",
                "Prefer handoff, context, ownership, status, and reusable judgment language.",
                "Frame the business as capable; do not shame the owner or team.",
                "Name the friction as the kind of thing owners often quietly stop trying to fix, then make plain why it is tractable now — never shame them for having lived with it.",
                "Diagnose the binding constraint — the actual mechanism of the loss — not just the visible symptom; address that mechanism in the fix.",
                "first_fix is the smallest useful proof, never the whole solution, and never relies on the behavior that is already failing.",
                "what_the_session_unlocks must give the owner a concrete reason the session beats a DIY tweak, plus one second-order cost they have not priced; do not hard-sell.",
                "If the answer is thin, keep confidence low and make the next step clarifying.",
              ],
            },
            score,
            pattern: LEVERAGE_PATTERNS[score.primaryPattern],
            secondaryPattern: score.secondaryPattern ? LEVERAGE_PATTERNS[score.secondaryPattern] : null,
            labels: labelInput(input),
          }),
        },
      ],
    }),
  })

  if (!response.ok) {
    console.error("OpenAI leverage map error:", response.status, await response.text())
    return fallback
  }

  try {
    const data = await response.json()
    const content = data?.choices?.[0]?.message?.content
    const parsed = JSON.parse(content)
    return normalizeAiResult(parsed, fallback)
  } catch (error) {
    console.error("OpenAI leverage map parse error:", error)
    return fallback
  }
}

async function saveLead(
  input: LeverageMapInput,
  score: LeverageMapScore,
  aiResult: LeverageMapAiResult,
  token: string,
) {
  const supabaseUrl = cleanEnv(process.env.SUPABASE_URL)
  const supabaseKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!supabaseUrl || !supabaseKey) return null

  // Self-contained, PII-light payload the public map page renders. The internal
  // sales block is stripped here so it can never be read off the shareable URL.
  const storedMap: StoredLeverageMap = {
    company: input.company,
    firstName: firstNameOf(input.name),
    score,
    result: toPublicResult(aiResult),
    createdAt: new Date().toISOString(),
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data, error } = await supabase
    .from("praxis_leads")
    .insert({
      company: input.company,
      contact_name: input.name || null,
      contact_email: input.email || null,
      contact_phone: input.phone || null,
      source: "inbound_form",
      stage: "Identified",
      pain_summary: aiResult.internal.crm_summary,
      world_model_notes: buildWorldModelNotes(input, score, aiResult),
      tier_discussed: score.composite >= 6 ? "Discovery Sprint" : "Not Yet Discussed",
      signal_depth: score.signalDepth,
      signal_readiness: score.signalReadiness,
      imagination_gap: score.imaginationGap,
      signal_composite: score.composite,
      surfaced_pains: score.surfacedPains,
      next_action: score.recommendedNextAction,
      public_token: token,
      leverage_map: storedMap,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Supabase leverage map insert error:", error)
    return null
  }

  return data
}

async function notifyJustin(
  input: LeverageMapInput,
  score: LeverageMapScore,
  aiResult: LeverageMapAiResult,
  leadId: string | null,
  mapToken: string | null,
  prospectStatus: EmailStatus,
): Promise<EmailStatus> {
  const resendKey = cleanEnv(process.env.RESEND_API_KEY)
  if (!resendKey) return "skipped"

  const prospectEmailLine =
    prospectStatus === "sent"
      ? "sent"
      : prospectStatus === "failed"
        ? "FAILED — the prospect did NOT receive their map; follow up manually"
        : "not sent"

  const resend = new Resend(resendKey)
  const subject = `Praxis Leverage Map: ${input.company} · ${aiResult.pattern_label} · ${score.composite}/9`
  const rows: Array<[string, string | number | null | undefined]> = [
    ["Lead ID", leadId],
    ["Map link", mapToken ? `${SITE_URL}/check/map/${mapToken}` : null],
    ["Prospect email", prospectEmailLine],
    ["Company", input.company],
    ["Name", input.name],
    ["Email", input.email],
    ["Phone", input.phone],
    ["Business", input.businessKind],
    ["Team size", input.teamSize ? TEAM_SIZES[input.teamSize] : null],
    ["Pattern", aiResult.pattern_label],
    ["Signal", `${score.composite}/9 (${score.resultBand})`],
    ["Follow-up opener", aiResult.internal.follow_up_opener],
    ["First fix", aiResult.first_fix],
    ["Lead score", aiResult.internal.lead_score],
    ["Buyer mindset", aiResult.internal.likely_buyer_mindset],
    ["Recommended offer", aiResult.internal.recommended_offer],
    ["Sales angle", aiResult.internal.sales_angle],
    ["Urgency", aiResult.internal.urgency_reason],
    ["Subject", aiResult.internal.follow_up_subject],
    ["SMS", aiResult.internal.follow_up_sms],
    ["Flags", aiResult.internal.disqualification_flags.join(", ")],
    ["Story", input.momentStory],
  ]

  try {
    const { error } = await resend.emails.send({
      from: "PRAXIS Leverage Map <noreply@gopraxis.ai>",
      to: NOTIFY_EMAILS,
      subject,
      html: `
        <h2 style="font-family:sans-serif;color:#111">New Praxis Leverage Map</h2>
        <p style="font-family:sans-serif;color:#333">${escapeHtml(aiResult.operator_readout)}</p>
        <table style="font-family:sans-serif;font-size:14px;border-collapse:collapse;width:100%">
          ${rows
            .filter(([, value]) => value != null && String(value).trim())
            .map(
              ([label, value]) => `
                <tr>
                  <td style="padding:8px 12px;background:#f5f5f5;font-weight:700;width:170px;vertical-align:top">${escapeHtml(label)}</td>
                  <td style="padding:8px 12px;border-bottom:1px solid #eee;white-space:pre-wrap">${escapeHtml(String(value))}</td>
                </tr>
              `,
            )
            .join("")}
        </table>
      `,
    })
    if (error) {
      console.error("Resend notify error:", error)
      return "failed"
    }
    return "sent"
  } catch (error) {
    console.error("Resend leverage map error:", error)
    return "failed"
  }
}

// Send the prospect their own keepable copy: a link to the persistent map plus
// the single most useful line (the first fix). Their map is the artifact that
// keeps working after they close the tab — this is what makes it shareable.
async function emailProspectMap(
  input: LeverageMapInput,
  aiResult: LeverageMapAiResult,
  token: string,
): Promise<EmailStatus> {
  const resendKey = cleanEnv(process.env.RESEND_API_KEY)
  if (!resendKey || !input.email.includes("@")) return "skipped"

  const mapUrl = `${SITE_URL}/check/map/${token}`
  const bookingUrl = cleanEnv(process.env.NEXT_PUBLIC_PRAXIS_BOOKING_URL)
  const first = firstNameOf(input.name)
  const resend = new Resend(resendKey)

  try {
    const { error } = await resend.emails.send({
      from: "PRAXIS Leverage Map <noreply@gopraxis.ai>",
      to: [input.email],
      replyTo: "Justin@gopraxis.ai",
      subject: `Your Praxis Leverage Map · ${aiResult.pattern_label}`,
      html: `
        <div style="background:#0a2545;color:#F1E8D2;font-family:'IBM Plex Sans',Arial,sans-serif;padding:32px 28px;max-width:560px;margin:0 auto">
          <p style="color:#C9A24B;font-size:12px;letter-spacing:0.2em;text-transform:uppercase;margin:0 0 18px">Praxis Leverage Map</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 16px">Hi ${escapeHtml(first)}, your leverage map is ready.</p>
          <p style="font-size:16px;line-height:1.6;margin:0 0 8px">We read your map as a <strong>${escapeHtml(aiResult.pattern_label)}</strong> pattern. The first place to look:</p>
          <p style="font-size:16px;line-height:1.6;border-left:2px solid #C9A24B;padding-left:14px;margin:0 0 22px;color:#F1E8D2">${escapeHtml(aiResult.first_fix)}</p>
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
      console.error("Resend prospect map error:", error)
      return "failed"
    }
    return "sent"
  } catch (error) {
    console.error("Resend prospect map error:", error)
    return "failed"
  }
}

// Record the per-send email outcome on the lead so a swallowed Resend failure
// is visible in the CRM, not just lost in function logs.
async function updateLeadEmailStatus(leadId: string, prospect: EmailStatus, notify: EmailStatus) {
  const supabaseUrl = cleanEnv(process.env.SUPABASE_URL)
  const supabaseKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!supabaseUrl || !supabaseKey) return

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { error } = await supabase
    .from("praxis_leads")
    .update({ email_status: { prospect, notify, at: new Date().toISOString() } })
    .eq("id", leadId)

  if (error) console.error("Supabase email_status update error:", error)
}

function buildWorldModelNotes(input: LeverageMapInput, score: LeverageMapScore, aiResult: LeverageMapAiResult) {
  return [
    "[Praxis Leverage Map]",
    `Pattern: ${aiResult.pattern_label}`,
    `Result: ${score.resultBand} · Signal ${score.composite}/9 (depth ${score.signalDepth}, readiness ${score.signalReadiness}, imagination ${score.imaginationGap})`,
    `Business: ${input.businessKind}`,
    `Role: ${input.role || "Not provided"}`,
    `Team size: ${input.teamSize ? TEAM_SIZES[input.teamSize] : "Not provided"}`,
    `Broken moment: ${input.brokenMoment ? BROKEN_MOMENTS[input.brokenMoment].label : "Not provided"}`,
    `People touched: ${input.peopleTouches.map((key) => PEOPLE_TOUCHES[key as keyof typeof PEOPLE_TOUCHES]).join(", ") || "Not provided"}`,
    `Truth locations: ${input.truthLocations.map((key) => TRUTH_LOCATIONS[key as keyof typeof TRUTH_LOCATIONS]).join(", ") || "Not provided"}`,
    `Friction: ${input.frictions.map((key) => FRICTIONS[key as keyof typeof FRICTIONS]).join(", ") || "Not provided"}`,
    `Consequence: ${input.consequences.map((key) => CONSEQUENCES[key as keyof typeof CONSEQUENCES]).join(", ") || "Not provided"}`,
    `Pain statement: ${input.painStatement ? PAIN_STATEMENTS[input.painStatement] : "Not provided"}`,
    `Frequency: ${input.frequency ? FREQUENCIES[input.frequency] : "Not provided"}`,
    `Cost: ${input.costBand ? COST_BANDS[input.costBand] : "Not provided"}`,
    `Open to session: ${input.openToSession ? SESSION_OPENNESS[input.openToSession] : "Not provided"}`,
    `Story: ${input.momentStory || "Not provided"}`,
    `Strong employee answer: ${input.perfectEmployee || "Not provided"}`,
    `Operator readout: ${aiResult.operator_readout}`,
    `First fix: ${aiResult.first_fix}`,
    `Already doing right: ${aiResult.what_you_are_already_doing_right}`,
    `Where it costs: ${aiResult.where_it_costs_you}`,
    `Intervention: ${aiResult.what_an_intervention_looks_like}`,
    `90 day picture: ${aiResult.ninety_day_picture}`,
    `Session questions: ${aiResult.internal.session_questions.join(" | ")}`,
    `Follow-up opener: ${aiResult.internal.follow_up_opener}`,
    `Lead score: ${aiResult.internal.lead_score}`,
    `Buyer mindset: ${aiResult.internal.likely_buyer_mindset}`,
    `Recommended offer: ${aiResult.internal.recommended_offer}`,
    `Sales angle: ${aiResult.internal.sales_angle}`,
    `Urgency: ${aiResult.internal.urgency_reason}`,
    `Subject: ${aiResult.internal.follow_up_subject}`,
    `SMS: ${aiResult.internal.follow_up_sms}`,
    `Disqualification flags: ${aiResult.internal.disqualification_flags.join(", ") || "None"}`,
  ].join("\n")
}

function labelInput(input: LeverageMapInput) {
  return {
    ...input,
    teamSize: input.teamSize ? TEAM_SIZES[input.teamSize] : "",
    brokenMoment: input.brokenMoment ? BROKEN_MOMENTS[input.brokenMoment].label : "",
    peopleTouches: input.peopleTouches.map((key) => PEOPLE_TOUCHES[key as keyof typeof PEOPLE_TOUCHES]),
    truthLocations: input.truthLocations.map((key) => TRUTH_LOCATIONS[key as keyof typeof TRUTH_LOCATIONS]),
    frictions: input.frictions.map((key) => FRICTIONS[key as keyof typeof FRICTIONS]),
    consequences: input.consequences.map((key) => CONSEQUENCES[key as keyof typeof CONSEQUENCES]),
    painStatement: input.painStatement ? PAIN_STATEMENTS[input.painStatement] : "",
    frequency: input.frequency ? FREQUENCIES[input.frequency] : "",
    costBand: input.costBand ? COST_BANDS[input.costBand] : "",
    openToSession: input.openToSession ? SESSION_OPENNESS[input.openToSession] : "",
  }
}

function normalizeAiResult(parsed: Record<string, unknown>, fallback: LeverageMapAiResult): LeverageMapAiResult {
  const internal = parsed.internal && typeof parsed.internal === "object" ? (parsed.internal as Record<string, unknown>) : {}
  const sessionQuestions = asStringArray(internal.session_questions).slice(0, 3)
  const leadScore = asNumber(internal.lead_score)

  return {
    pattern_label: asString(parsed.pattern_label) || fallback.pattern_label,
    result_title: asString(parsed.result_title) || fallback.result_title,
    operator_readout: asString(parsed.operator_readout) || fallback.operator_readout,
    what_you_are_already_doing_right:
      asString(parsed.what_you_are_already_doing_right) || fallback.what_you_are_already_doing_right,
    where_it_costs_you: asString(parsed.where_it_costs_you) || fallback.where_it_costs_you,
    what_an_intervention_looks_like:
      asString(parsed.what_an_intervention_looks_like) || fallback.what_an_intervention_looks_like,
    first_fix: asString(parsed.first_fix) || fallback.first_fix,
    why_this_is_fixable: asString(parsed.why_this_is_fixable) || fallback.why_this_is_fixable,
    ninety_day_picture: asString(parsed.ninety_day_picture) || fallback.ninety_day_picture,
    what_the_session_unlocks: asString(parsed.what_the_session_unlocks) || fallback.what_the_session_unlocks,
    internal: {
      session_questions: sessionQuestions.length ? sessionQuestions : fallback.internal.session_questions,
      follow_up_opener: asString(internal.follow_up_opener) || fallback.internal.follow_up_opener,
      crm_summary: asString(internal.crm_summary) || fallback.internal.crm_summary,
      confidence: asConfidence(internal.confidence) || fallback.internal.confidence,
      lead_score: leadScore ? Math.max(1, Math.min(9, Math.round(leadScore))) : fallback.internal.lead_score,
      likely_buyer_mindset: asString(internal.likely_buyer_mindset) || fallback.internal.likely_buyer_mindset,
      recommended_offer: asString(internal.recommended_offer) || fallback.internal.recommended_offer,
      sales_angle: asString(internal.sales_angle) || fallback.internal.sales_angle,
      urgency_reason: asString(internal.urgency_reason) || fallback.internal.urgency_reason,
      follow_up_subject: asString(internal.follow_up_subject) || fallback.internal.follow_up_subject,
      follow_up_sms: asString(internal.follow_up_sms) || fallback.internal.follow_up_sms,
      disqualification_flags: asStringArray(internal.disqualification_flags).length
        ? asStringArray(internal.disqualification_flags)
        : fallback.internal.disqualification_flags,
    },
  }
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(asString).filter(Boolean) : []
}

function asNumber(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) return value
  if (typeof value === "string") {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
  }
  return 0
}

function asConfidence(value: unknown): LeverageMapAiResult["internal"]["confidence"] | "" {
  const confidence = asString(value)
  return confidence === "low" || confidence === "medium" || confidence === "high" ? confidence : ""
}

function asKnown<T extends Record<string, unknown>>(value: unknown, dictionary: T) {
  const text = asString(value)
  return text && Object.prototype.hasOwnProperty.call(dictionary, text) ? (text as keyof T) : ""
}

function asKnownArray<T extends Record<string, unknown>>(value: unknown, dictionary: T) {
  return asStringArray(value).filter((item) => Object.prototype.hasOwnProperty.call(dictionary, item))
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

function cleanEnv(value: string | undefined) {
  return (value ?? "").trim().replace(/^"|"$/g, "").replace(/\\n/g, "").replace(/\n/g, "")
}
