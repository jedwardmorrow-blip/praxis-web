// Unit test for the give-away + skeleton guard-or-fallback. It must REPLACE a
// withheld-sense field that names a build component, and a field carrying the
// "workflow X, not a personnel Y" skeleton, with the deterministic fallback for
// that field — while leaving clean prose and the give-away-CLOSING construction
// (a build word inside a "no tool can ..." sentence) untouched. The fallback swap
// (not scrub-in-place) is what keeps a context-dependent build word from being
// mis-rewritten on the very lines that close the give-away.
// Run: node --experimental-strip-types scripts/test-guards.ts
import {
  fallbackAiResult,
  findSkeletonTells,
  guardReadoutGiveawayAndSkeleton,
  scoreLeverageMap,
  type LeverageMapAiResult,
  type LeverageMapInput,
} from "../src/lib/leverage-map.ts"

let fails = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg)
    fails++
  }
}

const baseInput: LeverageMapInput = {
  company: "Cedarline Plumbing",
  name: "Pat Owner",
  email: "pat@cedarline.test",
  phone: "",
  role: "",
  businessKind: "plumbing",
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

const score = scoreLeverageMap(baseInput)
const fallback = fallbackAiResult(baseInput, score)

// --- findSkeletonTells (precision) ------------------------------------------
assert(findSkeletonTells("This is a workflow problem, not a people problem.").length > 0, "flag 'not a people problem'")
assert(findSkeletonTells("It is a workflow bottleneck, not a failure of effort.").length > 0, "flag 'not a failure of effort'")
assert(findSkeletonTells("It is not a motivation issue; the work just needs a system.").length > 0, "flag 'not a motivation issue'")
// Clean prose that mentions people/effort but is NOT the skeleton frame.
assert(findSkeletonTells("removing the dependency on one person remembering.").length === 0, "'one person' is not the skeleton")
assert(findSkeletonTells("This is fixable because the issue has a shape: a trigger and a handoff.").length === 0, "clean fixable line: no skeleton")
assert(findSkeletonTells("").length === 0, "empty input: no skeleton")

// --- guard: give-away leak in a withheld field IS replaced -------------------
const leaky: LeverageMapAiResult = {
  ...fallback,
  first_fix: "Set up a dashboard that tracks every inbound lead and alerts you when one goes cold.",
}
const g1 = guardReadoutGiveawayAndSkeleton(leaky, fallback)
assert(g1.result.first_fix === fallback.first_fix, "leaky first_fix replaced with fallback")
assert(g1.events.some((e) => e.field === "first_fix" && e.reason.startsWith("giveaway")), "give-away event recorded for first_fix")

// --- guard: give-away-CLOSING construction is NOT replaced -------------------
const closing: LeverageMapAiResult = {
  ...fallback,
  what_the_session_unlocks: "No bolt-on tool can track which leads slip away after hours; that cross-channel truth is the leverage.",
}
const g2 = guardReadoutGiveawayAndSkeleton(closing, fallback)
assert(g2.result.what_the_session_unlocks === closing.what_the_session_unlocks, "give-away-closing unlock left untouched")
assert(g2.events.length === 0, "no events for give-away-closing construction")

// --- guard: skeleton in why_this_is_fixable IS replaced ---------------------
const skeletal: LeverageMapAiResult = {
  ...fallback,
  why_this_is_fixable: "This is fixable because it is a workflow problem, not a people problem, so a system can carry it.",
}
const g3 = guardReadoutGiveawayAndSkeleton(skeletal, fallback)
assert(g3.result.why_this_is_fixable === fallback.why_this_is_fixable, "skeletal why_this_is_fixable replaced with fallback")
assert(g3.events.some((e) => e.field === "why_this_is_fixable" && e.reason.startsWith("skeleton")), "skeleton event recorded")

// --- guard: a clean readout passes through unchanged -------------------------
const g4 = guardReadoutGiveawayAndSkeleton(fallback, fallback)
assert(g4.events.length === 0, "clean readout: no guard events")
assert(g4.result.first_fix === fallback.first_fix && g4.result.why_this_is_fixable === fallback.why_this_is_fixable, "clean readout unchanged")

if (fails === 0) {
  console.log("PASS — guard replaces give-away leaks and the skeleton frame with the fallback, exempts give-away-closing and clean prose")
} else {
  console.error(`${fails} failure(s)`)
  process.exit(1)
}
