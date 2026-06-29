// Unit tests for the ungate A/B logic: the pure variant resolver, the route-side
// body parse, and the variant-aware step gate. No network, no DB, no model.
// Run: node --experimental-strip-types scripts/test-variant.ts
import { decideVariant, parseVariant } from "../src/lib/variant.ts"
import { validateStep } from "../src/lib/leverage-map-validate.ts"
import type { LeverageMapInput } from "../src/lib/leverage-map.ts"

let fails = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg)
    fails++
  }
}
function eq(actual: unknown, expected: unknown, msg: string) {
  assert(actual === expected, `${msg} (got ${JSON.stringify(actual)}, want ${JSON.stringify(expected)})`)
}

// --- decideVariant: precedence ----------------------------------------------
// 1. QA override wins outright, even against the kill switch and a sticky cookie.
eq(decideVariant({ override: "ungated", rolloutPct: 0, rand: 0.99 }), "ungated", "override beats kill switch")
eq(decideVariant({ override: "gated", existing: "ungated", rand: 0.0 }), "gated", "override beats sticky cookie")
eq(decideVariant({ override: "bogus", existing: "ungated", rand: 0.99 }), "ungated", "invalid override falls through to sticky")

// 2. Kill switch: rolloutPct <= 0 forces gated, overriding a stale ungated cookie.
eq(decideVariant({ rolloutPct: 0, rand: 0.0 }), "gated", "kill switch forces gated")
eq(decideVariant({ existing: "ungated", rolloutPct: 0, rand: 0.0 }), "gated", "kill switch overrides stale ungated cookie")

// 3. Sticky: an already-assigned valid cookie is never reassigned.
eq(decideVariant({ existing: "ungated", rolloutPct: 50, rand: 0.99 }), "ungated", "sticky ungated holds")
eq(decideVariant({ existing: "gated", rolloutPct: 50, rand: 0.0 }), "gated", "sticky gated holds")

// 4. Otherwise split by rolloutPct (rand*100 < pct => ungated).
eq(decideVariant({ rolloutPct: 50, rand: 0.4 }), "ungated", "40 < 50 => ungated")
eq(decideVariant({ rolloutPct: 50, rand: 0.6 }), "gated", "60 !< 50 => gated")
eq(decideVariant({ rolloutPct: 100, rand: 0.999 }), "ungated", "full rollout => ungated")
eq(decideVariant({ rolloutPct: 50, rand: 0.5 }), "gated", "boundary 50 !< 50 => gated")
// Default rolloutPct (undefined) is 50/50.
eq(decideVariant({ rand: 0.1 }), "ungated", "default pct 50: 10 < 50 => ungated")
eq(decideVariant({ rand: 0.9 }), "gated", "default pct 50: 90 !< 50 => gated")
// Invalid existing cookie is ignored (treated as unassigned).
eq(decideVariant({ existing: "bogus", rolloutPct: 100, rand: 0.5 }), "ungated", "invalid cookie ignored, splits")

// Distribution sanity: ~50% over a deterministic spread of rand values.
let ungatedCount = 0
const N = 1000
for (let i = 0; i < N; i++) {
  if (decideVariant({ rolloutPct: 50, rand: i / N }) === "ungated") ungatedCount++
}
assert(ungatedCount > 400 && ungatedCount < 600, `~50/50 split over deterministic spread (got ${ungatedCount}/${N})`)

// --- parseVariant: untrusted body --------------------------------------------
eq(parseVariant("ungated"), "ungated", "parse ungated")
eq(parseVariant("gated"), "gated", "parse gated")
eq(parseVariant("bogus"), "gated", "parse bogus => gated")
eq(parseVariant(undefined), "gated", "parse undefined => gated")
eq(parseVariant(null), "gated", "parse null => gated")
eq(parseVariant(123), "gated", "parse number => gated")

// --- validateStep: variant-aware Act-3 gate ----------------------------------
const base: LeverageMapInput = {
  company: "Cedarline Plumbing",
  name: "Pat Owner",
  email: "",
  phone: "",
  role: "",
  businessKind: "",
  teamSize: "",
  brokenMoment: "lead_followup",
  momentStory: "After-hours calls pile up and the slow ones quietly go to a competitor.",
  peopleTouches: [],
  truthLocations: [],
  frictions: [],
  consequences: [],
  painStatement: "",
  frequency: "",
  costBand: "",
  perfectEmployee: "",
  openToSession: "",
}

// Act 1
eq(validateStep(0, { ...base, brokenMoment: "" }, "gated"), "Pick the moment closest to what came up.", "act1 needs a moment")
eq(validateStep(0, { ...base, momentStory: "too short" }, "gated"), "A few words on what happened is enough to start.", "act1 needs a story")
eq(validateStep(0, base, "gated"), "", "act1 valid")
// Act 2 optional
eq(validateStep(1, base, "gated"), "", "act2 always valid")

// Act 3: gated requires email; ungated does not.
eq(validateStep(2, { ...base, email: "" }, "gated"), "Add a valid email.", "gated act3 requires email")
eq(validateStep(2, { ...base, email: "pat@cedarline.com" }, "gated"), "", "gated act3 with email passes")
eq(validateStep(2, { ...base, email: "" }, "ungated"), "", "ungated act3 passes without email")
eq(validateStep(2, { ...base, name: "" }, "ungated"), "Add your name.", "ungated still requires name")
eq(validateStep(2, { ...base, company: "" }, "ungated"), "Add the company name to unlock the map.", "ungated still requires company")
// Default arm is gated.
eq(validateStep(2, { ...base, email: "" }), "Add a valid email.", "default arm is gated")

if (fails === 0) {
  console.log("PASS — variant resolver, body parse, and variant-aware step gate behave correctly")
} else {
  console.error(`${fails} failure(s)`)
  process.exit(1)
}
