import type { LeveragePattern } from "@/lib/leverage-map"

// Peer-benchmark line for the readout — one deterministic line per pattern, keyed
// by the scored primary pattern. The MODEL NEVER GENERATES THIS (so the de-tell and
// give-away guards never touch it): it is a static, hand-verified lookup. Cited
// where a verified, attributable stat exists; an honest no-numbers qualitative line
// everywhere else. NOTHING here is fabricated — every cited line and its source was
// adversarially fetch-verified (see the leverage_map_benchmark_sources brain row).
//
// Adding a peer benchmark is the one strong move borrowed from the Superintelligent
// teardown, WITHOUT its fabrication risk: a shaky number hurts credibility more than
// no number, so 3 patterns carry a cited line and 5 stay qualitative on purpose.

export type BenchmarkLine = {
  text: string
  cited: boolean
  source?: string
  sourceUrl?: string
}

export const BENCHMARK_TABLE: Record<LeveragePattern, BenchmarkLine> = {
  // CITED — clean: current, SMB population, directly on-point.
  owner_bottleneck: {
    text: "About a third of business owners have no plan, or are unsure, about what happens to the business when they step away, according to a 2024 Gallup survey of working owner-operators.",
    cited: true,
    source: "Gallup, 2024",
    sourceUrl: "https://news.gallup.com/poll/657362/small-business-owners-lack-succession-plan.aspx",
  },
  // CITED — iconic but dated (B2C/B2B), shown with explicit attribution.
  lead_leakage: {
    text: "In a 2011 Harvard Business Review study of 1.25 million sales leads, firms that reached a new lead within an hour were nearly seven times as likely to have a real conversation with a decision maker as those that waited even an hour longer, and more than 60 times as likely as those that waited a day or more.",
    cited: true,
    source: "Harvard Business Review, 2011",
    sourceUrl: "https://hbr.org/2011/03/the-short-life-of-online-sales-leads",
  },
  // CITED — recent but Fortune 500 population, shown with explicit attribution.
  tool_fragmentation: {
    text: "In a Harvard Business Review study of 137 employees at three Fortune 500 companies, workers switched between applications and websites about 1,200 times a day, and reorienting after those switches added up to just under four hours a week, roughly 9% of their time at work.",
    cited: true,
    source: "Harvard Business Review, 2022",
    sourceUrl: "https://hbr.org/2022/08/how-much-time-and-energy-do-we-waste-toggling-between-applications",
  },
  // QUALITATIVE — no defensible current stat; claim no precision.
  handoff_fog: {
    text: "Most owner-led shops never track what a dropped handoff actually costs them, so the rework, the repeat questions, and the jobs that slip between shifts stay invisible until they show up as a missed deadline or an unhappy customer.",
    cited: false,
  },
  tribal_knowledge_risk: {
    text: "In most owner-led shops, the work runs on knowledge that lives in one or two people's heads and was never written down, so it stays invisible until the day that person is out and the job stops.",
    cited: false,
  },
  reporting_lag: {
    text: "Most owner-led shops never measure the gap between something happening and the owner seeing it in a report, which is exactly why the time lost to manual reporting stays invisible and decisions keep getting made on numbers that are already a week old.",
    cited: false,
  },
  customer_status_gap: {
    text: "Most owner-led shops never track how many calls and texts come in just asking where is my order or when will you get here, so the cost of staying quiet stays invisible even though customers notice every time.",
    cited: false,
  },
  // QUALITATIVE by choice: the only available stat (McKinsey 2012) is old, enterprise,
  // and measures info-search rather than duplicate re-entry — too poor a fit to cite.
  repeat_admin_drag: {
    text: "Most owner-led shops never measure how often the same information gets looked up, re-keyed, or rebuilt from scratch, which is exactly why this drag stays invisible and never gets fixed.",
    cited: false,
  },
}

// Pure lookup by the scored primary pattern. Always returns a non-empty line.
export function benchmarkFor(pattern: LeveragePattern): BenchmarkLine {
  return BENCHMARK_TABLE[pattern]
}

// Dark-flag gate. The benchmark line ships OFF; turn it on by setting
// NEXT_PUBLIC_BENCHMARK_LINE=1 in the Vercel env (inlined at build time, so set it
// before the build and redeploy). A global toggle gives a clean before/after read
// of conversion without a second concurrent split overlapping the ungate A/B.
export function benchmarkEnabled(): boolean {
  const flag = (process.env.NEXT_PUBLIC_BENCHMARK_LINE ?? "").trim()
  return flag === "1" || flag === "true"
}
