import { FadeUp, Stagger, StaggerItem } from "@/components/motion"

const steps = [
  {
    num: "01",
    title: "We Listen.",
    body: "Before we write a line of code, we map your operation — how decisions get made, where information lives, where work slows down. We've run operationally complex businesses ourselves. We know the questions to ask and, more importantly, how to hear what you're actually telling us.",
  },
  {
    num: "02",
    title: "We Build Context.",
    body: "Everything we learn gets encoded into a persistent intelligence layer — a Context Database that grows with your operation. Every agent, every session, every build starts from that foundation. Your business is never explained twice.",
  },
  {
    num: "03",
    title: "We Ship.",
    body: "Software, systems, and AI agents built for the exact way your operation runs — not adapted from something built for someone else. Shipped in weeks, not quarters. And because we built context first, everything compounds from day one.",
  },
]

export function HowWeWork() {
  return (
    <section
      id="how"
      className="w-full px-20 py-28 bg-surface max-sm:px-6"
      aria-labelledby="how-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeUp>
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
            How We Work
          </p>
          <h2
            id="how-heading"
            className="font-heading font-bold tracking-[-0.01em] leading-[1.04] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            Three steps. No fluff.
          </h2>
        </FadeUp>

        {/* Flow diagram */}
        <FadeUp delay={0.1} className="mt-16">
          <div
            className="bg-card px-10 py-12 max-sm:px-5 max-sm:py-8"
            style={{ overflowX: "auto" }}
          >
            <FlowDiagram />
          </div>
        </FadeUp>

        {/* Step cards */}
        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-0.5 mt-0.5">
          {steps.map(({ num, title, body }) => (
            <StaggerItem key={num}>
              <div className="group relative p-12 bg-card overflow-hidden h-full">
                <span
                  className="absolute top-0 left-0 w-0.5 h-0 bg-border transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:h-full"
                  aria-hidden="true"
                />
                <div
                  className="font-heading font-bold leading-none tracking-[0.02em] mb-7"
                  style={{ fontSize: "3.5rem", color: "oklch(0.95 0 0 / 0.11)" }}
                >
                  {num}
                </div>
                <h3 className="font-heading font-bold text-[1.5rem] tracking-[0.03em] text-foreground mb-3.5">
                  {title}
                </h3>
                <p className="text-[0.9rem] text-muted-foreground leading-[1.72]">{body}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────────
   Flow diagram: Your operation → PRAXIS → outputs
   ViewBox 760×220. Wider pills to fit real labels.
   Left pills: x=8. Hub: cx=380, cy=110. Right pills: x=624.
   Pill width=130, pill height=40.
───────────────────────────────────────────────────────────── */

const VB_W = 760
const VB_H = 220
const PW   = 130   // pill width
const PH   = 40    // pill height
const LX   = 8     // left pill x origin
const RX   = 622   // right pill x origin
const HCX  = 380   // hub center x
const HCY  = 110   // hub center y
const HR   = 44    // hub radius

const INPUT_PILLS = [
  { label: "DAILY OPS",      sub: "how the work runs",  y: 50  },
  { label: "TEAM KNOWLEDGE", sub: "tacit expertise",    y: 110 },
  { label: "EXISTING TOOLS", sub: "data in motion",     y: 170 },
]
const OUTPUT_PILLS = [
  { label: "CUSTOM SOFTWARE", sub: "for your workflows",  y: 50  },
  { label: "LIVE AI AGENTS",  sub: "not generic prompts", y: 110 },
  { label: "DAILY BRIEFINGS", sub: "this morning's work", y: 170 },
]

const PILL_RE = LX + PW          // 138
const HUB_LE  = HCX - HR         // 336

const INPUT_PATHS = [
  `M ${PILL_RE},50  C 230,50  ${HUB_LE},110 ${HUB_LE},110`,
  `M ${PILL_RE},110 L ${HUB_LE},110`,
  `M ${PILL_RE},170 C 230,170 ${HUB_LE},110 ${HUB_LE},110`,
]

const HUB_RE = HCX + HR          // 424
const OUTPUT_PATHS = [
  `M ${HUB_RE},110 C 490,110 540,50  ${RX},50`,
  `M ${HUB_RE},110 L ${RX},110`,
  `M ${HUB_RE},110 C 490,110 540,170 ${RX},170`,
]

function FlowDiagram() {
  return (
    <svg
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      style={{ width: "100%", minWidth: 500, height: "auto", overflow: "visible" }}
      aria-hidden="true"
    >
      <style>{`
        @keyframes praxis-flow-lr {
          to { stroke-dashoffset: -9; }
        }
        .pf-in  { animation: praxis-flow-lr 2.6s linear infinite; }
        .pf-out { animation: praxis-flow-lr 1.9s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pf-in, .pf-out { animation: none; }
        }
      `}</style>

      <defs>
        <marker id="flow-arr" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
          <polyline
            points="1,1 6,3.5 1,6"
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
        <radialGradient id="hub-radial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.06)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </radialGradient>
      </defs>

      {/* ── Input paths ── */}
      {INPUT_PATHS.map((d, i) => (
        <path
          key={`in-${i}`}
          d={d}
          className="pf-in"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          fill="none"
          markerEnd="url(#flow-arr)"
          style={{ animationDelay: `${i * 0.30}s` }}
        />
      ))}

      {/* ── Output paths ── */}
      {OUTPUT_PATHS.map((d, i) => (
        <path
          key={`out-${i}`}
          d={d}
          className="pf-out"
          stroke="rgba(255,255,255,0.30)"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          fill="none"
          markerEnd="url(#flow-arr)"
          style={{ animationDelay: `${i * 0.30}s` }}
        />
      ))}

      {/* ── Input pills ── */}
      {INPUT_PILLS.map(({ label, sub, y }) => (
        <g key={label}>
          <rect
            x={LX} y={y - PH / 2}
            width={PW} height={PH} rx={3}
            fill="rgba(255,255,255,0.022)"
            stroke="rgba(255,255,255,0.07)"
            strokeWidth="1"
          />
          <text
            x={LX + PW / 2} y={y - 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="0.09em"
            fill="#9A9792"
            fontFamily="Bebas Neue, ui-sans-serif, sans-serif"
          >
            {label}
          </text>
          <text
            x={LX + PW / 2} y={y + 9}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="6"
            letterSpacing="0.04em"
            fill="#4A4745"
            fontFamily="Inter, sans-serif"
          >
            {sub}
          </text>
        </g>
      ))}

      {/* ── Output pills ── */}
      {OUTPUT_PILLS.map(({ label, sub, y }) => (
        <g key={label}>
          <rect
            x={RX} y={y - PH / 2}
            width={PW} height={PH} rx={3}
            fill="rgba(255,255,255,0.035)"
            stroke="rgba(255,255,255,0.12)"
            strokeWidth="1"
          />
          <text
            x={RX + PW / 2} y={y - 4}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8.5"
            fontWeight="700"
            letterSpacing="0.09em"
            fill="oklch(0.88 0.004 80)"
            fontFamily="Bebas Neue, ui-sans-serif, sans-serif"
          >
            {label}
          </text>
          <text
            x={RX + PW / 2} y={y + 9}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="6"
            letterSpacing="0.04em"
            fill="#6B6865"
            fontFamily="Inter, sans-serif"
          >
            {sub}
          </text>
        </g>
      ))}

      {/* ── Hub glow ── */}
      <circle cx={HCX} cy={HCY} r={HR + 18} fill="url(#hub-radial)" />

      {/* ── Hub outer ring ── */}
      <circle
        cx={HCX} cy={HCY} r={HR + 9}
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
        strokeDasharray="2 4"
      />

      {/* ── Hub main circle ── */}
      <circle
        cx={HCX} cy={HCY} r={HR}
        fill="rgba(255,255,255,0.04)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.5"
      />
      <text
        x={HCX} y={HCY - 7}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fontWeight="700"
        letterSpacing="0.06em"
        fill="oklch(0.88 0.004 80)"
        fontFamily="Bebas Neue, ui-sans-serif, sans-serif"
      >
        PRAXIS
      </text>
      <text
        x={HCX} y={HCY + 8}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="6"
        letterSpacing="0.13em"
        fill="#6B6865"
        fontFamily="Inter, sans-serif"
      >
        CONTEXT DB
      </text>
    </svg>
  )
}
