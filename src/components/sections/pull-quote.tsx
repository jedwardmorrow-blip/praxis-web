import { FadeUp } from "@/components/motion"

export function PullQuote() {
  return (
    <div
      id="pullquote"
      className="relative w-full px-20 py-24 bg-surface border-t border-b border-border overflow-hidden max-sm:px-6 max-sm:py-16"
    >
      {/* oversized quotation mark */}
      <span
        className="pointer-events-none select-none absolute font-heading font-bold leading-none"
        style={{
          top: "-20px",
          left: "60px",
          fontSize: "20rem",
          color: "oklch(0.52 0.165 22 / 0.06)",
          zIndex: 0,
        }}
        aria-hidden="true"
      >
        &ldquo;
      </span>

      <FadeUp className="relative z-10 max-w-[900px] mx-auto">
        <p
          className="font-heading font-bold tracking-[0.02em] leading-[1.15] text-foreground mb-8"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.5rem)" }}
        >
          &ldquo;We didn&apos;t build CultOps for a portfolio.<br />
          We built it because our operation{" "}
          <em className="not-italic text-brand">would have failed</em> without it.&rdquo;
        </p>
        <div className="flex items-center gap-3.5">
          <span className="block w-7 h-px bg-muted-foreground/40" aria-hidden="true" />
          <span className="text-[0.72rem] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
            Justin Morrow — Operator and Co-Founder, PRAXIS
          </span>
        </div>
      </FadeUp>
    </div>
  )
}
