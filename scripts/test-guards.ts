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
  LEVERAGE_PATTERNS,
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

// --- guard: measurement vocabulary in first_fix is NOT a leak ----------------
// first_fix is a measurement probe by design (prompt rule 7); "track", "log",
// "count", "tally", "clock" are its native vocabulary. Treating them as leaks
// swapped the personalized probe for generic fallback on 2 of the first 2 real
// live leads (guard_events "giveaway:track") — the regression this pins down.
const measuring: LeverageMapAiResult = {
  ...fallback,
  first_fix:
    "For one representative day, track every after-hours call and log how long each waited for a real reply. Count how many waited more than 15 minutes; that count is the leak, measured.",
}
const g5 = guardReadoutGiveawayAndSkeleton(measuring, fallback)
assert(g5.result.first_fix === measuring.first_fix, "measurement-verb probe left untouched in first_fix")
assert(g5.events.length === 0, "no guard events for a measurement probe")

// A buyable patch or build component in first_fix is still a leak.
const buyable: LeverageMapAiResult = {
  ...fallback,
  first_fix: "Set up an auto-responder on your main line so every missed call gets an instant text back.",
}
const g6 = guardReadoutGiveawayAndSkeleton(buyable, fallback)
assert(g6.result.first_fix === fallback.first_fix, "buyable-patch first_fix replaced with fallback")
assert(g6.events.some((e) => e.field === "first_fix" && e.reason.startsWith("giveaway")), "give-away event recorded for buyable patch")

// The same measurement verbs in what_the_session_unlocks REMAIN a leak there —
// the unlock must withhold the build, and "tracks response time" names it.
const unlockLeak: LeverageMapAiResult = {
  ...fallback,
  what_the_session_unlocks: "The session builds a system that tracks response time on every channel and logs each lead as it lands.",
}
const g7 = guardReadoutGiveawayAndSkeleton(unlockLeak, fallback)
assert(g7.result.what_the_session_unlocks === fallback.what_the_session_unlocks, "unlock naming the build still replaced")
assert(g7.events.some((e) => e.field === "what_the_session_unlocks" && e.reason.startsWith("giveaway")), "give-away event recorded for unlock")

// --- fallback probes: per-pattern, distinct, and guard-clean ------------------
// The fallback first_fix is what a prospect sees when the guard fires, so it must
// itself be a real probe (not the old shared "map the path" sentence) and must be
// distinct per pattern — a guard fire must never reintroduce template-sameness.
const probeTexts = new Set<string>()
for (const pattern of Object.keys(LEVERAGE_PATTERNS) as Array<keyof typeof LEVERAGE_PATTERNS>) {
  const patScore = { ...score, primaryPattern: pattern, secondaryPattern: null }
  const fb = fallbackAiResult(baseInput, patScore)
  probeTexts.add(fb.first_fix)
  const check = guardReadoutGiveawayAndSkeleton(fb, fb)
  assert(check.events.length === 0, `fallback probe for ${pattern} is guard-clean`)
  assert(/count|tally|clock|list|trace|per job/i.test(fb.first_fix), `fallback probe for ${pattern} ends in something to count`)
}
assert(probeTexts.size === Object.keys(LEVERAGE_PATTERNS).length, "all fallback probes are distinct per pattern")

if (fails === 0) {
  console.log("PASS — guard replaces give-away leaks and the skeleton frame with the fallback, exempts give-away-closing and clean prose")
} else {
  console.error(`${fails} failure(s)`)
  process.exit(1)
}
