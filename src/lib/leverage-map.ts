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
  why_it_matters: string
  first_workflow_to_inspect: string
  session_questions: string[]
  follow_up_opener: string
  crm_summary: string
  confidence: "low" | "medium" | "high"
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
      Number(meaningfulStory || input.brokenMoment) +
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
    operator_readout: `${company} appears to have a ${pattern.label.toLowerCase()} pattern: ${pattern.publicLine} The useful next move is to inspect the real path around ${moment}, not shop for a generic AI tool.`,
    why_it_matters: `This matters because the visible symptom is ${consequence.toLowerCase()}, but the leverage is probably in how context, ownership, and follow-up move through the business.`,
    first_workflow_to_inspect: "Map the first request, handoff, decision point, and customer/team update around the selected messy moment.",
    session_questions: [
      "Where does this workflow start, and who owns the next action when it arrives?",
      "Where does the truth live when the team needs status, context, or history?",
      "What would a strong employee know instantly that the current system makes hard to see?",
    ],
    follow_up_opener: `You mentioned ${moment}. I would start by mapping where the context lives, who owns the handoff, and what keeps coming back to you or the team.`,
    crm_summary: `${score.resultBand}: ${pattern.label}. Composite ${score.composite}/9. ${input.momentStory || pattern.publicLine}`,
    confidence: score.composite >= 8 ? "high" : score.composite >= 6 ? "medium" : "low",
  }
}

function clampScore(n: number) {
  return Math.max(1, Math.min(3, n))
}
