#!/usr/bin/env node --experimental-strip-types
// DEV PREVIEW HARNESS (not shipped to the funnel). Runs sample submissions through
// the SHARED prompt (src/lib/leverage-map-prompt.ts — identical to what the live
// route sends) and prints the new public readout + the now-held-back fields, so a
// human can review the conversion rewrite BEFORE it deploys. Side-effect free:
// it calls OpenAI only — no DB insert, no email.
//
// Reads OPENAI_API_KEY from .env.local. Input JSON files + optional prior-result
// files live in /tmp/lmqa. Run: node --experimental-strip-types scripts/preview-readouts.ts

import { readFileSync, writeFileSync } from "node:fs"
import { scoreLeverageMap, type LeverageMapInput } from "../src/lib/leverage-map.ts"
import { buildLeverageMessages } from "../src/lib/leverage-map-prompt.ts"

function envFromDotenv(name: string): string {
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const t = line.trim()
    if (!t || t.startsWith("#") || !t.includes("=")) continue
    const [k, ...rest] = t.split("=")
    if (k === name) return rest.join("=").trim().replace(/^"|"$/g, "")
  }
  return ""
}

const apiKey = envFromDotenv("OPENAI_API_KEY")
if (!apiKey) { console.error("no OPENAI_API_KEY in .env.local"); process.exit(1) }
const model = "gpt-4.1"

// company label, input file, prior-result file (the OLD public readout, for before/after)
const CASES = [
  { label: "Northgate Orthodontics (owner_bottleneck, Clarify First)", input: "/tmp/lmqa/s1.json", prior: "/tmp/lmqa/resp1.json" },
  { label: "Copperline Electric (lead_leakage, Hidden)", input: "/tmp/lmqa/s2.json", prior: "/tmp/lmqa/resp2.json" },
  { label: "Brightleaf Landscapes (lead_leakage, Hidden)", input: "/tmp/lmqa/s3.json", prior: "/tmp/lmqa/resp3.json" },
  { label: "Sutter Peak Wealth (reporting_lag, Ready)", input: "/tmp/lmqa/s4.json", prior: "/tmp/lmqa/resp4.json" },
  { label: "Halden Freight (handoff_fog, Ready)", input: "/tmp/lmqa/s5.json", prior: "/tmp/lmqa/resp5.json" },
  { label: "Meridian Dental Group (customer_status_gap, Ready)", input: "/tmp/lmqa/ux1.json", prior: "/tmp/lmqa/ux1_resp.json" },
]

function readJson(path: string): any {
  try { return JSON.parse(readFileSync(path, "utf8")) } catch { return null }
}

async function generate(input: LeverageMapInput) {
  const score = scoreLeverageMap(input)
  const messages = buildLeverageMessages(input, score)
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, temperature: 0.5, response_format: { type: "json_object" }, messages }),
  })
  if (!res.ok) throw new Error(`openai ${res.status}: ${await res.text()}`)
  const data = await res.json()
  return { score, parsed: JSON.parse(data.choices[0].message.content) }
}

const out: string[] = []
const log = (s = "") => { out.push(s); console.log(s) }

for (const c of CASES) {
  const input = readJson(c.input) as LeverageMapInput
  const prior = readJson(c.prior)
  const priorResult = prior?.result ?? null
  let gen
  try { gen = await generate(input) } catch (e) { log(`\n### ${c.label}\nERROR: ${(e as Error).message}`); continue }
  const r = gen.parsed
  log("\n" + "=".repeat(96))
  log(`### ${c.label}  —  Signal ${gen.score.composite}/9 · ${gen.score.resultBand}`)
  log("=".repeat(96))

  log("\n--- WHAT THE PROSPECT SEES NOW (free readout) ---")
  log(`PATTERN: ${r.pattern_label}`)
  log(`\nOPERATOR READOUT (mirror):\n${r.operator_readout}`)
  log(`\nWHERE IT COSTS YOU:\n${r.where_it_costs_you}`)
  log(`\nTHE FIRST FIX  [NEW]:\n${r.first_fix}`)
  if (priorResult?.first_fix) log(`  (OLD first fix was:\n   ${priorResult.first_fix})`)
  log(`\nWHY THIS IS FIXABLE:\n${r.why_this_is_fixable}`)
  log(`\nWHAT YOU CAN'T SEE YET  [NEW — imagination-gap beat]:\n${r.what_you_cannot_see_yet}`)
  log(`\nWHAT THE SESSION UNLOCKS  [the booking hook]:\n${r.what_the_session_unlocks}`)
  if (priorResult?.what_the_session_unlocks) log(`  (OLD unlock was:\n   ${priorResult.what_the_session_unlocks})`)

  log("\n--- NOW HELD BACK (internal only, no longer shown to the prospect) ---")
  log(`INTERVENTION DESIGN (gated): ${r.what_an_intervention_looks_like}`)
  log(`90-DAY PICTURE (gated): ${r.ninety_day_picture}`)
}

writeFileSync("/tmp/lmqa/before_after.txt", out.join("\n"))
log("\n\nWritten to /tmp/lmqa/before_after.txt")
