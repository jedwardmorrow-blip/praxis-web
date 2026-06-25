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
      "a 3-DAY GO-DARK TEST (not a logbook): pick ONE category of routine question that normally routes to the owner and have the owner decline to decide it for three days — defer, don't answer. At the end you have two piles: what the team resolved on their own (safe to delegate) and what genuinely stalled (the judgment that only lives in the owner's head). The size of the stalled pile is the bottleneck. It confirms and sizes the constraint; it is not the fix.",
    session_owns:
      "the delegation guardrail system that lets the team decide without the owner — the written decision rules, the automatic exception-flagging that pulls the owner in ONLY on true edge cases, and the at-a-glance view of what got decided without them",
  },
  lead_leakage: {
    spine: "demand arriving faster than the response can catch it",
    first_fix_archetype:
      "a PLANTED-LEAD TEST (one afternoon of setup, not a week of logging): over a couple of days send a handful of test inquiries to yourself at the worst moments — after hours, the weekend, mid-rush — across EACH channel you actually take leads on (call, web form, text, DM), and clock how long each waits for a real human reply. The slowest channel and the longest wait is where live leads are quietly dying. A measurement that sizes the leak — never the auto-responder itself.",
    session_owns:
      "the system that shows you every lead the moment it lands AND what happens to it next — which channel it came from, how fast it actually reached a human, which ones went cold, and what that cost in booked revenue. An auto-reply (the part you could buy in an afternoon) only fakes a fast response; the leverage is the cross-channel truth that turns 'we respond fast' from a hope into a number you can watch, and routes each lead to the right person before it cools on the hours you're away from the desk",
  },
  handoff_fog: {
    spine: "work crossing people without one shared source of truth",
    first_fix_archetype:
      "a SINGLE-JOB TRACE (one job, not every handoff for a week): follow ONE live job from intake to done and mark every point where the next person had to stop and ask for something that should have travelled with the work. The count of re-asks on that one job is the fog; multiply by your weekly job volume for the tax. A trace to size it, NOT the shared system that ends it.",
    session_owns:
      "the shared handoff record that updates itself as work moves — status that changes as a byproduct of each person's existing step, an automatic alert when a handoff stalls, and the end of status-chasing calls",
  },
  tribal_knowledge_risk: {
    spine: "operating knowledge living in one person's head",
    first_fix_archetype:
      "a PLANNED-UNREACHABLE TEST (not a question diary): have the key person block off a half-day where they are genuinely unreachable, and have everyone park the questions they would have asked on a single list. That list IS the operating manual that doesn't exist yet; its length is how often the business stalls on one person. A test that surfaces the risk, NOT the capture system that removes it.",
    session_owns:
      "the system that captures the key person's judgment at the moment of work and surfaces it to the next person automatically, so the business stops depending on one person being reachable",
  },
  reporting_lag: {
    spine: "learning what happened after the decision window had closed",
    first_fix_archetype:
      "a LOOK-BACK AUDIT (one hour from records you already have, not a week of fresh logging): pull the last 5 decisions made off a report and ask, with hindsight, whether the number was fully trusted at the time and whether a real-time number would have changed the call. The count that ran on stale or unverifiable data is the size of the reporting blind spot. An audit to size it, NOT the reporting system itself.",
    session_owns:
      "the reporting system that produces the trusted numbers automatically — pulled from source, reconciled before publish, and delivered inside the decision window without anyone assembling them by hand",
  },
  customer_status_gap: {
    spine: "customers needing status before the team has an easy way to answer",
    first_fix_archetype:
      "a ONE-DAY TALLY (a single busy day, not a full week): for ONE representative day, tally every 'where is my X?' that comes in and roughly how long it took to give a real answer. One day sizes the daily tax; multiply by your open days for the yearly drag. A one-day measurement to confirm it, NOT the status system that ends the asking.",
    session_owns:
      "the system that answers 'where is my X?' before the customer asks — status pulled automatically from the live work and surfaced to both sides — plus the number that proves it landed: how far the inbound 'any update?' volume drops. A canned auto-reply (buyable in an afternoon) just deflects the question; the leverage is status that is actually TRUE because it's drawn from the real job, and the proof it cut the interruptions",
  },
  tool_fragmentation: {
    spine: "the truth scattered across disconnected places",
    first_fix_archetype:
      "a SINGLE-RECORD TRACE (one record, not a week of ticks): take ONE new record — an order, client, or job — and trace it through every place its details get entered, marking each spot someone re-keys a fact that already existed. The number of re-entry points for ONE record is the duplication tax, and it tends to shock people. A trace to size it, NOT the consolidation itself.",
    session_owns:
      "the single-source-of-truth system — one place each record lives, fed automatically so duplicate entry ends for good and every tool reads from the same truth",
  },
  repeat_admin_drag: {
    spine: "the same work redone because the context isn't reusable",
    first_fix_archetype:
      "a LAST-10 SAMPLE (jobs you already finished, not a running tally): take your last 10 completed jobs and count, per job, how many fields someone re-typed that already existed upstream. The average re-typed-per-job times your monthly volume is the compounding admin cost — pulled from work already done. A sample to size it, NOT the capture-once system that ends it.",
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
        "EIGHT hard rules decide whether this is good: " +
        "(1) BINDING CONSTRAINT — name the specific mechanism that actually caused the loss, not just the visible symptom. If a job died over a weekend, the constraint is response latency / after-hours coverage, not merely 'no central log'. Address that mechanism. " +
        "(2) THE PROSPECT SEES ONLY DIAGNOSIS + ONE PROBE — the free readout shows the mirror, where_it_costs_you, and ONE first_fix probe. what_an_intervention_looks_like and ninety_day_picture are INTERNAL (Justin's brief), NOT shown to the prospect. Do NOT make the readout feel complete or hand over the full plan; what the owner gets alone is the diagnosis plus one week-long measurement that proves it — the build is the session. " +
        "(3) MAKE THE SESSION THE VALUE — what_the_session_unlocks is the one place the prospect learns what they CANNOT get from the free readout. Name the specific system / build / automation the session produces for THEIR exact workflow and where it gets them — concrete enough to be credible, NOT enough to DIY, and visibly bigger than the first_fix probe. Two same-pattern businesses must get visibly DIFFERENT hooks: anchor it to their reported channels, job types, and the words from their story, not to the pattern. DO NOT HAND OVER A BUYABLE PATCH: if the binding constraint is a single-channel response latency or a status-answer gap an owner could plausibly patch alone with an off-the-shelf tool (an auto-responder, a $30/mo answering service, a canned SMS), do NOT describe that patch as the session's value — they will buy it and never call. Name instead what the patch CANNOT do: which leads or customers are actually slipping and why, across every channel, tied to real booked revenue — the cross-channel truth, attribution, and system-of-record layer a bolt-on tool can never give. The auto-reply is the easy part; the leverage is knowing what you're still losing. Banned boilerplate (identical for everyone, gives no reason to book): 'map the full path', 'decide what to automate vs assign', 'handle the edge cases', 'the threshold for X'. " +
        "(4) NO STOCK TEMPLATE — vary the SHAPE of the readout to THIS mess; do not reuse a fixed skeleton across submissions. Banned phrases: 'this week, pick one', 'shared Google Doc', 'shared Google Form', 'routes around the failing', 'binding constraint is not just'. " +
        "(5) NO PRODUCT NAMES — never name a specific software product (Google Forms, Typeform, Notion, Airtable, a named CRM brand). Describe the mechanism, not the tool; the leverage is in the workflow, not a SaaS pick. " +
        "(6) USE THEIR NUMBERS, AND VARY THE COST — anchor the second-order cost in where_it_costs_you to the cost band and frequency they reported, expressed in those terms. Pick the KIND of second-order cost that actually fits THIS business from a real range — wasted ad/marketing spend on leads that died, warranty or contract bleed, customers who churned or stopped referring, owner or senior-staff hours burned on rework, overtime, discount-to-recover — and do NOT default to 'pin down how many X' every time; that exact construction has become a tell. Only when there is genuinely no usable number, name the single figure worth pinning down — once, not as a reflex. This is cost-of-the-status-quo, NOT an ROI promise. " +
        "(7) THE FIRST FIX IS A LIGHT PROBE, NOT THE FIX — first_fix is a small, time-boxed experiment that CONFIRMS the binding constraint is real and SIZES what it costs, ending in a concrete number / count / pass-fail the owner reads themselves. Use the LIGHTEST probe that yields a number and VARY the mechanism off pattern_playbook.first_fix_archetype — a one-shot planted test, a look-back audit of records they already have, a single-job trace, a go-dark / planned-unreachable test, or a one-day tally — NOT always 'log it for a week and count' (a week of fresh logging is unpaid homework an attention-starved owner skips; prefer one afternoon or a retrospective pull where the archetype allows). It is explicitly NOT the solution: never an off-the-shelf tool they could just buy and run alone (that lets them solve it without you), and never a description of the paid build (that gives the system away). Pre-empt the small-number objection: note that even a SMALL count compounds across the year and that a small leak is the cheapest possible moment to close — so a low number argues FOR acting, not against it. Frame the result as the number to bring to the session. " +
        "(8) SHOW THEM SOMETHING THEY CANNOT SEE — what_you_cannot_see_yet is the imagination-gap move: name ONE thing the owner could not have written themselves, either (a) how this loss COMPOUNDS — this month's small leak becoming next quarter's lost relationship, dead referral pipeline, or eroded reputation — or (b) an ADJACENT problem the SAME fix silently also kills (e.g. fixing lead response also fixes which marketing spend you can trust). It must NOT restate where_it_costs_you; it must reframe the size or reach of the problem so the owner thinks 'I hadn't connected those.' One or two sharp sentences. " +
        "Build first_fix off pattern_playbook.first_fix_archetype and what_the_session_unlocks off pattern_playbook.session_owns so the structure fits this pattern, not a generic template. Also surface one second-order cost they probably have not priced, varying its kind to the business (wasted marketing spend, warranty/contract bleed, churn, lost referrals, rework hours).",
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
            where_it_costs_you: "specific operational spot where leverage is hiding and how the cost shows up; include one second-order cost they have not priced, of the KIND that fits this business (wasted ad spend / warranty bleed / churn / lost referrals / rework hours — vary it, do not always say 'pin down how many X'), ANCHORED to their reported cost band + frequency; only if there is genuinely no usable number, name the one figure worth pinning down",
            what_an_intervention_looks_like: "INTERNAL ONLY — included in Justin's sales brief, NEVER shown to the prospect, but you MUST still write it, fully tailored to their workflow. The shape of the real intervention that addresses the binding constraint; built off pattern_playbook.spine; plain-English, specific to their workflow; describe the mechanism, never a software product",
            first_fix: "a LIGHT falsifiable PROBE (not the fix, not the build): the smallest time-boxed measurement that sizes the binding constraint, built off pattern_playbook.first_fix_archetype, ending in a concrete number / count / pass-fail the owner reads themselves. Prefer a one-shot test or look-back audit over a week of fresh logging where the archetype allows. Pre-empt a small result (it still compounds; cheapest time to fix) and frame it as the number to bring to the session. Never something they could buy off the shelf to solve it; never a description of the paid system",
            why_this_is_fixable: "explain why this is a tractable workflow issue, not a personal/team failure",
            ninety_day_picture: "INTERNAL ONLY — included in Justin's sales brief, NEVER shown to the prospect, but you MUST still write it, tailored to their workflow. What good looks like after acting for 90 days, without ROI promises",
            what_the_session_unlocks: "the prospect-facing HOOK and the one thing the free readout withholds: the specific system / build / automation the session produces for THEIR exact workflow, and where it gets them. Concrete enough to be credible, NOT enough to DIY, visibly bigger than the first_fix probe. Re-keyed to THIS prospect's channels/job-types/words so a same-pattern peer would get a different hook. If the constraint is a single-channel latency or status gap an owner could patch with an off-the-shelf tool, name the cross-channel truth / attribution / system-of-record the patch CANNOT give, never the buyable auto-reply. Never generic 'map the full path / decide what to automate vs assign' boilerplate",
            what_you_cannot_see_yet: "the imagination-gap line shown to the prospect: ONE thing they could not have written themselves — either how this loss COMPOUNDS over the year into a bigger relationship / referral / reputation cost, or an ADJACENT problem the same fix also kills. Must NOT restate where_it_costs_you; reframe the size or reach so they think 'I hadn't connected those.' One or two sentences",
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
            "Anchor the second-order cost to their reported cost band + frequency, and VARY its kind to the business (ad spend / warranty / churn / referrals / rework hours); do not reflexively say 'pin down how many X'. Never invent a figure.",
            "Build first_fix off pattern_playbook.first_fix_archetype: the LIGHTEST probe that yields a number — a one-shot test, a look-back audit, a single-job trace, NOT always a week of logging. Pre-empt a small result and frame the number as the one to bring to the session. Never a buyable off-the-shelf fix; never the paid build.",
            "Build what_the_session_unlocks off pattern_playbook.session_owns as the SPINE, but rewrite it in the PROSPECT'S own terms (their specific channels, job types, and words from their story) so two businesses with the SAME pattern get visibly different hooks; never a pattern-generic system description or the banned boilerplate. If the constraint is a single-channel latency or status gap an owner could patch with an off-the-shelf tool, name the cross-channel truth / attribution layer the patch CANNOT give, not the buyable auto-reply.",
            "what_you_cannot_see_yet must add a NEW realization the owner could not have written — how the loss compounds, or an adjacency the same fix also kills — never a restatement of where_it_costs_you.",
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
