import { FadeUp, Stagger, StaggerItem } from "@/components/motion"

const steps = [
  {
    num: "01",
    title: "We Listen.",
    body: "Before we write a line of code, we map your operation. Your team structure. Your workflows. Your constraints. Your goals. We've run operationally complex businesses — we know what to ask and how to hear the answer.",
  },
  {
    num: "02",
    title: "We Build Context.",
    body: "Everything we learn gets encoded into a persistent intelligence layer — a Context Database that compounds over time. AI agents read it before every session. Your business is never explained twice.",
  },
  {
    num: "03",
    title: "We Ship.",
    body: "Software, systems, and AI agents built specifically for your operation. Not templates, not off-the-shelf. Purpose-built tools that fit how your business actually runs — and scale with it.",
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
                  className="absolute top-0 left-0 w-0.5 h-0 bg-brand transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:h-full"
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
   ViewBox 716×200. Pill width=116, pill height=36.
   Left pills: x=10. Hub: cx=358, cy=100. Right pills: x=590.
───────────────────────────────────────────────────────────── */

const VB_W = 716
const VB_H = 200
const PW   = 116   // pill width
const PH   = 36    // pill height
const LX   = 10    // left pill x origin
const RX   = 590   // right pill x origin
const HCX  = 358   // hub center x
const HCY  = 100   // hub center y
const HR   = 40    // hub radius

const INPUT_PILLS  = [
  { label: "YOUR OPS",   y: 44  },
  { label: "YOUR TEAM",  y: 100 },
  { label: "YOUR TOOLS", y: 156 },
]
const OUTPUT_PILLS = [
  { label: "SOFTWARE",     y: 44  },
  { label: "AI AGENTS",    y: 100 },
  { label: "INTELLIGENCE", y: 156 },
]

// Left pill right edge → hub left edge
const PILL_RE  = LX + PW          // 126
const HUB_LE   = HCX - HR         // 318

// Paths from input pills to hub (converging)
const INPUT_PATHS = [
  `M ${PILL_RE},44  C 210,44  ${HUB_LE},100 ${HUB_LE},100`,
  `M ${PILL_RE},100 L ${HUB_LE},100`,
  `M ${PILL_RE},156 C 210,156 ${HUB_LE},100 ${HUB_LE},100`,
]

// Hub right edge → right pills (diverging)
const HUB_RE   = HCX + HR         // 398
// Paths from hub to output pills
const OUTPUT_PATHS = [
  `M ${HUB_RE},100 C 460,100 510,44  ${RX},44`,
  `M ${HUB_RE},100 L ${RX},100`,
  `M ${HUB_RE},100 C 460,100 510,156 ${RX},156`,
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
        .pf-in  { animation: praxis-flow-lr 2.4s linear infinite; }
        .pf-out { animation: praxis-flow-lr 1.8s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .pf-in, .pf-out { animation: none; }
        }
      `}</style>

      <defs>
        <marker id="flow-arr" markerWidth="7" markerHeight="7" refX="5.5" refY="3.5" orient="auto">
          <polyline
            points="1,1 6,3.5 1,6"
            stroke="#C8433A"
            strokeWidth="1.5"
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.55"
          />
        </marker>
      </defs>

      {/* ── Input paths (converging into hub) ── */}
      {INPUT_PATHS.map((d, i) => (
        <path
          key={`in-${i}`}
          d={d}
          className="pf-in"
          stroke="#C8433A"
          strokeOpacity="0.30"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          fill="none"
          markerEnd="url(#flow-arr)"
          style={{ animationDelay: `${i * 0.28}s` }}
        />
      ))}

      {/* ── Output paths (diverging from hub) ── */}
      {OUTPUT_PATHS.map((d, i) => (
        <path
          key={`out-${i}`}
          d={d}
          className="pf-out"
          stroke="#C8433A"
          strokeOpacity="0.48"
          strokeWidth="1.5"
          strokeDasharray="5 4"
          fill="none"
          markerEnd="url(#flow-arr)"
          style={{ animationDelay: `${i * 0.28}s` }}
        />
      ))}

      {/* ── Input pills ── */}
      {INPUT_PILLS.map(({ label, y }) => (
        <g key={label}>
          <rect
            x={LX} y={y - PH / 2}
            width={PW} height={PH} rx={3}
            fill="rgba(255,255,255,0.025)"
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="1"
          />
          <text
            x={LX + PW / 2} y={y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fontWeight="600"
            letterSpacing="0.09em"
            fill="#9A9792"
            fontFamily="Oswald, sans-serif"
          >
            {label}
          </text>
        </g>
      ))}

      {/* ── Output pills ── */}
      {OUTPUT_PILLS.map(({ label, y }) => (
        <g key={label}>
          <rect
            x={RX} y={y - PH / 2}
            width={PW} height={PH} rx={3}
            fill="rgba(200,67,58,0.06)"
            stroke="rgba(200,67,58,0.22)"
            strokeWidth="1"
          />
          <text
            x={RX + PW / 2} y={y + 1}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="8"
            fontWeight="600"
            letterSpacing="0.09em"
            fill="#C8433A"
            fontFamily="Oswald, sans-serif"
            opacity="0.9"
          >
            {label}
          </text>
        </g>
      ))}

      {/* ── Hub ── */}
      {/* Outer glow ring */}
      <circle
        cx={HCX} cy={HCY} r={HR + 8}
        fill="none"
        stroke="rgba(200,67,58,0.10)"
        strokeWidth="1"
        strokeDasharray="2 3"
      />
      {/* Main hub circle */}
      <circle
        cx={HCX} cy={HCY} r={HR}
        fill="rgba(200,67,58,0.12)"
        stroke="rgba(200,67,58,0.55)"
        strokeWidth="1.5"
      />
      <text
        x={HCX} y={HCY - 5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="13"
        fontWeight="700"
        letterSpacing="0.06em"
        fill="#C8433A"
        fontFamily="Oswald, sans-serif"
      >
        PRAXIS
      </text>
      <text
        x={HCX} y={HCY + 10}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="6"
        letterSpacing="0.12em"
        fill="#9A9792"
        fontFamily="Inter, sans-serif"
      >
        CONTEXT DB
      </text>
    </svg>
  )
}
