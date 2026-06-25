#!/usr/bin/env node
// Leverage Map test matrix.
//
// Exercises /api/leverage-map across band logic, pattern routing, adversarial
// input, and the privacy boundary. Every case uses the honeypot path (_hp set),
// so there are ZERO side effects: no OpenAI call, no praxis_leads insert, no
// email. The deterministic scorer + fallback readout are what get asserted.
//
// Usage:  BASE_URL=http://localhost:8797 node scripts/test-leverage-map.mjs
// Default BASE_URL is http://localhost:8797.

const BASE_URL = process.env.BASE_URL || "http://localhost:8797"
const ENDPOINT = `${BASE_URL}/api/leverage-map`

const baseContact = { company: "Test Co", name: "Tester", email: "t@example.com" }

// Cases. expectBand / expectPattern are asserted when present.
const CASES = [
  {
    name: "thin input -> Clarify First",
    expectBand: "Clarify First",
    expectPattern: "lead_leakage",
    input: {
      brokenMoment: "lead_followup",
      momentStory: "a lead got lost somewhere",
      peopleTouches: [], truthLocations: [], frictions: [], consequences: [],
      painStatement: "", frequency: "", costBand: "", perfectEmployee: "", openToSession: "",
    },
  },
  {
    name: "rich lead-leakage -> Hidden Leverage Present",
    expectBand: "Hidden Leverage Present",
    expectPattern: "lead_leakage",
    input: {
      brokenMoment: "lead_followup",
      momentStory: "A $40k quote request came in Friday after hours, went to voicemail, got texted to a tech in the field, nobody logged it, and by Monday the customer booked a competitor instead.",
      peopleTouches: ["owner", "front_desk", "field_team"],
      truthLocations: ["phone_text", "owner_head"],
      frictions: ["followup_dropped", "no_owner", "missing_context"],
      consequences: ["lost_sale", "slow_response"],
      painStatement: "lead_leakage", frequency: "weekly", costBand: "five_to_twenty",
      perfectEmployee: "Capture the caller, building, unit and urgency the moment the call lands, own the next step, and make sure a quote goes out same day with a follow-up scheduled.",
      openToSession: "yes",
    },
  },
  {
    name: "machine-readable high-signal -> Leverage Map Ready",
    expectBand: "Leverage Map Ready",
    expectPattern: "handoff_fog",
    input: {
      brokenMoment: "handoff_stuck",
      momentStory: "A job moved from sales to the install crew and stalled for a week because the scope notes lived in one estimator's head and the crew could not see the latest version, so the customer kept calling for status nobody could give.",
      peopleTouches: ["owner", "manager", "ops", "field_team"],
      truthLocations: ["crm", "spreadsheet", "docs"],
      frictions: ["missing_context", "status_unknown"],
      consequences: ["customer_frustration", "duplicate_work", "owner_interruption"],
      painStatement: "systems_dont_talk", frequency: "weekly", costBand: "twenty_plus",
      perfectEmployee: "Know exactly where every job is, what the latest scope is, who owns the next step, and surface the next customer update before they have to ask.",
      openToSession: "yes",
    },
  },
  {
    name: "owner-decision input -> owner_bottleneck pattern",
    expectPattern: "owner_bottleneck",
    input: {
      brokenMoment: "owner_decision",
      momentStory: "A normal pricing approval stalled the whole job because only I can sign off, and I was on a roof all day.",
      peopleTouches: ["owner", "manager"],
      truthLocations: ["owner_head"],
      frictions: ["waiting_on_person"],
      consequences: ["owner_interruption"],
      painStatement: "cant_leave", frequency: "daily", costBand: "one_to_five",
      perfectEmployee: "", openToSession: "maybe",
    },
  },
  {
    name: "bad-report input -> reporting_lag pattern",
    expectPattern: "reporting_lag",
    input: {
      brokenMoment: "bad_report",
      momentStory: "The month-end numbers were wrong again so we made a staffing call on bad data and only found out weeks later.",
      peopleTouches: ["owner", "finance"],
      truthLocations: ["spreadsheet"],
      frictions: ["nobody_trusts_data"],
      consequences: ["bad_data"],
      painStatement: "last_month", frequency: "monthly", costBand: "unknown",
      perfectEmployee: "", openToSession: "yes",
    },
  },
  {
    name: "adversarial / junk values -> graceful Clarify First, no crash",
    expectBand: "Clarify First",
    input: {
      brokenMoment: "lead_followup",
      momentStory: "'; DROP TABLE praxis_leads; -- <script>alert(1)</script> 🤖🤖🤖 lorem ipsum nonsense filler text to pad length out a bit",
      peopleTouches: ["not_a_real_key", "owner", "12345"],
      truthLocations: ["garbage"],
      frictions: ["xxx", "definitely_not_real"],
      consequences: ["yyy"],
      painStatement: "zzz_unknown", frequency: "never", costBand: "infinity",
      perfectEmployee: "", openToSession: "maybe_not",
    },
  },
]

function assert(cond, msg, fails) {
  if (!cond) fails.push(msg)
}

async function runCase(c) {
  const body = { ...baseContact, ...c.input, _hp: "iamabot" }
  const fails = []
  let res, json
  try {
    res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
    json = await res.json()
  } catch (err) {
    return { name: c.name, ok: false, fails: [`request threw: ${err.message}`] }
  }

  assert(res.status === 200, `http ${res.status} (expected 200)`, fails)
  assert(json && json.ok === true, `ok != true`, fails)
  assert(json.deterministicFallback === true, `expected deterministicFallback true (honeypot)`, fails)
  assert(json.mapToken === null, `honeypot must not mint a mapToken`, fails)
  assert(json.result && !("internal" in json.result), `internal sales block leaked into result`, fails)
  assert(json.result && typeof json.result.what_the_session_unlocks === "string" && json.result.what_the_session_unlocks.trim().length > 0,
    `what_the_session_unlocks missing/empty`, fails)
  // The full intervention design and 90-day plan are HELD BACK behind the call —
  // they must NOT reach the public payload (the give-away/withhold fix).
  assert(json.result && !("what_an_intervention_looks_like" in json.result), `intervention design leaked into public result`, fails)
  assert(json.result && !("ninety_day_picture" in json.result), `90-day plan leaked into public result`, fails)
  // every remaining public field present and non-empty
  for (const k of ["operator_readout", "where_it_costs_you", "first_fix", "why_this_is_fixable", "what_you_cannot_see_yet"]) {
    assert(json.result && typeof json.result[k] === "string" && json.result[k].trim().length > 0, `field ${k} missing/empty`, fails)
  }
  if (c.expectBand) assert(json.score && json.score.resultBand === c.expectBand, `band ${json.score && json.score.resultBand} != ${c.expectBand}`, fails)
  if (c.expectPattern) assert(json.score && json.score.primaryPattern === c.expectPattern, `pattern ${json.score && json.score.primaryPattern} != ${c.expectPattern}`, fails)

  return {
    name: c.name,
    ok: fails.length === 0,
    fails,
    band: json.score && json.score.resultBand,
    composite: json.score && json.score.composite,
    pattern: json.score && json.score.primaryPattern,
  }
}

// Failure paths. The required-field check runs BEFORE the honeypot short-circuit
// and before scoring, and malformed JSON is rejected at parse time, so every case
// here returns 400 with ZERO side effects (no OpenAI, no lead, no email).
const FAILURE_CASES = [
  { name: "malformed JSON body -> 400", raw: "{ not valid json", expect: 400 },
  { name: "empty object -> 400 (missing required)", raw: "{}", expect: 400 },
  {
    name: "missing brokenMoment -> 400",
    raw: JSON.stringify({ company: "Test Co", name: "Tester", email: "t@example.com" }),
    expect: 400,
  },
  {
    name: "blank required values -> 400",
    raw: JSON.stringify({ company: "  ", name: "", email: "", brokenMoment: "" }),
    expect: 400,
  },
]

async function runFailureCase(c) {
  const fails = []
  let res
  try {
    res = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: c.raw })
  } catch (err) {
    return { name: c.name, ok: false, fails: [`request threw: ${err.message}`] }
  }
  assert(res.status === c.expect, `http ${res.status} (expected ${c.expect})`, fails)
  return { name: c.name, ok: fails.length === 0, fails, band: "-", composite: "-", pattern: "400" }
}

const results = []
for (const c of CASES) results.push(await runCase(c))
for (const c of FAILURE_CASES) results.push(await runFailureCase(c))

let passed = 0
for (const r of results) {
  const tag = r.ok ? "PASS" : "FAIL"
  console.log(`[${tag}] ${r.name}  (band=${r.band ?? "-"} composite=${r.composite ?? "-"} pattern=${r.pattern ?? "-"})`)
  if (!r.ok) for (const f of r.fails) console.log(`        - ${f}`)
  if (r.ok) passed++
}
console.log(`\n${passed}/${results.length} cases passed against ${ENDPOINT}`)
process.exit(passed === results.length ? 0 : 1)
