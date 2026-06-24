#!/usr/bin/env node --experimental-strip-types
// Regression guard for the tier_discussed bug class (#778).
//
// Before #778, composite < 6 was hardcoded to "Other", which is NOT in the
// praxis_leads_tier_discussed_check constraint, so EVERY Clarify-First lead
// (composite 4-5) silently failed to INSERT: no lead, no map, no email, but
// ok=true to the user. The single happy-path e2e (composite 7) never hit it.
//
// This test asserts, with zero DB/network, that every composite the scorer can
// produce maps to a constraint-valid tier, and that our value set has not
// drifted from the actual DB CHECK constraint.
//
// Run:  node --experimental-strip-types scripts/test-lead-tier.ts   (needs node@22+)

import {
  TIER_DISCUSSED_VALUES,
  tierForComposite,
  scoreLeverageMap,
  BROKEN_MOMENTS,
  type LeverageMapInput,
} from "../src/lib/leverage-map.ts"

// The contract: the exact ARRAY in praxis_leads_tier_discussed_check. If the
// app's TIER_DISCUSSED_VALUES drifts from this, the insert will start failing
// the constraint again — so this literal is the canary, verified against the DB
// on 2026-06-23 (pg_get_constraintdef).
const DB_CONSTRAINT_VALUES = ["Discovery Sprint", "Sprint", "Build", "Platform", "Not Yet Discussed"]

const fails: string[] = []
const assert = (cond: boolean, msg: string) => { if (!cond) fails.push(msg) }

// 1. App value set must exactly match the DB constraint set.
assert(
  JSON.stringify([...TIER_DISCUSSED_VALUES].sort()) === JSON.stringify([...DB_CONSTRAINT_VALUES].sort()),
  `TIER_DISCUSSED_VALUES drifted from DB constraint: ${JSON.stringify(TIER_DISCUSSED_VALUES)}`,
)

// 2. Every composite the scorer can emit (3-9) — plus defensive out-of-range
//    values — must map to a constraint-valid tier. This is the assertion that
//    would have caught the "Other" bug.
const valid = new Set<string>(DB_CONSTRAINT_VALUES)
for (let c = 0; c <= 10; c++) {
  const tier = tierForComposite(c)
  assert(valid.has(tier), `tierForComposite(${c}) = "${tier}" is not constraint-valid`)
}

// 3. The intended band split is preserved.
assert(tierForComposite(5) === "Not Yet Discussed", `composite 5 should be Not Yet Discussed, got ${tierForComposite(5)}`)
assert(tierForComposite(6) === "Discovery Sprint", `composite 6 should be Discovery Sprint, got ${tierForComposite(6)}`)

// 4. End-to-end through the real scorer: a genuine Clarify-First submission
//    (the exact band that used to be dropped) must produce a valid tier.
const clarifyFirst: LeverageMapInput = {
  company: "X", name: "Y", email: "y@example.com", businessKind: "",
  teamSize: "", brokenMoment: "repeat_admin" as keyof typeof BROKEN_MOMENTS,
  momentStory: "small recurring mess", peopleTouches: [], truthLocations: [],
  frictions: [], consequences: [], painStatement: "", frequency: "",
  costBand: "", perfectEmployee: "", openToSession: "",
}
const s = scoreLeverageMap(clarifyFirst)
assert(s.resultBand === "Clarify First", `expected Clarify First, got ${s.resultBand} (composite ${s.composite})`)
assert(valid.has(tierForComposite(s.composite)), `Clarify-First composite ${s.composite} maps to invalid tier "${tierForComposite(s.composite)}"`)

if (fails.length) {
  console.log(`FAIL — ${fails.length} assertion(s):`)
  for (const f of fails) console.log("  - " + f)
  process.exit(1)
}
console.log("PASS — tier_discussed mapping is constraint-valid across all composites (4 checks)")
