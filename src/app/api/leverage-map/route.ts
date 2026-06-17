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
  scoreLeverageMap,
  type LeverageMapAiResult,
  type LeverageMapInput,
  type LeverageMapScore,
} from "@/lib/leverage-map"

export const dynamic = "force-dynamic"

const NOTIFY_EMAILS = ["Justin@gopraxis.ai"]

export async function POST(req: Request) {
  let input: LeverageMapInput
  try {
    input = sanitizeInput(await req.json())
  } catch {
    return Response.json({ error: "Invalid leverage map submission" }, { status: 400 })
  }

  const required = [input.company, input.name, input.email, input.businessKind, input.brokenMoment]
  if (required.some((value) => !value?.trim())) {
    return Response.json({ error: "Missing required fields" }, { status: 400 })
  }

  const score = scoreLeverageMap(input)
  const aiResult = await generateAiResult(input, score)
  const lead = await saveLead(input, score, aiResult)
  await notifyJustin(input, score, aiResult, lead?.id ?? null)

  return Response.json({
    ok: true,
    leadId: lead?.id ?? null,
    score,
    result: aiResult,
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
            "You are the Praxis Leverage Map interpreter. Praxis sells practical operational AI work to owner-led businesses. Return only valid JSON. Do not recommend generic AI tools. Do not say 'diagnostic', 'maturity', 'competency', or 'quiz'. Do not promise ROI. Write like a sharp operator mapping one real workflow. Keep it specific to the submitted operating mess. The user-facing result should feel like a useful mini-consulting artifact, not a score report.",
        },
        {
          role: "user",
          content: JSON.stringify({
            instructions: {
              output_shape: {
                pattern_label: "short label, may combine primary + secondary",
                result_title: "one of the provided result bands",
                operator_readout: "specific multi-sentence read of their mess; quote or mirror their submitted language where useful",
                what_you_are_already_doing_right: "one grounding note that reduces defensiveness and names the useful signal they already provided",
                where_it_costs_you: "specific operational spot where leverage is hiding and how the cost shows up",
                what_an_intervention_looks_like: "plain-English first intervention specific to their workflow; no generic AI tool list",
                first_fix: "one small, concrete place to start proving leverage",
                why_this_is_fixable: "explain why this is a tractable workflow issue, not a personal/team failure",
                ninety_day_picture: "what good looks like after acting for 90 days, without ROI promises",
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

async function saveLead(input: LeverageMapInput, score: LeverageMapScore, aiResult: LeverageMapAiResult) {
  const supabaseUrl = cleanEnv(process.env.SUPABASE_URL)
  const supabaseKey = cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY)
  if (!supabaseUrl || !supabaseKey) return null

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
      tier_discussed: score.composite >= 6 ? "Discovery Sprint" : "Other",
      signal_depth: score.signalDepth,
      signal_readiness: score.signalReadiness,
      imagination_gap: score.imaginationGap,
      signal_composite: score.composite,
      surfaced_pains: score.surfacedPains,
      next_action: score.recommendedNextAction,
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
) {
  const resendKey = cleanEnv(process.env.RESEND_API_KEY)
  if (!resendKey) return

  const resend = new Resend(resendKey)
  const subject = `Praxis Leverage Map: ${input.company} · ${aiResult.pattern_label} · ${score.composite}/9`
  const rows: Array<[string, string | number | null | undefined]> = [
    ["Lead ID", leadId],
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
    await resend.emails.send({
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
  } catch (error) {
    console.error("Resend leverage map error:", error)
  }
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
