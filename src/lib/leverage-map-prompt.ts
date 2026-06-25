// The Leverage Map model prompt, extracted from the route so it is (a) testable
// without the Next/Supabase/Resend transport and (b) shared verbatim by the live
// route and any preview harness — no drift between what we review and what ships.
//
// The PATTERN_PLAYBOOK here is the spine of the readout's quality. Two rewrites
// vs the original live it: first_fix_archetype now REMOVES a manual/memory step
// (the work updates itself) instead of relocating it to a new manual log/check;
// session_owns now names the concrete SYSTEM the paid session builds (the held-
// back value), not the generic "decide what to automate vs assign" boilerplate.

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
  type LeverageMapInput,
  type LeverageMapScore,
  type LeveragePattern,
} from "./leverage-map"

export type ChatMessage = { role: "system" | "user"; content: string }

export const PATTERN_PLAYBOOK: Record<LeveragePattern, { spine: string; first_fix_archetype: string; session_owns: string }> = {
  owner_bottleneck: {
    spine: "decisions routing back to one person",
    first_fix_archetype:
      "take ONE narrow, bounded decision type off the owner's plate by writing the rule the owner uses in their head into a guardrail the team follows on their own, and have the rare edge case flag itself to the owner — so that one decision stops reaching the owner at all, not 'the owner approves it faster'",
    session_owns:
      "the delegation guardrail system that lets the team decide without the owner — the written decision rules, the automatic exception-flagging that pulls the owner in ONLY on true edge cases, and the at-a-glance view of what got decided without them",
  },
  lead_leakage: {
    spine: "demand arriving faster than the response can catch it",
    first_fix_archetype:
      "make ONE lead source auto-acknowledge the instant a lead lands — an automatic first touch that fires without anyone remembering, day, night, or weekend — so that source can no longer silently drop; within a week the owner can see whether any lead in it went unanswered",
    session_owns:
      "the intake-to-quote system that catches every lead automatically: instant first-response on every channel and hour, automatic routing to an owner, and a live view of which leads are still open that nobody has to update by hand",
  },
  handoff_fog: {
    spine: "work crossing people without one shared source of truth",
    first_fix_archetype:
      "for ONE recurring handoff, make the status change a BYPRODUCT of the action the receiving person already takes (marking the job as theirs), so current status simply exists without anyone maintaining it — not 'someone updates a status field every time'",
    session_owns:
      "the shared handoff record that updates itself as work moves — status that changes as a byproduct of each person's existing step, an automatic alert when a handoff stalls, and the end of status-chasing calls",
  },
  tribal_knowledge_risk: {
    spine: "operating knowledge living in one person's head",
    first_fix_archetype:
      "capture the one person's recurring gotchas for a single job type once, and surface them automatically to whoever picks up that job next — so the next person sees the judgment without asking, starting with the job type that stalls most when they're out",
    session_owns:
      "the system that captures the key person's judgment at the moment of work and surfaces it to the next person automatically, so the business stops depending on one person being reachable",
  },
  reporting_lag: {
    spine: "learning what happened after the decision window had closed",
    first_fix_archetype:
      "produce ONE trusted number automatically from its source on a fixed cadence, reconciled before it lands, so one recurring decision stops running on stale or hand-assembled data — not 'someone publishes the number manually each morning'",
    session_owns:
      "the reporting system that produces the trusted numbers automatically — pulled from source, reconciled before publish, and delivered inside the decision window without anyone assembling them by hand",
  },
  customer_status_gap: {
    spine: "customers needing status before the team has an easy way to answer",
    first_fix_archetype:
      "for ONE common request type, make 'where is my X' answerable automatically from the work already happening, so the team (or the customer) can see it without anyone walking over to check or assembling an answer",
    session_owns:
      "the proactive-status system that answers 'where is my X' before the customer asks — status drawn automatically from the work and surfaced to customer and team, cutting the inbound 'any update?' volume",
  },
  tool_fragmentation: {
    spine: "the truth scattered across disconnected places",
    first_fix_archetype:
      "pick the SINGLE authoritative place for one record type and stop the duplicate entry into it — entered once at the source and read everywhere, so the same fact stops being keyed into several places by hand",
    session_owns:
      "the single-source-of-truth system — one place each record lives, fed automatically so duplicate entry ends for good and every tool reads from the same truth",
  },
  repeat_admin_drag: {
    spine: "the same work redone because the context isn't reusable",
    first_fix_archetype:
      "capture the data ONCE at the point it first appears and feed it forward automatically, eliminating one downstream re-entry entirely — not moving the typing to a new step",
    session_owns:
      "the capture-once system that feeds data forward automatically — entered one time at the source, reused everywhere downstream, so the compounding re-entry disappears",
  },
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

export function buildLeverageMessages(input: LeverageMapInput, score: LeverageMapScore): ChatMessage[] {
  return [
    {
      role: "system",
      content:
        "You are the Praxis Leverage Map interpreter. Praxis sells practical operational AI work to owner-led businesses. Return only valid JSON. Do not say 'diagnostic', 'maturity', 'competency', or 'quiz'. Do not promise ROI. Write like a sharp operator mapping one real workflow, specific to the submitted operating mess. The user-facing result is a useful mini-consulting artifact, not a score report. " +
        "SEVEN hard rules decide whether this is good: " +
        "(1) BINDING CONSTRAINT — name the specific mechanism that actually caused the loss, not just the visible symptom. If a job died over a weekend, the constraint is response latency / after-hours coverage, not merely 'no central log'. Address that mechanism. " +
        "(2) THE PROSPECT SEES ONLY DIAGNOSIS + ONE PROOF — the free readout shows the mirror, where_it_costs_you, and ONE first_fix. what_an_intervention_looks_like and ninety_day_picture are INTERNAL (Justin's brief), NOT shown to the prospect. Do NOT make the readout feel complete or hand over the full plan; what the owner can act on alone is the diagnosis plus one small proof — the build is the session. " +
        "(3) MAKE THE SESSION THE VALUE — what_the_session_unlocks is the one place the prospect learns what they CANNOT get from the free readout. Name the specific system / build / automation the session produces for THEIR exact workflow and where it gets them — concrete enough to be credible, NOT enough to DIY, and visibly bigger than the first_fix. Banned boilerplate (identical for everyone, gives no reason to book): 'map the full path', 'decide what to automate vs assign', 'handle the edge cases', 'the threshold for X'. " +
        "(4) NO STOCK TEMPLATE — vary the SHAPE of the readout to THIS mess; do not reuse a fixed skeleton across submissions. Banned phrases: 'this week, pick one', 'shared Google Doc', 'shared Google Form', 'routes around the failing', 'binding constraint is not just'. " +
        "(5) NO PRODUCT NAMES — never name a specific software product (Google Forms, Typeform, Notion, Airtable, a named CRM brand). Describe the mechanism, not the tool; the leverage is in the workflow, not a SaaS pick. " +
        "(6) USE THEIR NUMBERS — anchor the second-order cost in where_it_costs_you to the cost band and frequency they reported, expressed in those terms. If cost is unknown, pose it as the number to pin down — never invent a precise figure. This is cost-of-the-status-quo, NOT an ROI promise. " +
        "(7) REMOVE, DON'T RELOCATE — first_fix must make ONE instance of the failing behavior IMPOSSIBLE by removing a manual or memory step: the status updates itself as a byproduct of work already happening, the lead routes itself, the number is produced automatically. It is falsifiable within a week. If you diagnosed the cause as people relying on memory or manual updates, you may NOT prescribe 'a person manually logs / copies / updates / checks X every time' — that re-creates the exact failure you named. Leave the higher-judgment decisions (thresholds, what to automate vs. assign) for the session. " +
        "Build first_fix off pattern_playbook.first_fix_archetype and what_the_session_unlocks off pattern_playbook.session_owns so the structure fits this pattern, not a generic template. Also surface one second-order cost they probably have not priced (wasted marketing spend, warranty/contract bleed, owner time).",
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
            where_it_costs_you: "specific operational spot where leverage is hiding and how the cost shows up; include one second-order cost they have not priced, ANCHORED to their reported cost band + frequency (express the bleed in those terms); if cost is unknown, name the exact number to pin down rather than inventing one",
            what_an_intervention_looks_like: "INTERNAL ONLY — included in Justin's sales brief, NEVER shown to the prospect, but you MUST still write it, fully tailored to their workflow. The shape of the real intervention that addresses the binding constraint; built off pattern_playbook.spine; plain-English, specific to their workflow; describe the mechanism, never a software product",
            first_fix: "the single smallest falsifiable PROOF step, built off pattern_playbook.first_fix_archetype; REMOVES one instance of the failing behavior by killing a manual/memory step (the work updates itself, the lead routes itself) — it does NOT relocate the work to a new manual log/copy/update/check; the owner can tell within a week whether it worked",
            why_this_is_fixable: "explain why this is a tractable workflow issue, not a personal/team failure",
            ninety_day_picture: "INTERNAL ONLY — included in Justin's sales brief, NEVER shown to the prospect, but you MUST still write it, tailored to their workflow. What good looks like after acting for 90 days, without ROI promises",
            what_the_session_unlocks: "the prospect-facing HOOK and the one thing the free readout withholds: the specific system / build / automation the session produces for THEIR exact workflow, and where it gets them. Concrete enough to be credible, NOT enough to DIY, visibly bigger than first_fix. Never generic 'map the full path / decide what to automate vs assign' boilerplate",
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
            "Vary the readout's shape to this mess; never reuse a fixed skeleton or any banned phrase.",
            "No product names; describe the mechanism, not the tool.",
            "Anchor the second-order cost to their reported cost band + frequency; if unknown, name the number to pin down — never invent a figure.",
            "Build first_fix off pattern_playbook.first_fix_archetype: it REMOVES one instance of the failing behavior (the work updates itself) and is falsifiable within a week; it must not relocate the work to a new manual step.",
            "Build what_the_session_unlocks off pattern_playbook.session_owns: name the concrete system the session builds, specific to their workflow and visibly bigger than the first fix; never the banned boilerplate.",
            "Frame the business as capable; do not shame the owner or team for having lived with the friction.",
            "If the answer is thin, keep confidence low and make the next step clarifying.",
          ],
        },
        score,
        pattern: LEVERAGE_PATTERNS[score.primaryPattern],
        secondaryPattern: score.secondaryPattern ? LEVERAGE_PATTERNS[score.secondaryPattern] : null,
        pattern_playbook: PATTERN_PLAYBOOK[score.primaryPattern],
        economics: {
          cost_band: input.costBand ? COST_BANDS[input.costBand] : "unknown",
          frequency: input.frequency ? FREQUENCIES[input.frequency] : "unknown",
          team_size: input.teamSize ? TEAM_SIZES[input.teamSize] : "unknown",
        },
        labels: labelInput(input),
      }),
    },
  ]
}
