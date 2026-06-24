#!/usr/bin/env node --experimental-strip-types
// Real-path INSERT integration test — the coverage the honeypot matrix can't give.
//
// The #778 silent-drop bug lived in the live praxis_leads INSERT (a tier_discussed
// value outside the CHECK constraint made EVERY Clarify-First lead fail to insert
// while ok=true went back to the user). The honeypot tests short-circuit before
// that line, and the tier unit test runs with zero DB. This test scores a real
// submission per band, runs the ACTUAL insert against the live constraint with the
// real tierForComposite() value, asserts it succeeds, then deletes the row.
//
// Env-guarded: runs only when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set
// (CI secrets). Otherwise it SKIPS cleanly (exit 0) so the unit gate still passes.
// Self-cleaning: a sentinel company + public_token prefix, deleted in `finally`,
// with a pre-run sweep of any orphans from a prior crashed run.
//
// Run:  SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... \
//       node --experimental-strip-types scripts/test-saveLead-integration.ts

import { createClient } from "@supabase/supabase-js"
import {
  scoreLeverageMap,
  tierForComposite,
  type LeverageMapInput,
} from "../src/lib/leverage-map.ts"

const url = (process.env.SUPABASE_URL ?? "").trim()
const key = (process.env.SUPABASE_SERVICE_ROLE_KEY ?? "").trim()

if (!url || !key) {
  console.log("SKIP — SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set (no live DB creds); real-path insert test not run")
  process.exit(0)
}

const SENTINEL_COMPANY = "CI Integration Test (delete me)"
const TOKEN_PREFIX = "citest_"

const base = {
  company: SENTINEL_COMPANY,
  name: "CI Tester",
  email: "citest@praxis-citest.invalid",
  businessKind: "ci",
  role: "",
  phone: "",
  perfectEmployee: "",
} as const

// One submission per reachable band. (A completed quiz floors at Clarify First, so
// "Not Yet" is unreachable by design — these are the three real bands.)
const CASES: Array<{ band: string; input: LeverageMapInput }> = [
  {
    band: "Clarify First",
    input: {
      ...base,
      teamSize: "under_10",
      brokenMoment: "owner_decision",
      momentStory: "a routine approval waited on the owner",
      peopleTouches: ["owner", "front_desk"],
      truthLocations: ["owner_head"],
      frictions: ["waiting_on_person"],
      consequences: ["team_confusion"],
      painStatement: "cant_leave",
      frequency: "monthly",
      costBand: "unknown",
      openToSession: "maybe",
    },
  },
  {
    band: "Hidden Leverage Present",
    input: {
      ...base,
      teamSize: "ten_to_twenty",
      brokenMoment: "lead_followup",
      momentStory: "a referral text sat for a week and went cold",
      peopleTouches: ["owner", "front_desk", "manager"],
      truthLocations: ["spreadsheet", "owner_head"],
      frictions: ["followup_dropped"],
      consequences: ["missed_followup"],
      painStatement: "lead_leakage",
      frequency: "monthly",
      costBand: "under_1k",
      openToSession: "yes",
    },
  },
  {
    band: "Leverage Map Ready",
    input: {
      ...base,
      teamSize: "twenty_to_fifty",
      brokenMoment: "bad_report",
      momentStory: "a hand-assembled weekly report was wrong and drove a bad decision",
      peopleTouches: ["owner", "ops", "finance", "manager"],
      truthLocations: ["accounting", "crm", "docs"],
      frictions: ["nobody_trusts_data"],
      consequences: ["bad_data"],
      painStatement: "last_month",
      frequency: "daily",
      costBand: "twenty_plus",
      openToSession: "yes",
    },
  },
]

const supabase = createClient(url, key)
const fails: string[] = []
const assert = (cond: boolean, msg: string) => { if (!cond) fails.push(msg) }

async function sweep() {
  // Remove any orphans from a prior crashed run before and after the test.
  await supabase.from("praxis_leads").delete().eq("company", SENTINEL_COMPANY)
  await supabase.from("praxis_leads").delete().like("public_token", `${TOKEN_PREFIX}%`)
}

const insertedIds: string[] = []

try {
  await sweep()

  for (const c of CASES) {
    const score = scoreLeverageMap(c.input)
    assert(
      score.resultBand === c.band,
      `scorer produced band "${score.resultBand}" for the ${c.band} fixture (composite ${score.composite})`,
    )

    const tier = tierForComposite(score.composite)
    const token = `${TOKEN_PREFIX}${Math.abs(score.composite)}_${c.band.replace(/\s+/g, "").toLowerCase()}`

    // Mirror the columns saveLead() writes, so this exercises the same INSERT the
    // production route runs — including tier_discussed against the live CHECK.
    const { data, error } = await supabase
      .from("praxis_leads")
      .insert({
        company: c.input.company,
        contact_name: c.input.name,
        contact_email: c.input.email,
        contact_phone: null,
        // 'other' is the constraint-valid catch-all for praxis_leads_source_check;
        // a test row must not pollute the real 'inbound_form' funnel metrics.
        source: "other",
        stage: "Identified",
        pain_summary: `CI: ${c.band} (composite ${score.composite})`,
        world_model_notes: "CI integration test row — safe to delete",
        tier_discussed: tier,
        signal_depth: score.signalDepth,
        signal_readiness: score.signalReadiness,
        imagination_gap: score.imaginationGap,
        signal_composite: score.composite,
        surfaced_pains: score.surfacedPains,
        next_action: score.recommendedNextAction,
        public_token: token,
        leverage_map: { company: c.input.company, score, ci: true },
      })
      .select("id")
      .single()

    if (error) {
      fails.push(`INSERT FAILED for ${c.band} (composite ${score.composite}, tier "${tier}"): ${error.message}`)
      continue
    }
    if (data?.id) insertedIds.push(data.id)
    console.log(`  ok  ${c.band.padEnd(24)} composite ${score.composite} -> tier "${tier}" inserted (${data?.id})`)
  }
} finally {
  // Always clean up: delete by captured ids, then sweep the sentinel as a safety net.
  if (insertedIds.length) await supabase.from("praxis_leads").delete().in("id", insertedIds)
  await sweep()
}

if (fails.length) {
  console.log(`FAIL — ${fails.length} assertion(s):`)
  for (const f of fails) console.log("  - " + f)
  process.exit(1)
}
console.log(`PASS — real-path insert succeeds for all ${CASES.length} bands against the live tier_discussed constraint (rows cleaned up)`)
