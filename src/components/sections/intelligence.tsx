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
    <div className="relative flex flex-col bg-card p-11 min-h-[420px] overflow-hidden">
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

/* ─────────────────────────────────────────────
   01 — Cold Start  (terminal log two-column)
───────────────────────────────────────────── */
const coldStartSessions = [
  {
    id: "S1",
    without: ["init context...", "no prior data found", "starting from 0%"],
    with: {
      lines: ["loading context DB...", "196 nodes, 83 rules ✓", "ready at baseline"],
      bOpacity: 0.45,
    },
  },
  {
    id: "S2",
    without: ["init context...", "no prior data found", "starting from 0%"],
    with: {
      lines: ["context DB: +14 nodes", "prev ceiling loaded", "↑ compounding"],
      bOpacity: 0.70,
    },
  },
  {
    id: "S3",
    without: ["init context...", "no prior data found", "starting from 0%"],
    with: {
      lines: ["context DB: +29 nodes", "peak context loaded", "↑ maximum intel"],
      bOpacity: 0.95,
    },
  },
]

function ColdStart() {
  return (
    <InfographicCard label="01 — The Cold Start Problem" title="Intelligence shouldn't reset every session.">
      <div className="flex-1 grid gap-0" style={{ gridTemplateColumns: "1fr 1px 1fr" }}>

        {/* Left: Without */}
        <div className="flex flex-col pr-5">
          <p className="text-[0.58rem] tracking-[0.14em] uppercase mb-3" style={{ color: "#55524F" }}>
            Without PRAXIS
          </p>
          <div className="flex-1 flex flex-col justify-between gap-1.5">
            {coldStartSessions.map(({ id, without }, i) => (
              <div key={id} className="flex flex-col gap-0.5">
                <div
                  className="px-2.5 py-2"
                  style={{
                    background: "oklch(0.10 0 0)",
                    borderLeft: "2px solid oklch(0.38 0.003 80 / 0.22)",
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <div className="text-[0.6rem] leading-[1.7]" style={{ color: "oklch(0.38 0.003 80 / 0.45)" }}>
                    {id}
                  </div>
                  {without.map((line, j) => (
                    <div
                      key={j}
                      className="text-[0.6rem] leading-[1.7] pl-3"
                      style={{ color: j === 2 ? "oklch(0.38 0.003 80 / 0.35)" : "oklch(0.50 0 0 / 0.65)" }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
                {i < 2 && (
                  <div className="text-center text-[0.55rem]" style={{ color: "oklch(0.38 0.003 80 / 0.32)" }}>
                    ↓ reset
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-[0.68rem] leading-[1.55] mt-4 pt-3 border-t border-border" style={{ color: "#55524F" }}>
            20% overhead re-explaining context every session.
          </p>
        </div>

        {/* Divider */}
        <div className="bg-border" />

        {/* Right: With PRAXIS */}
        <div className="flex flex-col pl-5">
          <p className="text-[0.58rem] tracking-[0.14em] uppercase mb-3" style={{ color: "#55524F" }}>
            With PRAXIS
          </p>
          <div className="flex-1 flex flex-col justify-between gap-1.5">
            {coldStartSessions.map(({ id, with: w }, i) => (
              <div key={id} className="flex flex-col gap-0.5">
                <div
                  className="px-2.5 py-2"
                  style={{
                    background: "oklch(0.52 0.165 22 / 0.05)",
                    borderLeft: `2px solid rgba(200,67,58,${w.bOpacity * 0.45})`,
                    fontFamily: "var(--font-mono)",
                  }}
                >
                  <div
                    className="text-[0.6rem] leading-[1.7]"
                    style={{ color: `rgba(200,67,58,${w.bOpacity * 0.85})` }}
                  >
                    {id}
                  </div>
                  {w.lines.map((line, j) => (
                    <div
                      key={j}
                      className="text-[0.6rem] leading-[1.7] pl-3"
                      style={{
                        color: j === 1
                          ? `rgba(200,67,58,${w.bOpacity * 0.95})`
                          : "oklch(0.64 0.004 80 / 0.65)",
                      }}
                    >
                      {line}
                    </div>
                  ))}
                </div>
                {i < 2 && (
                  <div
                    className="text-center text-[0.55rem]"
                    style={{ color: `rgba(200,67,58,${w.bOpacity * 0.6})` }}
                  >
                    ↑ compounds
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="text-[0.68rem] leading-[1.55] mt-4 pt-3 border-t border-border" style={{ color: "#55524F" }}>
            Every session starts from the{" "}
            <strong style={{ color: "oklch(0.64 0.004 80)" }}>last session&apos;s ceiling.</strong>
          </p>
        </div>
      </div>
    </InfographicCard>
  )
}

/* ─────────────────────────────────────────────
   02 — Context DB  (unchanged from pass 1)
───────────────────────────────────────────── */
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
                style={{
                  background: live ? "oklch(0.52 0.165 22)" : "oklch(0.38 0.003 80)",
                  opacity: live ? 0.8 : 0.4,
                }}
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

/* ─────────────────────────────────────────────
   03 — Agentic Loop  (SVG circular diagram)
───────────────────────────────────────────── */

// Pre-computed arc paths for a clockwise circular flow.
// Nodes at compass points within a 280×260 viewBox:
//   Observe (140, 48)  Encode (222, 130)  Act (140, 212)  Learn (58, 130)
// Each arc hugs the outer corner between adjacent nodes.
const LOOP_ARCS = [
  "M 166,40 Q 268,8 229,106",   // Observe → Encode  (via top-right corner)
  "M 227,155 Q 268,252 163,210", // Encode  → Act     (via bottom-right corner)
  "M 117,210 Q 12,252 73,155",  // Act     → Learn   (via bottom-left corner)
  "M 51,105 Q 12,8 111,40",     // Learn   → Observe (via top-left corner)
]

const LOOP_NODES = [
  { label: "OBSERVE", sub: "Read context",      x: 140, y: 48  },
  { label: "ENCODE",  sub: "Update knowledge",  x: 222, y: 130 },
  { label: "ACT",     sub: "Build & execute",   x: 140, y: 212 },
  { label: "LEARN",   sub: "Capture lessons",   x: 58,  y: 130 },
]

function AgenticLoop() {
  return (
    <InfographicCard label="03 — The Agentic Modeling Loop" title="AI that learns your business over time.">
      <div className="flex-1 flex items-center justify-center py-2">
        <svg
          viewBox="0 0 280 260"
          style={{ width: "100%", maxWidth: 280, height: "auto" }}
          aria-hidden="true"
        >
          <defs>
            {/* Open chevron arrowhead */}
            <marker
              id="praxis-loop-arrow"
              markerWidth="7"
              markerHeight="7"
              refX="5.5"
              refY="3.5"
              orient="auto"
            >
              <polyline
                points="1,1 6,3.5 1,6"
                stroke="#C8433A"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.7"
              />
            </marker>
          </defs>

          {/* Dashed arcs */}
          {LOOP_ARCS.map((d, i) => (
            <path
              key={i}
              d={d}
              stroke="#C8433A"
              strokeOpacity="0.38"
              strokeWidth="1.5"
              strokeDasharray="5 3.5"
              fill="none"
              markerEnd="url(#praxis-loop-arrow)"
            />
          ))}

          {/* Node circles */}
          {LOOP_NODES.map(({ label, sub, x, y }) => (
            <g key={label}>
              <circle
                cx={x}
                cy={y}
                r={27}
                fill="rgba(200,67,58,0.09)"
                stroke="rgba(200,67,58,0.35)"
                strokeWidth="1.5"
              />
              <text
                x={x}
                y={y - 3}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="7.5"
                fontWeight="700"
                letterSpacing="0.07em"
                fill="#C8433A"
                fontFamily="Oswald, sans-serif"
              >
                {label}
              </text>
              <text
                x={x}
                y={y + 9}
                textAnchor="middle"
                dominantBaseline="middle"
                fontSize="6.5"
                fill="#9A9792"
                letterSpacing="0.02em"
                fontFamily="Inter, sans-serif"
              >
                {sub}
              </text>
            </g>
          ))}

          {/* Center label */}
          <text x="140" y="125" textAnchor="middle" fontSize="6" letterSpacing="0.14em" fill="#55524F" opacity="0.5" fontFamily="Inter, sans-serif">YOUR</text>
          <text x="140" y="136" textAnchor="middle" fontSize="6" letterSpacing="0.14em" fill="#55524F" opacity="0.5" fontFamily="Inter, sans-serif">OPERATION</text>
        </svg>
      </div>
      <p className="text-[0.78rem] text-muted-foreground leading-[1.65] pt-4 border-t border-border">
        Every session ends with encoded learning. Every session starts from a{" "}
        <strong className="text-muted-foreground font-medium">stronger baseline</strong>. The system compounds — it never resets.
      </p>
    </InfographicCard>
  )
}

/* ─────────────────────────────────────────────
   04 — SMB Gap  (bar chart with grid lines)
───────────────────────────────────────────── */
const smbRows = [
  { label: "Solopreneur", pct: 22, highlight: false, badge: "Simple ops" },
  { label: "SMB Operator", pct: 65, highlight: true,  badge: "← PRAXIS"  },
  { label: "Enterprise",   pct: 94, highlight: false, badge: "Full IT stack" },
]

function SmbGap() {
  return (
    <InfographicCard label="04 — The SMB Intelligence Gap" title="Built for the operators in the middle.">
      <div className="flex-1 flex flex-col gap-5 justify-center">

        {/* Grid lines + bars */}
        <div className="relative">
          {/* Dashed vertical grid lines */}
          {[25, 50, 75].map((pct) => (
            <div
              key={pct}
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{
                left: `calc(7rem + 1rem + ${pct}% * (100% - 8rem) / 100)`,
                borderLeft: "1px dashed oklch(0.95 0 0 / 0.045)",
              }}
              aria-hidden="true"
            />
          ))}

          {smbRows.map(({ label, pct, highlight, badge }, idx) => (
            <div key={label} className={idx > 0 ? "mt-5" : ""}>
              <div className="flex items-center gap-4">
                <span className="text-[0.72rem] text-muted-foreground w-28 text-right flex-shrink-0 tracking-[0.02em]">
                  {label}
                </span>
                <div className="flex-1">
                  <div
                    className="h-3 rounded-sm overflow-hidden"
                    style={{ background: highlight ? "oklch(0.52 0.165 22 / 0.07)" : "oklch(0.12 0 0)" }}
                  >
                    <div
                      className="h-full rounded-sm"
                      style={{
                        width: `${pct}%`,
                        background: highlight ? "oklch(0.52 0.165 22)" : "oklch(0.38 0.003 80)",
                        opacity: highlight ? 1 : 0.3,
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-1">
                    <span
                      className="text-[0.6rem] font-semibold tracking-[0.08em] uppercase"
                      style={{ color: highlight ? "#C8433A" : "#55524F" }}
                    >
                      {badge}
                    </span>
                    <span
                      className="text-[0.6rem] tabular-nums"
                      style={{ color: highlight ? "rgba(200,67,58,0.55)" : "#55524F" }}
                    >
                      {pct}%
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
        </div>

        {/* Axis label */}
        <p className="text-[0.6rem] tracking-[0.1em] uppercase text-muted-foreground text-center border-t border-border pt-4 mt-1">
          Operational Complexity → Intelligence Capability
        </p>
      </div>
    </InfographicCard>
  )
}
