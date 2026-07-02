// Unit test for the specificity gate: extractOwnerEntities must pull the
// distinctive anchors out of the owner's own free text (dollar figures, counted
// units, time windows, proper nouns, trade vocabulary) while excluding template
// vocabulary, and specificityReport must flag key fields that echo none of them.
// Run: node --experimental-strip-types scripts/test-specificity.ts
import {
  extractOwnerEntities,
  specificityReport,
  fallbackAiResult,
  scoreLeverageMap,
  toPublicResult,
  type LeverageMapInput,
} from "../src/lib/leverage-map.ts"

let fails = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg)
    fails++
  }
}

const input: LeverageMapInput = {
  company: "Copperline Electric",
  name: "Dana Ruiz",
  email: "dana@copperline.test",
  phone: "",
  role: "",
  businessKind: "residential electrical contractor",
  teamSize: "twenty_to_fifty",
  brokenMoment: "lead_followup",
  momentStory:
    "Last month we lost a $4,200 panel upgrade because the voicemail sat until Monday. We get maybe 12 calls a weekend and Marcus is the only one who checks the box after hours.",
  peopleTouches: [],
  truthLocations: [],
  frictions: [],
  consequences: [],
  painStatement: "",
  frequency: "weekly",
  costBand: "one_to_five",
  perfectEmployee: "Someone who watches every quote and referral so nothing sits.",
  openToSession: "",
}

const entities = extractOwnerEntities(input)
const lower = entities.map((e) => e.toLowerCase())

// --- extraction pulls their anchors ------------------------------------------
assert(lower.some((e) => e.includes("$4,200")), `dollar figure extracted (got: ${entities.join(" | ")})`)
assert(lower.includes("12 calls"), "counted unit '12 calls' extracted")
assert(lower.includes("after hours") || lower.includes("after-hours"), "'after hours' time window extracted")
assert(lower.some((e) => e === "monday" || e === "mondays"), "'Monday' extracted")
assert(entities.includes("Marcus"), "proper noun 'Marcus' extracted")
assert(lower.some((e) => e.includes("voicemail")), "trade word 'voicemail' extracted")
assert(lower.includes("electrical") || lower.includes("residential") || lower.includes("contractor"), "businessKind token extracted")

// --- extraction excludes template vocabulary ----------------------------------
for (const stop of ["workflow", "system", "team", "owner", "business", "the", "because"]) {
  assert(!lower.includes(stop), `template/stop word '${stop}' NOT an entity`)
}
assert(entities.length <= 12, "entity list capped at 12")

// --- report flags fields with no echo -----------------------------------------
const score = scoreLeverageMap(input)
const generic = toPublicResult(fallbackAiResult(input, score))
// The per-pattern fallback echoes chips but not story entities by design.
const r1 = specificityReport(generic, ["$4,200", "marcus", "voicemail"])
assert(r1.missing.length > 0, "generic prose flagged: at least one key field misses every entity")

const specific = {
  ...generic,
  operator_readout: "The $4,200 panel upgrade died in the voicemail box, and that is the mechanism to fix.",
  where_it_costs_you: "Every weekend, 12 calls route to a box only Marcus checks.",
  first_fix: "Count how many of the 12 calls this weekend wait past Monday for a reply from Marcus or anyone.",
  what_the_session_unlocks: "Know which of those voicemail leads actually became jobs, in dollars.",
}
const r2 = specificityReport(specific, ["$4,200", "marcus", "voicemail", "12 calls"])
assert(r2.missing.length === 0, `their-words prose passes every field (missing: ${r2.missing.join(", ")})`)
assert((r2.echoes.first_fix ?? []).length >= 1, "first_fix echo recorded")

// --- no entities extracted never fails the gate --------------------------------
const r3 = specificityReport(generic, [])
assert(r3.missing.length === 0, "empty entity set: gate cannot fail")

if (fails === 0) {
  console.log("PASS — entity extraction pulls the owner's anchors, excludes template words; report flags no-echo fields and never fails on empty input")
} else {
  console.error(`${fails} failure(s)`)
  process.exit(1)
}
