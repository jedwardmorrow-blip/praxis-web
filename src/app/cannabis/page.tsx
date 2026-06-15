import type { Metadata } from "next"
import Link from "next/link"
import { CannabisIntakeForm } from "./intake-form"

export const metadata: Metadata = {
  title: "Cannabis Operations",
  description:
    "Custom software, AI agents, and operational intelligence for cannabis operators. Purpose-built for compliance, distribution, and scale.",
  alternates: {
    canonical: "https://gopraxis.ai/cannabis",
  },
  openGraph: {
    title: "Cannabis Operations — PRAXIS",
    description:
      "Purpose-built operational systems for cannabis operators who've outgrown their tools.",
    url: "https://gopraxis.ai/cannabis",
    siteName: "PRAXIS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
}

const problems = [
  {
    num: "01",
    title: "Inventory stops matching reality",
    body: "Product moves through cultivation, production, packaging, sales, transfers, returns, adjustments, and compliance systems. Every handoff creates a place where the system of record can drift from the floor.",
  },
  {
    num: "02",
    title: "The exception path lives in one person's head",
    body: "Routes, vendor promises, batch decisions, manifest logic, compliance edge cases, customer rules. The operation keeps moving because someone remembers what the software never captured.",
  },
  {
    num: "03",
    title: "The close starts before accounting sees it",
    body: "Margin, cash, sellable inventory, production yield, and transfer accuracy are decided upstream. By the time finance is reconciling the mess, the operational failure has already happened.",
  },
]

const outputs = [
  {
    label: "Operating map",
    body: "A clear picture of where work starts, changes hands, gets corrected, and stops matching the system of record.",
  },
  {
    label: "Workflow system",
    body: "Production, inventory, distribution, compliance, reporting, and team handoffs shaped around how the operation actually runs.",
  },
  {
    label: "AI memory",
    body: "SOPs, exceptions, vendor logic, manager notes, and operational rules documented once, then made usable across the tools and agents we build.",
  },
]

const operatingSignals = [
  { label: "Inventory", sub: "real time", x: 50, y: 11, tone: "gold", mark: "INV" },
  { label: "Sales", sub: "orders", x: 82, y: 37, tone: "paper", mark: "SLS" },
  { label: "Delivery", sub: "fleet", x: 77, y: 71, tone: "gold", mark: "DLV" },
  { label: "Compliance", sub: "traceability", x: 50, y: 88, tone: "paper", mark: "CMP" },
  { label: "Finance", sub: "cash flow", x: 23, y: 71, tone: "gold", mark: "FIN" },
  { label: "Production", sub: "planning", x: 18, y: 37, tone: "paper", mark: "PRD" },
]

const operatingRows = [
  ["Source of truth", "inventory, batches, orders, tasks, exceptions"],
  ["Handoff points", "cultivation -> production -> sales -> delivery"],
  ["AI memory", "SOPs, notes, retrieval, draft work, review gates"],
  ["Human control", "approval where judgment, compliance, or money matters"],
]

const sprintSteps = [
  {
    label: "Map",
    body: "We trace one painful workflow from first input to final decision: who touches it, where it pauses, where data gets corrected, and where managers lose visibility.",
  },
  {
    label: "Prove",
    body: "We build a working proof around the actual operating logic: a dashboard, intake path, exception queue, AI-assisted documentation loop, or automation pattern.",
  },
  {
    label: "Decide",
    body: "You leave with a clear operating map, prioritized build path, and a recommendation on whether the workflow is worth rebuilding.",
  },
]

const proofSurfaces = [
  {
    label: "Command center",
    title: "Rooms, tasks, harvest risk.",
    body: "One place to see which rooms are active, which work is late, and what needs attention before it becomes an inventory or revenue problem.",
    accent: "red",
  },
  {
    label: "Room overview",
    title: "The floor, rendered as state.",
    body: "Plant counts, cycle timing, room readiness, harvest windows, and exceptions surface without waiting for a manager recap.",
    accent: "gold",
  },
  {
    label: "Harvest flow",
    title: "Handoffs stay visible.",
    body: "Incoming harvests, drying rooms, strain groups, and completion states stay attached to the work instead of disappearing into notes.",
    accent: "paper",
  },
]

function OperatingSchematic() {
  return (
    <div id="cannabis-atlas" className="relative z-10">
      <div
        className="relative min-h-[560px] overflow-hidden border border-border bg-card/70 lg:min-h-[640px]"
        style={{ borderRadius: "var(--radius)" }}
      >
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 48%, oklch(0.78 0.09 78 / 0.16), transparent 31%), radial-gradient(circle at 52% 48%, oklch(0.57 0.18 28 / 0.13), transparent 10%), linear-gradient(135deg, oklch(0.95 0 0 / 0.045), transparent 46%)",
          }}
          aria-hidden="true"
        />

        <svg
          className="pointer-events-none absolute left-1/2 top-[48%] aspect-square w-[84%] max-w-[560px] -translate-x-1/2 -translate-y-1/2"
          viewBox="0 0 640 640"
          preserveAspectRatio="xMidYMid meet"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="cannabis-flow" x1="0" x2="1" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.09 78 / 0.22)" />
              <stop offset="52%" stopColor="oklch(0.95 0 0 / 0.10)" />
              <stop offset="100%" stopColor="oklch(0.57 0.18 28 / 0.20)" />
            </linearGradient>
            <radialGradient id="cannabis-core" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="oklch(0.57 0.18 28 / 0.82)" />
              <stop offset="56%" stopColor="oklch(0.57 0.18 28 / 0.24)" />
              <stop offset="100%" stopColor="oklch(0.57 0.18 28 / 0)" />
            </radialGradient>
          </defs>
          <path
            d="M78 305 C150 132 390 78 519 194 C639 303 554 522 392 562 C205 607 42 474 78 305Z"
            fill="none"
            stroke="url(#cannabis-flow)"
            strokeWidth="1.6"
          />
          <path
            d="M112 430 C212 334 273 136 320 80 C360 150 427 331 528 430"
            fill="none"
            stroke="oklch(0.95 0 0 / 0.12)"
            strokeWidth="1.1"
          />
          <path
            d="M112 218 C215 297 250 382 320 556 C377 389 426 298 528 218"
            fill="none"
            stroke="oklch(0.95 0 0 / 0.10)"
            strokeWidth="1.1"
          />
          <path
            d="M118 208 H522 M124 432 H516 M320 76 V564"
            fill="none"
            stroke="oklch(0.95 0 0 / 0.10)"
            strokeWidth="1"
          />
          {[88, 132, 176, 221].map((radius) => (
            <circle
              key={radius}
              cx="320"
              cy="320"
              r={radius}
              fill="none"
              stroke="oklch(0.78 0.09 78 / 0.12)"
              strokeDasharray={radius % 2 === 0 ? "4 12" : "2 16"}
              strokeWidth="1"
            />
          ))}
          {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
            const rad = (angle * Math.PI) / 180
            const x1 = 320 + Math.cos(rad) * 238
            const y1 = 320 + Math.sin(rad) * 238
            const x2 = 320 + Math.cos(rad) * 249
            const y2 = 320 + Math.sin(rad) * 249
            return (
              <line
                key={angle}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="oklch(0.78 0.09 78 / 0.34)"
                strokeWidth="1.4"
              />
            )
          })}
          <ellipse cx="320" cy="320" rx="124" ry="42" fill="none" stroke="oklch(0.95 0 0 / 0.10)" strokeWidth="1" transform="rotate(28 320 320)" />
          <ellipse cx="320" cy="320" rx="124" ry="42" fill="none" stroke="oklch(0.95 0 0 / 0.10)" strokeWidth="1" transform="rotate(-28 320 320)" />
          <ellipse cx="320" cy="320" rx="38" ry="124" fill="none" stroke="oklch(0.95 0 0 / 0.10)" strokeWidth="1" />
          <circle cx="320" cy="320" r="48" fill="none" stroke="oklch(0.78 0.09 78 / 0.36)" strokeWidth="1.2" />
          <circle cx="320" cy="320" r="26" fill="url(#cannabis-core)" />
          <circle cx="320" cy="320" r="13" fill="oklch(0.57 0.18 28)" />
        </svg>

        <div className="relative flex min-h-[560px] flex-col justify-between p-5 sm:p-7 lg:min-h-[640px]">
          <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-foreground">
              Cannabis operating atlas
            </span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-brand">
              Praxis model / live system
            </span>
          </div>

          <div className="relative mx-auto my-2 aspect-square w-full max-w-[560px]">
            {operatingSignals.map((node) => (
              <div
                key={node.label}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: `${node.x}%`, top: `${node.y}%` }}
              >
                <div
                  className="grid h-16 w-16 place-items-center border bg-background/82 shadow-[0_0_34px_oklch(0_0_0/0.28)] backdrop-blur-sm sm:h-[4.6rem] sm:w-[4.6rem]"
                  style={{
                    borderColor:
                      node.tone === "gold"
                        ? "oklch(0.78 0.09 78 / 0.42)"
                        : "oklch(0.95 0 0 / 0.18)",
                    borderRadius: "999px",
                    }}
                  >
                  <span className="font-mono text-[0.58rem] tracking-[0.08em] text-foreground">
                    {node.mark}
                  </span>
                </div>
                <div className="mt-3 whitespace-nowrap text-center font-mono text-[0.6rem] uppercase tracking-[0.12em] text-foreground">
                  {node.label}
                </div>
                <div className="mt-1 whitespace-nowrap text-center font-mono text-[0.52rem] uppercase tracking-[0.12em] text-muted-foreground">
                  {node.sub}
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-px bg-border sm:grid-cols-2">
            {operatingRows.map(([label, value]) => (
              <div key={label} className="bg-background/76 p-4">
                <div className="font-mono text-[0.58rem] uppercase tracking-[0.16em] text-brand">
                  {label}
                </div>
                <div className="mt-2 text-[0.8rem] leading-[1.55] text-muted-foreground">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProofSurface({
  surface,
  index,
}: {
  surface: (typeof proofSurfaces)[number]
  index: number
}) {
  const accent =
    surface.accent === "red"
      ? "oklch(0.57 0.18 28)"
      : surface.accent === "gold"
        ? "oklch(0.78 0.09 78)"
        : "oklch(0.95 0 0 / 0.82)"

  return (
    <div
      className="group relative min-h-[520px] overflow-hidden border border-border bg-card"
      style={{ borderRadius: "var(--radius)" }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between border-b border-border pb-4">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-foreground">
            {surface.label}
          </span>
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em]" style={{ color: accent }}>
            0{index + 1}
          </span>
        </div>
        <h3 className="mt-6 font-heading text-[1.55rem] font-bold leading-[1.05] tracking-[0.02em] text-foreground">
          {surface.title}
        </h3>
        <p className="mt-4 text-[0.88rem] leading-[1.72] text-muted-foreground">
          {surface.body}
        </p>
      </div>

      <div className="absolute inset-x-5 bottom-5 overflow-hidden border border-border bg-background/74 p-4">
        <div className="mb-4 flex items-center gap-2 border-b border-border pb-3">
          <span className="h-2 w-2 rounded-full" style={{ background: accent }} />
          <span className="h-1.5 w-20 rounded-sm bg-foreground/20" />
          <span className="ml-auto h-1.5 w-10 rounded-sm bg-foreground/10" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          {Array.from({ length: 9 }).map((_, itemIndex) => {
            const active = (itemIndex + index) % 4 === 0
            const tall = itemIndex === 4 || itemIndex === 7
            return (
              <div
                key={itemIndex}
                className="min-h-16 border p-2"
                style={{
                  minHeight: tall ? 96 : 72,
                  borderColor: active ? accent : "oklch(0.95 0 0 / 0.06)",
                  background: active
                    ? "linear-gradient(180deg, oklch(0.57 0.18 28 / 0.16), oklch(0.95 0 0 / 0.025))"
                    : "oklch(0.95 0 0 / 0.025)",
                }}
              >
                <div className="h-1.5 w-11 rounded-sm bg-foreground/20" />
                <div className="mt-3 h-5 w-5 rounded-full border" style={{ borderColor: active ? accent : "oklch(0.95 0 0 / 0.12)" }} />
                <div className="mt-3 h-1 w-full rounded-sm bg-foreground/10" />
                <div className="mt-1.5 h-1 w-2/3 rounded-sm bg-foreground/10" />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function CannabisPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ── Nav ── */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 sm:px-10 py-4 border-b border-border backdrop-blur-2xl bg-background/84">
        <Link href="/" className="flex items-center gap-1.5 no-underline">
          <span className="font-heading text-base font-bold tracking-[0.06em] text-foreground">
            PRAXIS
          </span>
          <span
            className="h-[5px] w-[5px] rounded-full bg-brand flex-shrink-0"
            aria-hidden="true"
          />
        </Link>
        <a
          href="#contact"
          className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-brand hover:text-brand-hover transition-colors no-underline"
        >
          Work With Us
        </a>
      </header>

      <main>
        {/* ── Hero ── */}
        <section className="relative min-h-screen grid grid-cols-1 lg:grid-cols-[1.02fr_0.98fr] gap-12 xl:gap-18 items-center px-6 sm:px-16 lg:px-24 pt-28 pb-24 overflow-hidden">
          {/* dot-grid texture */}
          <div
            className="pointer-events-none absolute inset-0 z-0"
            style={{
              backgroundImage:
                "radial-gradient(oklch(0.95 0 0 / 0.032) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[55vh] z-0"
            style={{
              background:
                "radial-gradient(circle at 74% 31%, oklch(0.72 0.09 74 / 0.16), transparent 34%), radial-gradient(circle at 16% 82%, oklch(0.57 0.18 29 / 0.08), transparent 30%)",
            }}
            aria-hidden="true"
          />

          <div className="relative z-10 max-w-[920px]">
            <h1
              className="font-heading font-black tracking-[0] leading-[0.91] text-foreground mb-7 uppercase"
              style={{ fontSize: "clamp(3.35rem, 8.2vw, 8.9rem)" }}
            >
              The operating layer underneath cannabis.
            </h1>
            <p className="text-[1.08rem] text-muted-foreground leading-[1.78] max-w-[640px] mb-10">
              Praxis builds the operating intelligence cannabis teams usually carry
              in people, spreadsheets, state systems, and workarounds: the workflows,
              rules, exceptions, and memory that make the business run.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-[0.78rem] font-semibold tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 hover:-translate-y-px no-underline"
                style={{ borderRadius: "var(--radius)" }}
              >
                Send one workflow
              </a>
              <Link
                href="/discovery-sprint"
                className="inline-flex items-center gap-2 border border-border text-foreground hover:border-brand text-[0.78rem] font-semibold tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 no-underline"
                style={{ borderRadius: "var(--radius)" }}
              >
                See the sprint path
              </Link>
            </div>
            <div className="mt-9 grid grid-cols-3 max-w-[640px] border-y border-border">
              {[
                ["156", "tables"],
                ["12", "modules"],
                ["1", "operating memory"],
              ].map(([value, label]) => (
                <div key={label} className="py-4 pr-4 border-r border-border last:border-r-0 last:pl-4">
                  <div className="font-heading text-[2rem] leading-none text-foreground">
                    {value}
                  </div>
                  <div className="mt-1 text-[0.64rem] font-mono uppercase tracking-[0.16em] text-muted-foreground">
                    {label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <OperatingSchematic />

          {/* Scroll hint */}
          <div
            className="absolute bottom-11 left-6 sm:left-16 lg:left-24 flex items-center gap-3 text-[0.68rem] tracking-[0.18em] uppercase text-muted-foreground"
            aria-hidden="true"
          >
            <span className="block w-7 h-px bg-muted-foreground/50" />
            Scroll
          </div>
        </section>

        {/* ── The Problem ── */}
        <section className="relative w-full px-6 sm:px-16 lg:px-24 py-24 bg-surface overflow-hidden">
          <div
            className="absolute inset-0 opacity-60"
            style={{
              background:
                "linear-gradient(180deg, transparent, oklch(0.075 0 0 / 0.76)), repeating-linear-gradient(90deg, transparent 0 92px, oklch(0.95 0 0 / 0.018) 92px 93px)",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1180px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-14 items-start">
              <div>
                <h2
                  className="font-heading font-black tracking-[0] leading-[0.95] text-foreground uppercase"
                  style={{ fontSize: "clamp(2.7rem, 6vw, 6.4rem)" }}
                >
                  Where the work breaks.
                </h2>
                <p className="mt-6 text-[0.98rem] text-muted-foreground leading-[1.78] max-w-[520px]">
                  The software usually arrives after the damage. Praxis starts where
                  the work changes hands, because that is where cannabis operations
                  lose trust in the record.
                </p>
              </div>
              <div className="flex flex-col gap-4">
              {problems.map(({ num, title, body }) => (
                <div
                  key={num}
                    className="group relative overflow-hidden border border-border bg-background/56 p-7 transition-all duration-300 hover:border-brand/40"
                >
                    <span
                      className="absolute left-0 top-0 h-full w-1 bg-brand/50"
                      aria-hidden="true"
                    />
                    <span
                      className="absolute left-0 right-0 top-1/2 h-px bg-brand/20"
                      aria-hidden="true"
                    />
                    <p className="relative text-[0.65rem] font-semibold tracking-[0.16em] text-brand mb-2.5">
                    {num}
                  </p>
                    <h3 className="relative font-heading font-bold text-[1.12rem] tracking-[0.03em] text-foreground mb-2">
                    {title}
                  </h3>
                    <p className="relative text-[0.9rem] text-muted-foreground leading-[1.72]">
                    {body}
                  </p>
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── What We Build ── */}
        <section className="w-full px-6 sm:px-16 lg:px-24 py-24">
          <div className="max-w-[1180px] mx-auto">
            <h2
              className="font-heading font-black tracking-[0] leading-[0.96] text-foreground mb-4 uppercase"
              style={{ fontSize: "clamp(2.45rem, 5vw, 5rem)" }}
            >
              The build is not the first move. The map is.
            </h2>
            <p className="text-[0.95rem] text-muted-foreground leading-[1.78] max-w-[580px] mb-14">
              Not a stack of SaaS tools. Not a consultant&apos;s deck. The operating
              layer that lets cannabis teams trust the tools they already have.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border">
              {outputs.map(({ label, body }, i) => (
                <div key={label} className="group relative p-8 lg:p-10 bg-background overflow-hidden min-h-[300px]">
                  <span
                    className="absolute top-0 left-0 w-full h-0.5 bg-brand/40 origin-left scale-x-0 transition-transform duration-500 group-hover:scale-x-100"
                    aria-hidden="true"
                  />
                  <div
                    className="font-heading font-black leading-none tracking-[0] mb-8"
                    style={{
                      fontSize: "clamp(3.6rem, 7vw, 6.6rem)",
                      color: "oklch(0.95 0 0 / 0.075)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-heading font-bold text-[1.35rem] tracking-[0.03em] text-foreground mb-3">
                    {label}
                  </h3>
                  <p className="text-[0.88rem] text-muted-foreground leading-[1.72]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Operator Origin ── */}
        <section className="w-full px-6 sm:px-16 lg:px-24 py-24 bg-card">
          <div className="max-w-[1180px] mx-auto grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-center">
            <div>
            <h2
                className="font-heading font-black tracking-[0] leading-[0.96] text-foreground mb-5 uppercase"
                style={{ fontSize: "clamp(2.4rem, 5vw, 5.2rem)" }}
            >
                Built from the operator side.
            </h2>
            <p className="text-[0.98rem] text-muted-foreground leading-[1.8] max-w-[720px]">
              Praxis grew out of real cannabis operating work: inventory, production,
              distribution, compliance, reporting, training, and the daily handoffs
              where systems usually break. The work is turning operational knowledge
              into tools teams can actually use.
            </p>
            </div>
            <div className="grid grid-cols-2 gap-px bg-border">
              {operatingRows.map(([label, value]) => (
                <div key={label} className="bg-background p-5 min-h-[132px]">
                  <div className="text-[0.62rem] font-mono uppercase tracking-[0.16em] text-brand mb-4">
                    {label}
                  </div>
                  <div className="text-[0.9rem] text-foreground leading-[1.6]">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Discovery Sprint ── */}
        <section className="w-full px-6 sm:px-16 lg:px-24 py-24">
          <div className="max-w-[1180px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 items-start">
              <div>
                <h2
                  className="font-heading font-black tracking-[0] leading-[0.96] text-foreground mb-5 uppercase"
                  style={{ fontSize: "clamp(2.4rem, 5vw, 5rem)" }}
                >
                  Five days to find the operating truth.
                </h2>
                <p className="text-[0.95rem] text-muted-foreground leading-[1.78] max-w-[560px]">
                  A Discovery Sprint is the first pass: one workflow, five business
                  days, a practical map of where the work breaks, and a working proof
                  of what should exist next.
                </p>
              </div>
              <div className="grid grid-cols-1 gap-px bg-border">
                {sprintSteps.map((step, index) => (
                  <div
                    key={step.label}
                    className="bg-card p-7"
                  >
                    <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-brand mb-2">
                      {String(index + 1).padStart(2, "0")}
                    </p>
                    <h3 className="font-heading font-bold text-[1.15rem] tracking-[0.04em] text-foreground mb-2">
                      {step.label}
                    </h3>
                    <p className="text-[0.88rem] text-muted-foreground leading-[1.72]">
                      {step.body}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Platform Preview ── */}
        <section
          id="operating-surface"
          className="relative w-full px-6 sm:px-16 lg:px-24 py-24 bg-surface overflow-hidden"
        >
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(circle at 80% 18%, oklch(0.68 0.08 75 / 0.12), transparent 32%), radial-gradient(circle at 12% 78%, oklch(0.58 0.19 28 / 0.10), transparent 26%)",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1180px] mx-auto">
            <h2
              className="font-heading font-black tracking-[0] leading-[0.96] text-foreground mb-4 uppercase"
              style={{ fontSize: "clamp(2.4rem, 5vw, 5.2rem)" }}
            >
              The proof is an operating surface.
            </h2>
            <p className="text-[0.95rem] text-muted-foreground leading-[1.78] max-w-[560px] mb-14">
              We found raw CultOps screenshots locally and used them as reference.
              The public page keeps the proof stylized and redacted until you decide
              what internal operating data should be shown.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {proofSurfaces.map((surface, index) => (
                <ProofSurface key={surface.label} surface={surface} index={index} />
              ))}
            </div>
          </div>
        </section>

        {/* ── Proof ── */}
        <section className="w-full px-6 sm:px-16 lg:px-24 py-24 bg-card">
          <div className="max-w-[980px] mx-auto">
            <blockquote
              className="font-heading font-black tracking-[0] leading-[0.98] text-foreground uppercase"
              style={{ fontSize: "clamp(2rem, 4.4vw, 4.8rem)" }}
            >
              We didn&apos;t build CultOps for a portfolio. We built it because our
              own multi-state cannabis operation — cultivation, processing,
              distribution, compliance — would have failed without it.
            </blockquote>
            <p className="mt-6 text-[0.88rem] text-muted-foreground leading-[1.72]">
              156 tables. 12 operational modules. Built from the same problems this
              page names: inventory drift, production handoffs, sales allocation,
              compliance records, reporting lag, and operational knowledge trapped
              in people&apos;s heads.
            </p>
          </div>
        </section>

        {/* ── Contact ── */}
        <section
          id="contact"
          className="w-full px-6 sm:px-16 lg:px-24 py-24 bg-surface"
        >
          <div className="max-w-[680px] mx-auto">
            <h2
              className="font-heading font-black tracking-[0] leading-[0.98] text-foreground mb-5 uppercase"
              style={{ fontSize: "clamp(2.3rem, 5vw, 4.8rem)" }}
            >
              Send one workflow worth inspecting.
            </h2>
            <p className="text-[0.95rem] text-muted-foreground leading-[1.75] mb-6">
              For cannabis operators, Praxis builds the operating layer underneath
              the tools: workflow systems, AI-enabled documentation, reporting
              surfaces, and institutional memory. If the workflow is not worth a
              build, the map will show that too.
            </p>
            <p className="text-[0.82rem] text-muted-foreground leading-[1.65] mb-10"
               style={{ borderLeft: "1px solid oklch(0.95 0 0 / 0.08)", paddingLeft: "16px" }}
            >
              PRAXIS is operated by Justin Morrow and Greg Dunaway — operators who
              built and ran cannabis operations before building software for them.{" "}
              <a href="mailto:Greg@gopraxis.ai" className="text-foreground hover:text-brand transition-colors no-underline">
                Greg@gopraxis.ai
              </a>
            </p>
            <CannabisIntakeForm />
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="w-full px-6 sm:px-16 lg:px-24 py-10 border-t border-border">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between flex-wrap gap-4">
          <Link href="/" className="flex items-center gap-1.5 no-underline">
            <span className="font-heading text-sm font-bold tracking-[0.06em] text-foreground">
              PRAXIS
            </span>
            <span
              className="h-[5px] w-[5px] rounded-full bg-brand flex-shrink-0"
              aria-hidden="true"
            />
          </Link>
          <p className="text-[0.75rem] text-muted-foreground tracking-[0.06em]">
            Operational Intelligence
          </p>
        </div>
      </footer>
    </div>
  )
}
