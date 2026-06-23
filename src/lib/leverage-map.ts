export const LEVERAGE_PATTERNS = {
  owner_bottleneck: {
    label: "Owner Bottleneck",
    publicLine: "The business keeps routing judgment back to one person.",
  },
  lead_leakage: {
    label: "Lead Leakage",
    publicLine: "Demand is showing up, but response and follow-up are not tight enough.",
  },
  handoff_fog: {
    label: "Handoff Fog",
    publicLine: "Work crosses people or tools without one shared source of truth.",
  },
  tribal_knowledge_risk: {
    label: "Tribal Knowledge Risk",
    publicLine: "Important operating knowledge lives in heads instead of reusable systems.",
  },
  reporting_lag: {
    label: "Reporting Lag",
    publicLine: "The business learns what happened after the decision window has passed.",
  },
  customer_status_gap: {
    label: "Customer Status Gap",
    publicLine: "Customers need status before the team has an easy way to answer.",
  },
  tool_fragmentation: {
    label: "Tool Fragmentation",
    publicLine: "The workflow depends on too many disconnected places for the truth.",
  },
  repeat_admin_drag: {
    label: "Repeat Admin Drag",
    publicLine: "People are redoing the same administrative work because the context is not reusable.",
  },
} as const

export type LeveragePattern = keyof typeof LEVERAGE_PATTERNS

export const BROKEN_MOMENTS = {
  lead_followup: {
    label: "A lead came in and follow-up got messy",
    pattern: "lead_leakage",
  },
  customer_update: {
    label: "A customer needed an update and nobody had the answer",
    pattern: "customer_status_gap",
  },
  handoff_stuck: {
    label: "A job, order, or project moved between people and got stuck",
    pattern: "handoff_fog",
  },
  bad_report: {
    label: "A report was late, wrong, or not trusted",
    pattern: "reporting_lag",
  },
  owner_decision: {
    label: "A decision came back to the owner unnecessarily",
    pattern: "owner_bottleneck",
  },
  key_employee: {
    label: "A key employee knew something the system did not",
    pattern: "tribal_knowledge_risk",
  },
  repeat_admin: {
    label: "A task got repeated manually again",
    pattern: "repeat_admin_drag",
  },
} as const

export const PEOPLE_TOUCHES = {
  owner: "Owner / founder",
  manager: "Manager",
  front_desk: "Front desk / intake",
  ops: "Operations",
  field_team: "Field team",
  finance: "Finance / admin",
  customer: "Customer",
  vendor: "Vendor / partner",
} as const

export const TRUTH_LOCATIONS = {
  owner_head: "Owner's head",
  employee_head: "One key employee",
  inbox: "Email inbox",
  phone_text: "Phone / texts / voicemail",
  spreadsheet: "Spreadsheet",
  crm: "CRM or job system",
  accounting: "Accounting system",
  docs: "Docs / SOPs",
  whiteboard: "Whiteboard / paper",
  scattered: "Scattered across several places",
} as const

export const FRICTIONS = {
  no_owner: "No clear owner",
  missing_context: "Missing context",
  duplicate_entry: "Duplicate entry",
  waiting_on_person: "Waiting on one person",
  status_unknown: "Status was unclear",
  manual_copying: "Manual copying between tools",
  nobody_trusts_data: "Nobody trusted the data",
  customer_waiting: "Customer was waiting",
  followup_dropped: "Follow-up dropped",
} as const

export const CONSEQUENCES = {
  lost_sale: "Lost sale / lost opportunity",
  slow_response: "Slow response",
  owner_interruption: "Owner interruption",
  customer_frustration: "Customer frustration",
  duplicate_work: "Duplicate work",
  bad_data: "Bad data",
  missed_followup: "Missed follow-up",
  team_confusion: "Team confusion",
  margin_leak: "Margin leak",
} as const

export const PAIN_STATEMENTS = {
  cant_leave: "I can't leave without things backing up",
  last_month: "I find out what happened after it already mattered",
  systems_dont_talk: "My systems do not talk to each other",
  losing_key_person: "I am nervous about losing one key person",
  lead_leakage: "Good leads or customers go cold because follow-up is inconsistent",
  repeat_admin: "My team repeats too much admin work",
} as const

export const FREQUENCIES = {
  daily: "Daily",
  weekly: "Weekly",
  monthly: "Monthly",
  occasional: "Occasionally",
} as const

export const COST_BANDS = {
  unknown: "Unknown",
  under_1k: "Under $1K/month",
  one_to_five: "$1K-$5K/month",
  five_to_twenty: "$5K-$20K/month",
  twenty_plus: "$20K+/month",
} as const

export const SESSION_OPENNESS = {
  yes: "Yes",
  maybe: "Maybe",
  no: "Not right now",
} as const

export const TEAM_SIZES = {
  under_10: "Under 10",
  ten_to_twenty: "10-20",
  twenty_to_fifty: "20-50",
  fifty_to_one_hundred: "50-100",
  hundred_plus: "100+",
} as const

export type LeverageMapInput = {
  company: string
  name: string
  email: string
  phone?: string
  role?: string
  businessKind: string
  teamSize: keyof typeof TEAM_SIZES | ""
  brokenMoment: keyof typeof BROKEN_MOMENTS | ""
  momentStory: string
  peopleTouches: string[]
  truthLocations: string[]
  frictions: string[]
  consequences: string[]
  painStatement: keyof typeof PAIN_STATEMENTS | ""
  frequency: keyof typeof FREQUENCIES | ""
  costBand: keyof typeof COST_BANDS | ""
  perfectEmployee: string
  openToSession: keyof typeof SESSION_OPENNESS | ""
}

export type LeverageMapScore = {
  signalDepth: number
  signalReadiness: number
  imaginationGap: number
  composite: number
  resultBand: "Leverage Map Ready" | "Hidden Leverage Present" | "Clarify First" | "Not Yet"
  primaryPattern: LeveragePattern
  secondaryPattern: LeveragePattern | null
  surfacedPains: Array<"cant_leave" | "last_month" | "systems_dont_talk" | "losing_key_person">
  recommendedNextAction: string
}

export type LeverageMapAiResult = {
  pattern_label: string
  result_title: string
  operator_readout: string
  what_you_are_already_doing_right: string
  where_it_costs_you: string
  what_an_intervention_looks_like: string
  first_fix: string
  why_this_is_fixable: string
  ninety_day_picture: string
  internal: {
    session_questions: string[]
    follow_up_opener: string
    crm_summary: string
    confidence: "low" | "medium" | "high"
    lead_score: number
    likely_buyer_mindset: string
    recommended_offer: string
    sales_angle: string
    urgency_reason: string
    follow_up_subject: string
    follow_up_sms: string
    disqualification_flags: string[]
  }
}

export function scoreLeverageMap(input: LeverageMapInput): LeverageMapScore {
  const patternScores = new Map<LeveragePattern, number>()
  const addPattern = (pattern: LeveragePattern, points = 1) => {
    patternScores.set(pattern, (patternScores.get(pattern) ?? 0) + points)
  }

  if (input.brokenMoment) {
    addPattern(BROKEN_MOMENTS[input.brokenMoment].pattern as LeveragePattern, 3)
  }

  for (const friction of input.frictions) {
    if (friction === "waiting_on_person") addPattern("owner_bottleneck", 2)
    if (friction === "missing_context" || friction === "status_unknown") addPattern("handoff_fog", 2)
    if (friction === "manual_copying" || friction === "duplicate_entry") addPattern("tool_fragmentation", 2)
    if (friction === "nobody_trusts_data") addPattern("reporting_lag", 2)
    if (friction === "customer_waiting") addPattern("customer_status_gap", 2)
    if (friction === "followup_dropped") addPattern("lead_leakage", 2)
  }

  for (const consequence of input.consequences) {
    if (consequence === "lost_sale" || consequence === "missed_followup") addPattern("lead_leakage", 2)
    if (consequence === "owner_interruption") addPattern("owner_bottleneck", 2)
    if (consequence === "bad_data") addPattern("reporting_lag", 2)
    if (consequence === "team_confusion") addPattern("handoff_fog", 1)
    if (consequence === "duplicate_work") addPattern("repeat_admin_drag", 2)
    if (consequence === "customer_frustration" || consequence === "slow_response") addPattern("customer_status_gap", 1)
  }

  if (input.truthLocations.includes("owner_head") || input.truthLocations.includes("employee_head")) {
    addPattern("tribal_knowledge_risk", 2)
  }
  if (input.truthLocations.includes("scattered")) addPattern("tool_fragmentation", 2)

  if (input.painStatement === "cant_leave") addPattern("owner_bottleneck", 2)
  if (input.painStatement === "last_month") addPattern("reporting_lag", 2)
  if (input.painStatement === "systems_dont_talk") addPattern("tool_fragmentation", 2)
  if (input.painStatement === "losing_key_person") addPattern("tribal_knowledge_risk", 2)
  if (input.painStatement === "lead_leakage") addPattern("lead_leakage", 2)
  if (input.painStatement === "repeat_admin") addPattern("repeat_admin_drag", 2)

  const sortedPatterns = [...patternScores.entries()].sort((a, b) => b[1] - a[1])
  const primaryPattern = sortedPatterns[0]?.[0] ?? "handoff_fog"
  const secondaryPattern = sortedPatterns[1]?.[0] ?? null

  const meaningfulStory = input.momentStory.trim().length >= 80
  const meaningfulEmployee = input.perfectEmployee.trim().length >= 60
  const seriousConsequence = input.consequences.some((c) =>
    ["lost_sale", "margin_leak", "customer_frustration", "owner_interruption"].includes(c)
  )
  const frequent = input.frequency === "daily" || input.frequency === "weekly"
  const costly = input.costBand === "one_to_five" || input.costBand === "five_to_twenty" || input.costBand === "twenty_plus"
  const machineReadable = input.truthLocations.some((loc) =>
    ["crm", "accounting", "spreadsheet", "docs"].includes(loc)
  )
  const mostlyTribal =
    input.truthLocations.includes("owner_head") ||
    input.truthLocations.includes("employee_head") ||
    input.truthLocations.includes("phone_text")
  const enoughActors = input.peopleTouches.length >= 3

  const signalDepth = clampScore(
    1 +
      Number(enoughActors) +
      Number(meaningfulEmployee || seriousConsequence || costly),
  )

  const signalReadiness = clampScore(
    1 +
      Number(machineReadable) +
      Number(machineReadable && !mostlyTribal && !input.truthLocations.includes("scattered")),
  )

  const imaginationGap = clampScore(
    1 +
      Number(meaningfulStory || Boolean(input.brokenMoment)) +
      Number((frequent || costly) && input.openToSession !== "no"),
  )

  const composite = signalDepth + signalReadiness + imaginationGap

  const resultBand =
    composite >= 8
      ? "Leverage Map Ready"
      : composite >= 6
        ? "Hidden Leverage Present"
        : composite >= 4
          ? "Clarify First"
          : "Not Yet"

  const surfacedPains = new Set<LeverageMapScore["surfacedPains"][number]>()
  if (input.painStatement === "cant_leave" || primaryPattern === "owner_bottleneck") surfacedPains.add("cant_leave")
  if (input.painStatement === "last_month" || primaryPattern === "reporting_lag") surfacedPains.add("last_month")
  if (input.painStatement === "systems_dont_talk" || primaryPattern === "tool_fragmentation") surfacedPains.add("systems_dont_talk")
  if (input.painStatement === "losing_key_person" || primaryPattern === "tribal_knowledge_risk") surfacedPains.add("losing_key_person")

  const recommendedNextAction =
    composite >= 8
      ? "Justin follow up directly to book an on-site AI Leverage Session."
      : composite >= 6
        ? "Call to clarify the workflow and book the AI Leverage Session if urgency is real."
        : composite >= 4
          ? "Qualify with one short call before spending Justin build time."
          : "Send a useful note and do not push yet."

  return {
    signalDepth,
    signalReadiness,
    imaginationGap,
    composite,
    resultBand,
    primaryPattern,
    secondaryPattern,
    surfacedPains: [...surfacedPains],
    recommendedNextAction,
  }
}

export function fallbackAiResult(input: LeverageMapInput, score: LeverageMapScore): LeverageMapAiResult {
  const pattern = LEVERAGE_PATTERNS[score.primaryPattern]
  const second = score.secondaryPattern ? LEVERAGE_PATTERNS[score.secondaryPattern].label : null
  const company = input.company || "the business"
  const moment = input.brokenMoment ? BROKEN_MOMENTS[input.brokenMoment].label.toLowerCase() : "a messy workflow"
  const consequence = input.consequences[0] ? CONSEQUENCES[input.consequences[0] as keyof typeof CONSEQUENCES] : "lost time"

  return {
    pattern_label: second ? `${pattern.label} + ${second}` : pattern.label,
    result_title: score.resultBand,
    operator_readout: `${company} appears to have a ${pattern.label.toLowerCase()} pattern: ${pattern.publicLine} The useful next move is to inspect the real path around ${moment}, especially how context, ownership, and status move before anyone reaches for another tool.`,
    what_you_are_already_doing_right: "You already have a real operating moment to inspect. That is better than starting with a vague AI idea because the leverage can be tied to work people already recognize.",
    where_it_costs_you: `The visible symptom is ${consequence.toLowerCase()}, but the cost is probably hiding in the moments when context has to be rebuilt, ownership is unclear, or the next step waits on a person instead of a system.`,
    what_an_intervention_looks_like: "A useful first intervention would capture the request, the current owner, the needed context, and the next customer or team update in one reusable workflow, with a human review step before anything sensitive goes out.",
    first_fix: "Map the first request, handoff, decision point, and customer/team update around the selected messy moment.",
    why_this_is_fixable: "This is fixable because the issue has a shape: a trigger, a handoff, a source of truth, and a recurring next step. Those are the pieces a lightweight AI-assisted workflow can make visible before it becomes a bigger problem.",
    ninety_day_picture: "In 90 days, the goal is not a flashy AI rollout. The goal is one proven workflow where the team can see status faster, reuse the right context, and spend less time asking who has the answer.",
    internal: {
      session_questions: [
        "Where does this workflow start, and who owns the next action when it arrives?",
        "Where does the truth live when the team needs status, context, or history?",
        "What would a strong employee know instantly that the current system makes hard to see?",
      ],
      follow_up_opener: `You mentioned ${moment}. I would start by mapping where the context lives, who owns the handoff, and what keeps coming back to you or the team.`,
      crm_summary: `${score.resultBand}: ${pattern.label}. Composite ${score.composite}/9. ${input.momentStory || pattern.publicLine}`,
      confidence: score.composite >= 8 ? "high" : score.composite >= 6 ? "medium" : "low",
      lead_score: score.composite,
      likely_buyer_mindset: score.composite >= 6 ? "Feels the pain and may buy if the first fix is concrete." : "Curious, but needs clearer pain before pushing.",
      recommended_offer: score.composite >= 6 ? "AI Leverage Session" : "Clarifying workflow call",
      sales_angle: "Anchor the conversation around one repeated workflow, not a broad AI transformation pitch.",
      urgency_reason: score.composite >= 6 ? "Frequent or costly friction is already visible." : "Signal is present but the business impact needs confirmation.",
      follow_up_subject: `${company} leverage map`,
      follow_up_sms: `This is Justin with Praxis. Your map points to ${pattern.label.toLowerCase()} around ${moment}. Worth a quick look at the first fix?`,
      disqualification_flags: input.openToSession === "no" ? ["Not open to a session right now"] : [],
    },
  }
}

function clampScore(n: number) {
  return Math.max(1, Math.min(3, n))
}

// The prospect-facing slice of the readout. The `internal` block (session
// questions, sales angle, lead score) must NEVER reach the browser or the
// shareable map page, so the public payload is built by stripping it.
export type PublicLeverageResult = Omit<LeverageMapAiResult, "internal">

export function toPublicResult(result: LeverageMapAiResult): PublicLeverageResult {
  // Enumerate the public fields explicitly so the internal block can never leak,
  // even if new internal keys are added later.
  return {
    pattern_label: result.pattern_label,
    result_title: result.result_title,
    operator_readout: result.operator_readout,
    what_you_are_already_doing_right: result.what_you_are_already_doing_right,
    where_it_costs_you: result.where_it_costs_you,
    what_an_intervention_looks_like: result.what_an_intervention_looks_like,
    first_fix: result.first_fix,
    why_this_is_fixable: result.why_this_is_fixable,
    ninety_day_picture: result.ninety_day_picture,
  }
}

// The relocated "problem you've given up on" framing. It misfires as a cold
// opener, but lands as an earned line in the OUTPUT: it names the resignation
// the owner has swallowed and immediately reframes it as tractable.
export function reframeLine(score: LeverageMapScore): string {
  if (score.composite >= 6) {
    return "This is the kind of operating friction most owners quietly learn to live with. It does not have to stay that way."
  }
  if (score.composite >= 4) {
    return "A mess like this is easy to live with and easy to underestimate. It is also more fixable than it tends to feel."
  }
  return "Even a small recurring mess like this is worth naming before it hardens into just how we do it."
}

export function firstNameOf(name: string): string {
  return name.trim().split(/\s+/)[0] || "there"
}

// Shape stored in praxis_leads.leverage_map and rendered by /check/map/[token].
export type StoredLeverageMap = {
  company: string
  firstName: string
  score: LeverageMapScore
  result: PublicLeverageResult
  createdAt: string
}
