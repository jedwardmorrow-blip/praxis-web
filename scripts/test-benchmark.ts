// Unit tests for the deterministic peer-benchmark table. No network, no model.
// Guards the canon rules: table keys match the 8 patterns EXACTLY, every pattern
// resolves to a real line, cited lines carry an https source, qualitative lines
// carry NO source and NO numeric precision (never fabricated).
// Run: node --experimental-strip-types scripts/test-benchmark.ts
import { BENCHMARK_TABLE, benchmarkFor } from "../src/lib/leverage-map-benchmark.ts"
import { LEVERAGE_PATTERNS } from "../src/lib/leverage-map.ts"

let fails = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg)
    fails++
  }
}

const patternKeys = Object.keys(LEVERAGE_PATTERNS).sort()
const tableKeys = Object.keys(BENCHMARK_TABLE).sort()

// Exact key parity — the canon's hard rule (table must cover exactly the 8 patterns).
assert(
  patternKeys.length === tableKeys.length && patternKeys.every((k, i) => k === tableKeys[i]),
  `benchmark keys match the pattern set exactly (patterns: ${patternKeys.join(",")} | table: ${tableKeys.join(",")})`,
)

const CITED = ["owner_bottleneck", "lead_leakage", "tool_fragmentation"]

for (const key of tableKeys) {
  const line = BENCHMARK_TABLE[key as keyof typeof BENCHMARK_TABLE]
  assert(line.text.trim().length > 30, `${key}: has a real, non-empty line`)
  if (line.cited) {
    assert(!!line.source && !!line.sourceUrl, `${key}: cited line carries a source + url`)
    assert(!!line.sourceUrl && line.sourceUrl.startsWith("https://"), `${key}: cited source url is https`)
  } else {
    assert(!line.source && !line.sourceUrl, `${key}: qualitative line carries NO source`)
    // Qualitative lines must claim no precision — no digits, no percentages.
    assert(!/\d/.test(line.text), `${key}: qualitative line carries no numbers`)
    assert(!/%|\bpercent\b/i.test(line.text), `${key}: qualitative line has no percentage`)
  }
}

// Exactly three cited lines, and they are the expected patterns.
const citedKeys = tableKeys.filter((k) => BENCHMARK_TABLE[k as keyof typeof BENCHMARK_TABLE].cited)
assert(citedKeys.length === 3, `exactly 3 cited lines (got ${citedKeys.length}: ${citedKeys.join(",")})`)
assert(CITED.every((k) => citedKeys.includes(k)), `the cited patterns are ${CITED.join(", ")}`)

// repeat_admin_drag is qualitative by design (its only stat is too poor a fit to cite).
assert(BENCHMARK_TABLE.repeat_admin_drag.cited === false, "repeat_admin_drag stays qualitative")

// benchmarkFor is a faithful lookup.
assert(benchmarkFor("owner_bottleneck") === BENCHMARK_TABLE.owner_bottleneck, "benchmarkFor maps to the table entry")
assert(benchmarkFor("handoff_fog").cited === false, "benchmarkFor returns the qualitative line for handoff_fog")

if (fails === 0) {
  console.log("PASS — benchmark table covers the 8 patterns; 3 cited with https sources, 5 qualitative, none fabricated")
} else {
  console.error(`${fails} failure(s)`)
  process.exit(1)
}
