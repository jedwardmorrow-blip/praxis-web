#!/usr/bin/env node --experimental-strip-types
// Unit guard for the banned-phrase scrubber (route rule 4).
//
// A verbatim banned phrase ("this week, pick one") shipped to the live readout
// and was only caught by an after-the-fact rating. This test asserts, with zero
// DB/network, that every banned phrase as it has actually appeared live is
// DETECTED and that the scrub leaves no survivor, while clean copy is untouched.
//
// Run:  node --experimental-strip-types scripts/test-banned-phrases.ts   (node@22+)

import {
  findBannedPhrases,
  scrubBannedPhrases,
  guardReadoutBannedPhrases,
  type LeverageMapAiResult,
} from "../src/lib/leverage-map.ts"

const fails: string[] = []
const assert = (cond: boolean, msg: string) => { if (!cond) fails.push(msg) }

// Each sample is a real (or realistic) live violation. Must be detected, and the
// scrub must leave zero banned phrases behind.
const VIOLATIONS = [
  "This week, pick one high-impact number and publish it daily by 9am.",
  "The binding constraint here isn't just 'no central log'; it's response latency.",
  "The binding constraint is not just the missing report.",
  "Assign one owner so the fix routes around the failing handoff.",
  "Drop every lead into a shared Google Doc the whole team can see.",
  "Collect every inbound request in a shared Google Form.",
]

for (const sample of VIOLATIONS) {
  assert(findBannedPhrases(sample).length > 0, `not detected: ${sample}`)
  const scrubbed = scrubBannedPhrases(sample)
  assert(findBannedPhrases(scrubbed).length === 0, `survivor after scrub: "${scrubbed}"`)
  assert(!/\bthis week,\s*pick\s+one\b/i.test(scrubbed), `"this week, pick one" survived: "${scrubbed}"`)
  // Scrub is idempotent.
  assert(scrubBannedPhrases(scrubbed) === scrubbed, `scrub not idempotent: "${scrubbed}"`)
}

// Clean copy must be left exactly as-is (no false positives, no mutation).
const CLEAN = [
  "Pick one lead source and give it a single owner with a same-day reply.",
  "The real constraint is response latency after hours, not the missing log.",
  "Publish one trusted number every morning before the decision is made.",
]
for (const sample of CLEAN) {
  assert(findBannedPhrases(sample).length === 0, `false positive on clean copy: ${sample}`)
  assert(scrubBannedPhrases(sample) === sample, `clean copy mutated: ${sample}`)
}

// guardReadoutBannedPhrases scrubs every public field, reports hits, and leaves
// the internal block untouched.
const dirty: LeverageMapAiResult = {
  pattern_label: "Reporting Lag",
  result_title: "Leverage Map Ready",
  operator_readout: "The binding constraint here isn't just the missing report.",
  what_you_are_already_doing_right: "You traced the error to its origin.",
  where_it_costs_you: "Daily decisions run on stale data.",
  what_an_intervention_looks_like: "One trusted number on a fixed cadence.",
  first_fix: "This week, pick one high-impact number to publish daily.",
  why_this_is_fixable: "It has a clear shape.",
  ninety_day_picture: "A trusted daily number arrives before the decision window.",
  what_the_session_unlocks: "Which numbers actually drive the decisions.",
  internal: {
    session_questions: ["a", "b", "c"],
    follow_up_opener: "x",
    crm_summary: "x",
    confidence: "high",
    lead_score: 9,
    likely_buyer_mindset: "x",
    recommended_offer: "AI Leverage Session",
    sales_angle: "x",
    urgency_reason: "x",
    follow_up_subject: "x",
    follow_up_sms: "x",
    disqualification_flags: [],
  },
}
const guarded = guardReadoutBannedPhrases(dirty)
assert(guarded.hits.length >= 2, `expected >=2 hits, got ${guarded.hits.length}: ${guarded.hits.join(", ")}`)
assert(findBannedPhrases(guarded.result.operator_readout).length === 0, "operator_readout not clean after guard")
assert(findBannedPhrases(guarded.result.first_fix).length === 0, "first_fix not clean after guard")
assert(guarded.result.internal.lead_score === 9, "internal block was altered")
assert(dirty.first_fix.includes("This week, pick one"), "guard mutated the input object (should be a copy)")

if (fails.length) {
  console.log(`FAIL — ${fails.length} assertion(s):`)
  for (const f of fails) console.log("  - " + f)
  process.exit(1)
}
console.log(`PASS — banned-phrase guard detects + scrubs all ${VIOLATIONS.length} violations, leaves clean copy intact, preserves internal block`)
