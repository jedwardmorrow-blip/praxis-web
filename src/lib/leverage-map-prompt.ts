// The Leverage Map model prompt, extracted from the route so it is (a) testable
// without the Next/Supabase/Resend transport and (b) shared verbatim by the live
// route and any preview harness — no drift between what we review and what ships.
//
// The PATTERN_PLAYBOOK here is the spine of the readout's quality. The free first
// step is a ONE-WEEK PROBE: a time-boxed measurement that confirms the binding
// constraint and SIZES it (ends in a number the owner reads at week's end). It is
// deliberately NOT the fix — not an off-the-shelf tool they could buy and run
// alone (which lets them self-serve and never book), and not a description of the
// paid build (which gives the system away). session_owns names the concrete
// SYSTEM the paid session builds, re-keyed to the prospect's own specifics.

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
      "for ONE week, each time a decision bounces back to the owner, jot the 30-second reason it needed them; at week's end count how many were genuine judgment calls vs. ones that only reached the owner because the rule lives in their head — that ratio is the size of the bottleneck. A measurement to confirm and size the leak, NOT a fix.",
    session_owns:
      "the delegation guardrail system that lets the team decide without the owner — the written decision rules, the automatic exception-flagging that pulls the owner in ONLY on true edge cases, and the at-a-glance view of what got decided without them",
  },
  lead_leakage: {
    spine: "demand arriving faster than the response can catch it",
    first_fix_archetype:
      "for ONE week, log the arrival time and the first-human-reply time for every lead in ONE source; at week's end count how many waited past the owner's target window or came in after hours and went cold — that count is the leak in real leads. A one-week measurement, NOT a fix and NOT a tool to install.",
    session_owns:
      "the intake-to-quote system that catches every lead automatically: instant first-response on every channel and hour, automatic routing to an owner, and a live view of which leads are still open that nobody has to update by hand",
  },
  handoff_fog: {
    spine: "work crossing people without one shared source of truth",
    first_fix_archetype:
      "for ONE week, on ONE recurring handoff, have each person note the moment they actually had the current detail; at week's end count how many times the right info reached the next person late or never — that's how often the fog is costing them. A measurement to size it, NOT the fix.",
    session_owns:
      "the shared handoff record that updates itself as work moves — status that changes as a byproduct of each person's existing step, an automatic alert when a handoff stalls, and the end of status-chasing calls",
  },
  tribal_knowledge_risk: {
    spine: "operating knowledge living in one person's head",
    first_fix_archetype:
      "for ONE week, every time someone interrupts the key person to ask 'how do we handle this,' jot the question; at week's end the list IS the judgment that lives only in their head, and the count is how often the business stalls without them. A probe to confirm the risk, NOT a fix.",
    session_owns:
      "the system that captures the key person's judgment at the moment of work and surfaces it to the next person automatically, so the business stops depending on one person being reachable",
  },
  reporting_lag: {
    spine: "learning what happened after the decision window had closed",
    first_fix_archetype:
      "for ONE week, each time a decision is made off the report, note whether the number was fully trusted and whether it later proved wrong; at week's end count how many calls ran on numbers that couldn't be verified in time — the size of the reporting blind spot. A measurement, NOT the fix.",
    session_owns:
      "the reporting system that produces the trusted numbers automatically — pulled from source, reconciled before publish, and delivered inside the decision window without anyone assembling them by hand",
  },
  customer_status_gap: {
    spine: "customers needing status before the team has an easy way to answer",
    first_fix_archetype:
      "for ONE week, tally every 'where is my X' request and how long it took to give a real answer; at week's end you have the daily volume and the average hunt time — the hidden tax the status gap is charging the team. A measurement to confirm it, NOT a fix.",
    session_owns:
      "the proactive-status system that answers 'where is my X' before the customer asks — status drawn automatically from the work and surfaced to customer and team, cutting the inbound 'any update?' volume",
  },
  tool_fragmentation: {
    spine: "the truth scattered across disconnected places",
    first_fix_archetype:
      "for ONE week, make a tick every time someone keys the same fact into a second place; at week's end the tally is how many times a day the team re-enters the same truth — the size of the duplicate-entry drag. A measurement, NOT the consolidation itself.",
    session_owns:
      "the single-source-of-truth system — one place each record lives, fed automatically so duplicate entry ends for good and every tool reads from the same truth",
  },
  repeat_admin_drag: {
    spine: "the same work redone because the context isn't reusable",
    first_fix_archetype:
      "for ONE week, make a tick every time someone re-enters data that already existed upstream; at week's end the count is how much of the same work is being redone — the compounding admin cost in plain numbers. A probe to size it, NOT the fix.",
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
        "(2) THE PROSPECT SEES ONLY DIAGNOSIS + ONE PROBE — the free readout shows the mirror, where_it_costs_you, and ONE first_fix probe. what_an_intervention_looks_like and ninety_day_picture are INTERNAL (Justin's brief), NOT shown to the prospect. Do NOT make the readout feel complete or hand over the full plan; what the owner gets alone is the diagnosis plus one week-long measurement that proves it — the build is the session. " +
        "(3) MAKE THE SESSION THE VALUE — what_the_session_unlocks is the one place the prospect learns what they CANNOT get from the free readout. Name the specific system / build / automation the session produces for THEIR exact workflow and where it gets them — concrete enough to be credible, NOT enough to DIY, and visibly bigger than the first_fix probe. Two same-pattern businesses must get visibly DIFFERENT hooks: anchor it to their reported channels, job types, and the words from their story, not to the pattern. Banned boilerplate (identical for everyone, gives no reason to book): 'map the full path', 'decide what to automate vs assign', 'handle the edge cases', 'the threshold for X'. " +
        "(4) NO STOCK TEMPLATE — vary the SHAPE of the readout to THIS mess; do not reuse a fixed skeleton across submissions. Banned phrases: 'this week, pick one', 'shared Google Doc', 'shared Google Form', 'routes around the failing', 'binding constraint is not just'. " +
        "(5) NO PRODUCT NAMES — never name a specific software product (Google Forms, Typeform, Notion, Airtable, a named CRM brand). Describe the mechanism, not the tool; the leverage is in the workflow, not a SaaS pick. " +
        "(6) USE THEIR NUMBERS — anchor the second-order cost in where_it_costs_you to the cost band and frequency they reported, expressed in those terms. If cost is unknown, pose it as the number to pin down — never invent a precise figure. This is cost-of-the-status-quo, NOT an ROI promise. " +
        "(7) THE FIRST FIX IS A ONE-WEEK PROBE, NOT THE FIX — first_fix is a small, time-boxed experiment the owner runs for ONE week to CONFIRM the binding constraint is real and SIZE what it costs; it ENDS in a concrete number, count, or pass/fail they read themselves at week's end. It is explicitly NOT the solution: never an off-the-shelf tool or automation they could just buy and run (that lets them solve it without you), and never a description of the paid build (that gives the system away). It is a measurement that makes the pain undeniable, not ongoing manual busywork. The system that actually removes the problem is the session (what_the_session_unlocks). " +
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
            first_fix: "a ONE-WEEK falsifiable PROBE (not the fix, not the build): a small time-boxed measurement, built off pattern_playbook.first_fix_archetype, that confirms the binding constraint and ENDS in a concrete end-of-week number / count / pass-fail the owner reads themselves. Never something they could buy off the shelf to solve it; never a description of the paid system",
            why_this_is_fixable: "explain why this is a tractable workflow issue, not a personal/team failure",
            ninety_day_picture: "INTERNAL ONLY — included in Justin's sales brief, NEVER shown to the prospect, but you MUST still write it, tailored to their workflow. What good looks like after acting for 90 days, without ROI promises",
            what_the_session_unlocks: "the prospect-facing HOOK and the one thing the free readout withholds: the specific system / build / automation the session produces for THEIR exact workflow, and where it gets them. Concrete enough to be credible, NOT enough to DIY, visibly bigger than the first_fix probe. Re-keyed to THIS prospect's channels/job-types/words so a same-pattern peer would get a different hook. Never generic 'map the full path / decide what to automate vs assign' boilerplate",
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
            "Build first_fix off pattern_playbook.first_fix_archetype: it is a ONE-WEEK PROBE that confirms the diagnosis and ENDS in a concrete end-of-week number; it is never a buyable off-the-shelf fix and never the paid build.",
            "Build what_the_session_unlocks off pattern_playbook.session_owns as the SPINE, but rewrite it in the PROSPECT'S own terms (their specific channels, job types, and words from their story) so two businesses with the SAME pattern get visibly different hooks; never a pattern-generic system description or the banned boilerplate.",
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
