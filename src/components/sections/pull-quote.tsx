import { FadeUp } from "@/components/motion"

export function PullQuote() {
  return (
    <div
      id="pullquote"
      className="relative w-full px-20 py-28 overflow-hidden max-sm:px-6 max-sm:py-20"
      style={{ background: "oklch(0.52 0.165 22)" }}
    >
      {/* oversized quotation mark — dark on red */}
      <span
        className="pointer-events-none select-none absolute font-heading font-bold leading-none"
        style={{
          top: "-24px",
          left: "56px",
          fontSize: "22rem",
          color: "oklch(0 0 0 / 0.08)",
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <FadeUp fade className="relative z-10 max-w-[960px] mx-auto">
        <p
          className="font-heading font-bold tracking-[0.01em] leading-[1.1]"
          style={{
            fontSize: "clamp(2rem, 4vw, 3.6rem)",
            color: "oklch(0.99 0 0 / 0.90)",
          }}
        >
          &ldquo;We didn&apos;t build CultOps for a portfolio.<br />
          We built it because our operation{" "}
          <em
            className="not-italic"
            style={{ color: "oklch(0.99 0 0)", fontWeight: 700 }}
          >
            would have failed
          </em>{" "}
          without it.&rdquo;
        </p>
        <div className="flex items-center gap-3.5 mt-10">
          <span
            className="block w-8 h-px flex-shrink-0"
            style={{ background: "oklch(0.99 0 0 / 0.30)" }}
            aria-hidden="true"
          />
          <span
            className="text-[0.72rem] font-semibold tracking-[0.15em] uppercase"
            style={{ color: "oklch(0.99 0 0 / 0.55)" }}
          >
            Justin Morrow — Operator and Co-Founder, PRAXIS
          </span>
        </div>
      </FadeUp>
    </div>
  )
}
