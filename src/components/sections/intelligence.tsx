import { FadeUp, Stagger, StaggerItem } from "@/components/motion"

export function Intelligence() {
  return (
    <section
      id="intelligence"
      className="w-full px-20 py-28 max-sm:px-6"
      aria-labelledby="intelligence-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeUp className="max-w-[660px] mb-18">
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
            The Intelligence Layer
          </p>
          <h2
            id="intelligence-heading"
            className="font-heading font-bold tracking-[-0.01em] leading-[1.04] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            Your business, remembered.
          </h2>
          <p className="mt-5 text-[1.05rem] text-muted-foreground leading-[1.78]">
            Most AI tools start from zero every session. Ours don&apos;t. Every engagement begins
            with a Context Database — a structured knowledge system that AI agents read before they
            act. The longer we work together, the smarter your operation becomes.
          </p>
        </FadeUp>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          <StaggerItem><ColdStart /></StaggerItem>
          <StaggerItem><ContextDB /></StaggerItem>
          <StaggerItem><AgenticLoop /></StaggerItem>
          <StaggerItem><SmbGap /></StaggerItem>
        </Stagger>
      </div>
    </section>
  )
}

function InfographicCard({ label, title, children }: { label: string; title: string; children: React.ReactNode }) {
  return (
    <div className="relative flex flex-col bg-card p-11 min-h-[400px] overflow-hidden">
      <span
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, oklch(0.52 0.165 22 / 0.30), transparent 60%)" }}
        aria-hidden="true"
      />
      <p className="text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-brand mb-1.5">{label}</p>
      <h3 className="font-heading font-bold text-[1.25rem] tracking-[0.02em] text-foreground mb-7">{title}</h3>
      {children}
    </div>
  )
}

/* ── 01: Cold Start ── */
function ColdStart() {
  const sessions = ["S1", "S2", "S3"]

  return (
    <InfographicCard label="01 — The Cold Start Problem" title="Intelligence shouldn't reset every session.">
      <div className="flex-1 grid gap-0" style={{ gridTemplateColumns: "1fr 1px 1fr" }}>

        {/* Without context */}
        <div className="flex flex-col pr-6">
          <p className="text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground mb-4">Without context</p>
          <div className="flex flex-col gap-3 flex-1">
            {sessions.map((s, i) => (
              <div key={s}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[0.6rem] tracking-[0.08em] text-muted-foreground w-5">{s}</span>
                  <div className="flex-1 flex items-end gap-0.5 h-10">
                    {[0.18, 0.44, 0.72].map((h, j) => (
                      <div
                        key={j}
                        className="flex-1 rounded-sm"
                        style={{
                          height: `${h * 100}%`,
                          background: "oklch(0.38 0.003 80)",
                          opacity: 0.4,
                        }}
                      />
                    ))}
                  </div>
                </div>
                {i < 2 && (
                  <p className="text-[0.58rem] text-muted-foreground/50 ml-7 mb-1">↓ cold start</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-[0.7rem] text-muted-foreground leading-[1.55] mt-4 pt-3 border-t border-border">
            20% of every session spent re-explaining context.
          </p>
        </div>

        {/* Divider */}
        <div className="bg-border" />

        {/* With PRAXIS */}
        <div className="flex flex-col pl-6">
          <p className="text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground mb-4">With PRAXIS</p>
          <div className="flex flex-col gap-3 flex-1">
            {[
              { s: "S1", heights: [0.30, 0.60, 0.80], floor: 0 },
              { s: "S2", heights: [0.50, 0.78, 0.92], floor: 0.30 },
              { s: "S3", heights: [0.72, 0.92, 1.00], floor: 0.50 },
            ].map(({ s, heights, floor }, i) => (
              <div key={s}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[0.6rem] tracking-[0.08em] text-muted-foreground w-5">{s}</span>
                  <div className="flex-1 flex items-end gap-0.5 h-10">
                    {heights.map((h, j) => (
                      <div key={j} className="flex-1 rounded-sm relative overflow-hidden" style={{ height: `${h * 100}%` }}>
                        {/* floor line */}
                        {floor > 0 && j === 0 && (
                          <div
                            className="absolute left-0 right-0"
                            style={{
                              bottom: `${(floor / h) * 100}%`,
                              height: "1px",
                              background: "oklch(0.52 0.165 22 / 0.5)",
                            }}
                          />
                        )}
                        <div
                          className="absolute inset-0 rounded-sm"
                          style={{
                            background: "oklch(0.52 0.165 22)",
                            opacity: 0.5 + i * 0.17,
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                {i < 2 && (
                  <p className="text-[0.58rem] text-brand ml-7 mb-1" style={{ opacity: 0.65 }}>↑ compounds</p>
                )}
              </div>
            ))}
          </div>
          <p className="text-[0.7rem] text-muted-foreground leading-[1.55] mt-4 pt-3 border-t border-border">
            Every session starts from the{" "}
            <strong className="text-muted-foreground font-medium">last session&apos;s ceiling.</strong>
          </p>
        </div>
      </div>
    </InfographicCard>
  )
}

/* ── 02: Context DB ── */
const contextRows = [
  { name: "Business Rules & Operating Principles", count: "83 rules", live: false },
  { name: "Knowledge Graph — Entities & Relationships", count: "196 nodes", live: false },
  { name: "Decisions & Lessons Learned", count: "living", live: true },
  { name: "Active Projects & Task Context", count: "current", live: true },
  { name: "Team Structure, Roles & Responsibilities", count: "org map", live: false },
  { name: "Session Intelligence & Pattern Log", count: "compound", live: true },
]

function ContextDB() {
  return (
    <InfographicCard label="02 — What Lives in Your Context DB" title="A complete picture of your business.">
      <div className="flex-1 flex flex-col">
        {/* Hero stat */}
        <div
          className="flex items-center justify-between px-4 py-3.5 mb-3"
          style={{
            background: "oklch(0.52 0.165 22 / 0.08)",
            border: "1px solid oklch(0.52 0.165 22 / 0.22)",
          }}
        >
          <span className="text-[0.7rem] font-medium text-muted-foreground tracking-[0.04em]">
            Total context records in production
          </span>
          <span
            className="font-heading font-bold text-brand"
            style={{ fontSize: "1.5rem", letterSpacing: "-0.01em" }}
          >
            842+
          </span>
        </div>

        {/* Rows */}
        <div className="flex flex-col gap-0.5">
          {contextRows.map(({ name, count, live }) => (
            <div
              key={name}
              className="group flex items-center gap-3 px-3.5 py-2.5 bg-surface border-l-2 border-border hover:border-brand transition-colors duration-200"
            >
              <span
                className="h-[5px] w-[5px] rounded-full flex-shrink-0"
                style={{ background: live ? "oklch(0.52 0.165 22)" : "oklch(0.38 0.003 80)", opacity: live ? 0.8 : 0.4 }}
              />
              <span className="flex-1 text-[0.78rem] text-muted-foreground">{name}</span>
              <span
                className="text-[0.66rem] font-semibold tracking-[0.06em] whitespace-nowrap tabular-nums"
                style={{ color: live ? "oklch(0.52 0.165 22 / 0.75)" : "oklch(0.38 0.003 80)" }}
              >
                {count}
              </span>
            </div>
          ))}
        </div>

        <p className="text-[0.68rem] text-muted-foreground mt-4 pt-3 border-t border-border tracking-[0.04em]">
          Loaded into every AI session before the first prompt.
        </p>
      </div>
    </InfographicCard>
  )
}

/* ── 03: Agentic Loop ── */
function LoopNode({ label, sub }: { label: string; sub: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div
        className="flex items-center justify-center rounded-full text-[0.58rem] font-semibold tracking-[0.06em] uppercase text-brand"
        style={{
          width: 62,
          height: 62,
          border: "1.5px solid oklch(0.52 0.165 22 / 0.38)",
          background: "oklch(0.52 0.165 22 / 0.10)",
        }}
      >
        {label}
      </div>
      <span className="text-[0.6rem] text-muted-foreground text-center leading-[1.35] tracking-[0.03em] max-w-[72px]">
        {sub}
      </span>
    </div>
  )
}

function ArrowCell({ dir }: { dir: "right" | "left" | "down" | "up" }) {
  const arrows: Record<string, string> = { right: "→", left: "←", down: "↓", up: "↑" }
  return (
    <div className="flex items-center justify-center">
      <span
        className="text-[0.75rem] font-medium"
        style={{ color: "oklch(0.52 0.165 22 / 0.45)" }}
        aria-hidden="true"
      >
        {arrows[dir]}
      </span>
    </div>
  )
}

function AgenticLoop() {
  return (
    <InfographicCard label="03 — The Agentic Modeling Loop" title="AI that learns your business over time.">
      <div className="flex-1 flex items-center justify-center py-2">
        {/*
          3×3 grid forming a clockwise loop:
          [Observe]  →  [Encode]
              ↑             ↓
           [Learn]   ←   [Act]
        */}
        <div
          className="grid"
          style={{
            gridTemplateColumns: "1fr 32px 1fr",
            gridTemplateRows: "1fr 32px 1fr",
            width: 240,
            height: 220,
          }}
        >
          {/* Row 0 */}
          <LoopNode label="Observe" sub="Read context" />
          <ArrowCell dir="right" />
          <LoopNode label="Encode" sub="Update knowledge" />

          {/* Row 1 — vertical arrows */}
          <ArrowCell dir="up" />
          {/* center cell — subtle "loop" label */}
          <div className="flex items-center justify-center">
            <span
              className="text-[0.52rem] tracking-[0.12em] uppercase text-center leading-[1.4]"
              style={{ color: "oklch(0.38 0.003 80 / 0.6)" }}
            >
              loop
            </span>
          </div>
          <ArrowCell dir="down" />

          {/* Row 2 */}
          <LoopNode label="Learn" sub="Capture lessons" />
          <ArrowCell dir="left" />
          <LoopNode label="Act" sub="Build & execute" />
        </div>
      </div>
      <p className="text-[0.78rem] text-muted-foreground leading-[1.65] mt-auto pt-4 border-t border-border">
        Every session ends with encoded learning. Every session starts from a{" "}
        <strong className="text-muted-foreground font-medium">stronger baseline</strong>. The system compounds — it never resets.
      </p>
    </InfographicCard>
  )
}

/* ── 04: SMB Gap ── */
const smbRows = [
  { label: "Solopreneur", width: "22%", pct: "22%", highlight: false, badge: "Simple ops" },
  { label: "SMB Operator", width: "65%", pct: "65%", highlight: true, badge: "← PRAXIS" },
  { label: "Enterprise", width: "95%", pct: "95%", highlight: false, badge: "Full IT stack" },
]

function SmbGap() {
  return (
    <InfographicCard label="04 — The SMB Intelligence Gap" title="Built for the operators in the middle.">
      <div className="flex-1 flex flex-col gap-5 justify-center">
        {smbRows.map(({ label, width, pct, highlight, badge }) => (
          <div key={label}>
            <div className="flex items-center gap-4">
              <span className="text-[0.72rem] text-muted-foreground w-28 text-right flex-shrink-0 tracking-[0.02em]">
                {label}
              </span>
              <div className="flex-1 flex flex-col gap-1">
                <div
                  className="h-3 rounded-sm overflow-hidden"
                  style={{ background: highlight ? "oklch(0.52 0.165 22 / 0.07)" : "oklch(0.12 0 0)" }}
                >
                  <div
                    className="h-full rounded-sm transition-all"
                    style={{
                      width,
                      background: highlight ? "oklch(0.52 0.165 22)" : "oklch(0.38 0.003 80)",
                      opacity: highlight ? 1 : 0.3,
                    }}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className="text-[0.6rem] font-semibold tracking-[0.08em] uppercase"
                    style={{ color: highlight ? "oklch(0.52 0.165 22)" : "oklch(0.38 0.003 80)" }}
                  >
                    {badge}
                  </span>
                  <span
                    className="text-[0.62rem] tabular-nums"
                    style={{ color: highlight ? "oklch(0.52 0.165 22 / 0.6)" : "oklch(0.38 0.003 80 / 0.5)" }}
                  >
                    {pct}
                  </span>
                </div>
              </div>
            </div>
            {highlight && (
              <p
                className="text-[0.7rem] text-muted-foreground mt-1.5 leading-[1.55]"
                style={{ paddingLeft: "calc(7rem + 1rem)" }}
              >
                Medium complexity. Real operations. No enterprise budget.
              </p>
            )}
          </div>
        ))}
        <p className="text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground text-center border-t border-border pt-4 mt-1">
          Operational Complexity → Intelligence Capability
        </p>
      </div>
    </InfographicCard>
  )
}
