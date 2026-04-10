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
            className="font-heading font-bold tracking-[0.02em] leading-[1.05] text-foreground"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
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
    <div className="relative flex flex-col bg-card p-11 min-h-[380px] overflow-hidden">
      <span
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, oklch(0.52 0.165 22 / 0.30), transparent 60%)" }}
        aria-hidden="true"
      />
      <p className="text-[0.62rem] font-semibold tracking-[0.2em] uppercase text-brand mb-1.5">{label}</p>
      <h3 className="font-heading font-bold text-[1.2rem] tracking-[0.03em] text-foreground mb-7">{title}</h3>
      {children}
    </div>
  )
}

function ColdStart() {
  return (
    <InfographicCard label="01 — The Cold Start Problem" title="Intelligence shouldn't reset every session.">
      <div className="flex-1 grid gap-0" style={{ gridTemplateColumns: "1fr 1px 1fr" }}>
        {/* Without context */}
        <div className="flex flex-col pr-5">
          <p className="text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground mb-3">Without context</p>
          {[0, 1, 2].map((i) => (
            <div key={i}>
              <div className="flex items-end gap-0.5 h-12 mb-0.5">
                <div className="flex-1 rounded-sm" style={{ height: "20%", background: "oklch(0.38 0.003 80)", opacity: 0.35 }} />
                <div className="flex-1 rounded-sm" style={{ height: "54%", background: "oklch(0.38 0.003 80)", opacity: 0.45 }} />
                <div className="flex-1 rounded-sm" style={{ height: "84%", background: "oklch(0.38 0.003 80)", opacity: 0.55 }} />
              </div>
              {i < 2 && <p className="text-[0.58rem] text-muted-foreground mb-1.5">↓ resets to zero</p>}
            </div>
          ))}
          <p className="text-[0.72rem] text-muted-foreground leading-[1.5] mt-auto pt-3 border-t border-border">
            Spend the first 20% of every session re-explaining context.
          </p>
        </div>

        {/* Divider */}
        <div className="bg-border" />

        {/* With PRAXIS */}
        <div className="flex flex-col pl-5">
          <p className="text-[0.6rem] tracking-[0.12em] uppercase text-muted-foreground mb-3">With PRAXIS</p>
          {[
            [0.22, 0.58, 0.90],
            [0.40, 0.74, 0.96],
            [0.62, 0.88, 1.00],
          ].map((heights, i) => (
            <div key={i}>
              <div className="flex items-end gap-0.5 h-12 mb-0.5">
                {heights.map((h, j) => (
                  <div
                    key={j}
                    className="flex-1 rounded-sm"
                    style={{ height: `${h * 100}%`, background: "oklch(0.52 0.165 22)", opacity: 0.5 + i * 0.2 + j * 0.05 }}
                  />
                ))}
              </div>
              {i < 2 && <p className="text-[0.58rem] text-brand opacity-70 mb-1.5">↑ compounds</p>}
            </div>
          ))}
          <p className="text-[0.72rem] text-muted-foreground leading-[1.5] mt-auto pt-3 border-t border-border">
            Every session starts from the <strong className="text-muted-foreground font-medium">last session&apos;s ceiling.</strong>
          </p>
        </div>
      </div>
    </InfographicCard>
  )
}

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
      <div className="flex-1 flex flex-col gap-0.5">
        {contextRows.map(({ name, count, live }) => (
          <div
            key={name}
            className="group flex items-center gap-3 px-3.5 py-2.5 bg-surface border-l-2 border-border hover:border-brand transition-colors duration-200"
          >
            <span className="h-[5px] w-[5px] rounded-full bg-brand opacity-55 flex-shrink-0" />
            <span className="flex-1 text-[0.78rem] text-muted-foreground">{name}</span>
            <span className={`text-[0.68rem] font-semibold tracking-[0.04em] whitespace-nowrap tabular-nums ${live ? "text-brand opacity-70" : "text-muted-foreground"}`}>
              {count}
            </span>
          </div>
        ))}
        <div className="flex items-center gap-3 px-3.5 py-2.5 mt-2" style={{ background: "oklch(0.52 0.165 22 / 0.08)", borderLeft: "2px solid oklch(0.52 0.165 22 / 0.30)" }}>
          <span className="flex-1 text-[0.72rem] font-medium text-muted-foreground">Total context records in production</span>
          <span className="text-[0.72rem] font-semibold text-brand">842+</span>
        </div>
      </div>
    </InfographicCard>
  )
}

const loopNodes = [
  { label: "Observe", sub: "Read context" },
  { label: "Encode", sub: "Update knowledge" },
  { label: "Act", sub: "Build & execute" },
  { label: "Learn", sub: "Capture lessons" },
]

function AgenticLoop() {
  return (
    <InfographicCard label="03 — The Agentic Modeling Loop" title="AI that learns your business over time.">
      <div className="flex-1 flex items-center justify-center py-2">
        <div className="flex items-center justify-center w-full">
          {loopNodes.map(({ label, sub }, i) => (
            <div key={label} className="flex items-center">
              <div className="flex flex-col items-center gap-2.5 flex-1">
                <div
                  className="flex items-center justify-center rounded-full text-[0.6rem] font-semibold tracking-[0.06em] uppercase text-brand transition-all duration-200 hover:scale-105"
                  style={{
                    width: 54,
                    height: 54,
                    border: "1.5px solid oklch(0.52 0.165 22 / 0.30)",
                    background: "oklch(0.52 0.165 22 / 0.10)",
                  }}
                >
                  {label}
                </div>
                <span className="text-[0.62rem] text-muted-foreground text-center leading-[1.4] tracking-[0.04em]">
                  {sub}
                </span>
              </div>
              {i < loopNodes.length - 1 && (
                <span className="text-[0.65rem] text-muted-foreground mx-1 pb-6 flex-shrink-0" aria-hidden="true">→</span>
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="text-[0.78rem] text-muted-foreground leading-[1.65] mt-auto pt-4 border-t border-border">
        Every session ends with encoded learning. Every session starts from a{" "}
        <strong className="text-muted-foreground font-medium">stronger baseline</strong>. The system compounds — it never resets.
      </p>
    </InfographicCard>
  )
}

const smbRows = [
  { label: "Solopreneur", width: "24%", highlight: false, badge: "Simple ops" },
  { label: "SMB Operator", width: "66%", highlight: true, badge: "← PRAXIS" },
  { label: "Enterprise", width: "94%", highlight: false, badge: "Full IT stack" },
]

function SmbGap() {
  return (
    <InfographicCard label="04 — The SMB Intelligence Gap" title="Built for the operators in the middle.">
      <div className="flex-1 flex flex-col gap-4 justify-center">
        {smbRows.map(({ label, width, highlight, badge }) => (
          <div key={label}>
            <div className="flex items-center gap-3.5">
              <span className="text-[0.72rem] text-muted-foreground w-28 text-right flex-shrink-0">{label}</span>
              <div
                className="flex-1 h-2 rounded-sm overflow-hidden"
                style={{ background: highlight ? "oklch(0.52 0.165 22 / 0.07)" : "oklch(0.12 0 0)" }}
              >
                <div
                  className="h-full rounded-sm transition-all"
                  style={{
                    width,
                    background: highlight ? "oklch(0.52 0.165 22)" : "oklch(0.38 0.003 80)",
                    opacity: highlight ? 1 : 0.35,
                  }}
                />
              </div>
              <span
                className={`text-[0.62rem] font-semibold tracking-[0.1em] uppercase w-20 flex-shrink-0 ${highlight ? "text-brand" : "text-muted-foreground"}`}
              >
                {badge}
              </span>
            </div>
            {highlight && (
              <p className="text-[0.72rem] text-muted-foreground mt-1.5 leading-[1.5]" style={{ paddingLeft: "calc(7rem + 3.5rem)" }}>
                Medium complexity. Real operations. No enterprise budget. The gap.
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
