// Unit test for priceProbeResult — the deterministic probe-return pricer. It
// must parse a leading number out of whatever the owner typed, annualize by
// their reported frequency, anchor to their cost band when one exists, handle
// the no-number and small-number cases gracefully, and never emit an em dash
// (house style) or a banned stock close.
// Run: node --experimental-strip-types scripts/test-probe-price.ts
import { priceProbeResult, type StoredLeverageMap } from "../src/lib/leverage-map.ts"

let fails = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg)
    fails++
  }
}

const baseMap = {
  company: "Cedarline Plumbing",
  firstName: "Pat",
  createdAt: new Date().toISOString(),
  score: {} as StoredLeverageMap["score"],
  result: {} as StoredLeverageMap["result"],
} satisfies Partial<StoredLeverageMap> as StoredLeverageMap

// Weekly frequency + known band: annualized count and a dollar range.
const weekly = priceProbeResult("7 missed calls", { ...baseMap, frequency: "weekly", costBand: "one_to_five" })
assert(weekly.body.includes("364"), `weekly 7 annualizes to 364 (got: ${weekly.body.slice(0, 120)})`)
assert(weekly.body.includes("$12K") && weekly.body.includes("$60K"), "weekly response anchors to the $1K-$5K/month band")

// Daily frequency: 250 working days.
const daily = priceProbeResult("3", { ...baseMap, frequency: "daily", costBand: "" })
assert(daily.body.includes("750"), `daily 3 annualizes to 750 (got: ${daily.body.slice(0, 120)})`)

// Unknown band: qualitative cost line, no fabricated dollars.
assert(!daily.body.includes("$"), "no dollar figure invented when the band is unknown")

// Small number: compounding pre-empt, not an all-clear.
const small = priceProbeResult("1", { ...baseMap, frequency: "weekly", costBand: "under_1k" })
assert(/small/i.test(small.headline) || /small/i.test(small.body), "small count gets the compounding pre-empt")

// Twenty-plus band: open-ended figure, no null high end leaking.
const big = priceProbeResult("12", { ...baseMap, frequency: "weekly", costBand: "twenty_plus" })
assert(big.body.includes("$240K+"), "open-ended band renders as $240K+")
assert(!big.body.includes("null"), "no null leaks into the open-ended band line")

// Number embedded in prose, with comma separators.
const prose = priceProbeResult("we counted about 1,200 re-entries", { ...baseMap, frequency: "monthly", costBand: "" })
assert(prose.body.includes("14,400"), `comma number parsed and annualized monthly (got: ${prose.body.slice(0, 120)})`)

// No number at all: still a real response, never a bounce.
const noNum = priceProbeResult("it was worse than I thought", { ...baseMap, frequency: "weekly" })
assert(noNum.body.length > 80, "non-numeric entry still gets a substantive response")

// Missing frequency (old stored maps): defaults to weekly, does not throw.
const legacy = priceProbeResult("5", baseMap)
assert(legacy.body.includes("260"), "legacy map without frequency defaults to weekly annualization")

// House style: no em dashes, no banned stock closes, in any output.
for (const r of [weekly, daily, small, big, prose, noNum, legacy]) {
  const text = `${r.headline} ${r.body}`
  assert(!text.includes("—"), `no em dash in probe response (${text.slice(0, 60)})`)
  assert(!/bring that number to the session/i.test(text), "no stock 'bring that number' close")
  assert(!/you'?ll finally/i.test(text), "no 'you'll finally' tell")
}

if (fails === 0) {
  console.log("PASS — probe pricing parses, annualizes, anchors to the band, and holds house style")
} else {
  console.error(`${fails} failure(s)`)
  process.exit(1)
}
