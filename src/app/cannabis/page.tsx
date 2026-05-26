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
    title: "Compliance is a full-time job",
    body: "Seed-to-sale tracking, GMP documentation, audit preparation — whatever your regulatory framework, compliance should be a background process, not a dedicated headcount. When your team is manually reconciling tags and paperwork, you're paying compliance tax on every hour of the day.",
  },
  {
    num: "02",
    title: "Your operation lives in one person's head",
    body: "Routes, vendor relationships, manifest logic, exception handling — it all runs through the person who's been there the longest. When they're out, the operation slows. When they leave, it breaks.",
  },
  {
    num: "03",
    title: "You can't see your business in real time",
    body: "Margin by SKU. On-time delivery rate. Inventory position across locations. If these numbers require a meeting or a spreadsheet to surface, you're making decisions on lag.",
  },
]

const outputs = [
  {
    label: "Custom Software",
    body: "Built for how your operation actually runs — not a template, not an off-the-shelf tool with a cannabis skin on it.",
  },
  {
    label: "AI Agents",
    body: "Agents that know your business: your routes, your compliance requirements, your vendors, your team structure. Not a generic chatbot.",
  },
  {
    label: "Institutional Memory",
    body: "Everything we learn about your operation gets encoded into a system that remembers. Your workflows, your exceptions, your vendor logic — documented once, available to every tool and agent we build. Your business is never explained twice.",
  },
]

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
        <section className="relative min-h-screen flex flex-col justify-center px-6 sm:px-16 lg:px-24 pt-28 pb-20 overflow-hidden">
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

          <div className="relative z-10 max-w-[900px]">
            <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-6">
              Cannabis Operations
            </p>
            <h1
              className="font-heading font-bold tracking-[-0.01em] leading-[1.03] text-foreground mb-6"
              style={{ fontSize: "clamp(2.4rem, 5.5vw, 5rem)" }}
            >
              Cannabis is one of the most operationally complex industries in America.
              We build the systems that let you run it.
            </h1>
            <p className="text-[1.05rem] text-muted-foreground leading-[1.78] max-w-[560px] mb-10">
              Custom software. AI that actually knows your operation — your routes,
              your compliance rules, your team structure. Built for how you run,
              not adapted from something built for someone else.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-[0.78rem] font-semibold tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 hover:-translate-y-px no-underline"
              style={{ borderRadius: "var(--radius)" }}
            >
              Tell us about your operation
            </a>
          </div>

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
        <section className="w-full px-6 sm:px-16 lg:px-24 py-24 bg-surface">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
              The Problem
            </p>
            <h2
              className="font-heading font-bold tracking-[-0.01em] leading-[1.04] text-foreground mb-14"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Where cannabis operations break down.
            </h2>

            <div className="flex flex-col gap-0.5">
              {problems.map(({ num, title, body }) => (
                <div
                  key={num}
                  className="group p-7 bg-card border-l-2 border-border hover:border-foreground/15 hover:bg-card-hover transition-all duration-200"
                >
                  <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground mb-2.5">
                    {num}
                  </p>
                  <h3 className="font-heading font-bold text-[1rem] tracking-[0.04em] text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-[0.88rem] text-muted-foreground leading-[1.72]">
                    {body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── What We Build ── */}
        <section className="w-full px-6 sm:px-16 lg:px-24 py-24">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
              What We Build
            </p>
            <h2
              className="font-heading font-bold tracking-[-0.01em] leading-[1.04] text-foreground mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Three things. Tightly integrated.
            </h2>
            <p className="text-[0.95rem] text-muted-foreground leading-[1.78] max-w-[580px] mb-14">
              Not a stack of SaaS tools. Not a consultant&apos;s deck. Purpose-built
              systems that fit how cannabis businesses actually operate.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
              {outputs.map(({ label, body }, i) => (
                <div key={label} className="group relative p-10 bg-card overflow-hidden">
                  <span
                    className="absolute top-0 left-0 w-0.5 h-0 bg-border transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:h-full"
                    aria-hidden="true"
                  />
                  <div
                    className="font-heading font-bold leading-none tracking-[0.02em] mb-6"
                    style={{
                      fontSize: "3rem",
                      color: "oklch(0.95 0 0 / 0.11)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-heading font-bold text-[1.2rem] tracking-[0.03em] text-foreground mb-3">
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

        {/* ── Platform Preview ── */}
        <section className="w-full px-6 sm:px-16 lg:px-24 py-24 bg-surface">
          <div className="max-w-[1100px] mx-auto">
            <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
              In Production
            </p>
            <h2
              className="font-heading font-bold tracking-[-0.01em] leading-[1.04] text-foreground mb-4"
              style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
            >
              Built and running in the field.
            </h2>
            <p className="text-[0.95rem] text-muted-foreground leading-[1.78] max-w-[560px] mb-14">
              Not mockups. These are live screens from CultOps — a platform we built
              to run a multi-state cannabis operation and now operate as a product.
            </p>

            <div className="flex flex-col gap-6">
              {[
                {
                  label: "Cultivation Command Center",
                  desc: "Every flower room in one view. Plant counts, strain mix, day-in-cycle, tasks due, harvest countdowns — all live.",
                  rows: [
                    { label: "FLW-06", val: "314 plants · 26 strains · D54 · 10d to harvest", accent: true },
                    { label: "FLW-07", val: "274 plants · 6 strains · D12 · 55d to harvest", accent: false },
                    { label: "FLW-09", val: "268 plants · 7 strains · D38 · 26d to harvest", accent: false },
                    { label: "FLW-10", val: "298 plants · 9 strains · D31 · 33d to harvest", accent: true },
                  ],
                },
                {
                  label: "Distribution Command Center",
                  desc: "Routes, manifests, driver status, and on-time delivery rate — across every active run, in real time.",
                  rows: [
                    { label: "Route 14 — Tucson North", val: "6 stops · 3 delivered · ETA on schedule", accent: true },
                    { label: "Route 09 — Phoenix West", val: "4 stops · 4 delivered · Complete", accent: false },
                    { label: "Route 22 — Scottsdale", val: "5 stops · 1 delivered · Delayed 18 min", accent: true },
                    { label: "Route 31 — Mesa / Tempe", val: "7 stops · 0 delivered · Departs 2:30 PM", accent: false },
                  ],
                },
                {
                  label: "Production Command Center",
                  desc: "Processing batches, extraction runs, packaging queue, and output yield — all tracked against plan.",
                  rows: [
                    { label: "Batch PRD-2241", val: "Trim · 42 lbs input · In progress", accent: false },
                    { label: "Batch PRD-2242", val: "Extraction · 18 lbs · Awaiting lab", accent: true },
                    { label: "Batch PRD-2239", val: "Packaging · 312 units · Complete", accent: false },
                    { label: "Batch PRD-2243", val: "Cure · 88 lbs · Day 14 of 21", accent: true },
                  ],
                },
              ].map(({ label, desc, rows }) => (
                <div
                  key={label}
                  className="grid grid-cols-1 lg:grid-cols-2 gap-0.5 bg-card overflow-hidden"
                >
                  {/* Text side */}
                  <div className="p-10 flex flex-col justify-center">
                    <p className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-muted-foreground mb-3">
                      {label}
                    </p>
                    <p className="text-[0.92rem] text-foreground leading-[1.75]">
                      {desc}
                    </p>
                  </div>

                  {/* Visual side — placeholder for GIF */}
                  <div
                    className="min-h-[260px] flex items-center justify-center p-8"
                    style={{ background: "oklch(0.085 0 0)" }}
                  >
                    <div
                      className="w-full flex flex-col gap-2"
                      style={{
                        border: "1px solid oklch(0.95 0 0 / 0.07)",
                        borderRadius: "4px",
                        padding: "16px",
                        background: "oklch(0.10 0 0)",
                      }}
                    >
                      {/* Fake nav bar */}
                      <div className="flex items-center gap-2 pb-2 mb-1" style={{ borderBottom: "1px solid oklch(0.95 0 0 / 0.06)" }}>
                        <div className="h-1 w-1 rounded-full" style={{ background: "oklch(0.95 0 0 / 0.25)" }} />
                        <div className="h-1.5 w-20 rounded-sm" style={{ background: "oklch(0.95 0 0 / 0.12)" }} />
                        <div className="flex-1" />
                        <div className="h-1.5 w-10 rounded-sm" style={{ background: "oklch(0.95 0 0 / 0.06)" }} />
                      </div>
                      {/* Rows */}
                      {rows.map(({ label: rowLabel, val, accent }) => (
                        <div
                          key={rowLabel}
                          className="flex items-center gap-3 py-1.5 px-2 rounded-sm"
                          style={{ background: accent ? "oklch(0.95 0 0 / 0.03)" : "transparent" }}
                        >
                          <div
                            className="h-1.5 w-1.5 rounded-full flex-shrink-0"
                            style={{ background: accent ? "oklch(0.95 0 0 / 0.35)" : "oklch(0.95 0 0 / 0.15)" }}
                          />
                          <div className="flex flex-col gap-1 flex-1 min-w-0">
                            <div className="h-1.5 rounded-sm" style={{ width: "35%", background: "oklch(0.95 0 0 / 0.22)" }} />
                            <div className="h-1 rounded-sm" style={{ width: "75%", background: "oklch(0.95 0 0 / 0.08)" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Proof ── */}
        <section className="w-full px-6 sm:px-16 lg:px-24 py-20 bg-card">
          <div className="max-w-[900px] mx-auto">
            <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-6">
              Proof of Work
            </p>
            <blockquote
              className="font-heading font-bold tracking-[-0.01em] leading-[1.08] text-foreground"
              style={{ fontSize: "clamp(1.6rem, 3.5vw, 2.8rem)" }}
            >
              We didn&apos;t build CultOps for a portfolio. We built it because our
              own multi-state cannabis operation — cultivation, processing,
              distribution, compliance — would have failed without it.
            </blockquote>
            <p className="mt-6 text-[0.88rem] text-muted-foreground leading-[1.72]">
              156 tables. 12 operational modules. Running in production today across
              multiple US states. The operator who built the software is the same
              person who ran the floor. Now we build for other operators.
            </p>
          </div>
        </section>

        {/* ── Contact ── */}
        <section
          id="contact"
          className="w-full px-6 sm:px-16 lg:px-24 py-24 bg-surface"
        >
          <div className="max-w-[680px] mx-auto">
            <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
              Work With Us
            </p>
            <h2
              className="font-heading font-bold tracking-[-0.01em] leading-[1.04] text-foreground mb-4"
              style={{ fontSize: "clamp(1.9rem, 3.8vw, 3rem)" }}
            >
              Tell us about your operation.
            </h2>
            <p className="text-[0.95rem] text-muted-foreground leading-[1.75] mb-6">
              We take on a limited number of engagements. Cannabis operators with
              real operational complexity — compliance burden, distribution chaos,
              knowledge trapped in people&apos;s heads — are exactly who we work with.
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
