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

  const model = cleanEnv(process.env.OPENAI_LEVERAGE_MAP_MODEL) || cleanEnv(process.env.OPENAI_MODEL) || "gpt-4.1-mini"

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
            "You are the Praxis Leverage Map interpreter. Praxis sells practical operational AI work to owner-led businesses. Return only valid JSON. Do not recommend generic AI tools. Do not say 'diagnostic', 'maturity', or 'competency'. Do not promise ROI. Write like a sharp operator mapping one real workflow. Keep it specific to the submitted operating mess.",
        },
        {
          role: "user",
          content: JSON.stringify({
            instructions: {
              output_shape: {
                pattern_label: "short label, may combine primary + secondary",
                result_title: "one of the provided result bands",
                operator_readout: "2-3 sentences, plain English, highly specific",
                why_it_matters: "1-2 sentences about the consequence and leverage point",
                first_workflow_to_inspect: "one concrete workflow to map first",
                session_questions: "array of exactly 3 strong questions Justin should ask",
                follow_up_opener: "one natural follow-up opener using their mess",
                crm_summary: "one internal CRM summary sentence",
                confidence: "low | medium | high",
              },
              guardrails: [
                "Use the submitted answer language when useful.",
                "Prefer handoff, context, ownership, status, and reusable judgment language.",
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
      pain_summary: aiResult.crm_summary,
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
    ["Follow-up opener", aiResult.follow_up_opener],
    ["First workflow", aiResult.first_workflow_to_inspect],
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
    `First workflow: ${aiResult.first_workflow_to_inspect}`,
    `Session questions: ${aiResult.session_questions.join(" | ")}`,
    `Follow-up opener: ${aiResult.follow_up_opener}`,
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
  return {
    pattern_label: asString(parsed.pattern_label) || fallback.pattern_label,
    result_title: asString(parsed.result_title) || fallback.result_title,
    operator_readout: asString(parsed.operator_readout) || fallback.operator_readout,
    why_it_matters: asString(parsed.why_it_matters) || fallback.why_it_matters,
    first_workflow_to_inspect: asString(parsed.first_workflow_to_inspect) || fallback.first_workflow_to_inspect,
    session_questions: asStringArray(parsed.session_questions).slice(0, 3).length
      ? asStringArray(parsed.session_questions).slice(0, 3)
      : fallback.session_questions,
    follow_up_opener: asString(parsed.follow_up_opener) || fallback.follow_up_opener,
    crm_summary: asString(parsed.crm_summary) || fallback.crm_summary,
    confidence: ["low", "medium", "high"].includes(asString(parsed.confidence))
      ? (asString(parsed.confidence) as LeverageMapAiResult["confidence"])
      : fallback.confidence,
  }
}

function asString(value: unknown) {
  return typeof value === "string" ? value.trim() : ""
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.map(asString).filter(Boolean) : []
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
