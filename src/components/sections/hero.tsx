import Link from "next/link"
import { FadeUp } from "@/components/motion"

export function Hero() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-center px-20 pt-28 pb-20 overflow-hidden max-sm:px-6"
      aria-label="Hero"
    >
      {/* dot-grid texture */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          backgroundImage: "radial-gradient(oklch(0.95 0 0 / 0.032) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col">
        {/* Wordmark */}
        <FadeUp className="mb-12">
          <div className="flex items-end leading-none">
            <span
              className="font-heading font-bold tracking-[0.05em] leading-[0.88] text-foreground"
              style={{ fontSize: "clamp(72px, 13vw, 148px)" }}
            >
              PRAXIS
            </span>
            <span
              className="rounded-full bg-brand flex-shrink-0 ml-2"
              style={{
                width: "clamp(10px, 1.6vw, 20px)",
                height: "clamp(10px, 1.6vw, 20px)",
                marginBottom: "clamp(4px, 0.6vw, 9px)",
              }}
              aria-hidden="true"
            />
          </div>
          <p
            className="font-heading font-bold uppercase tracking-[0.48em] text-muted-foreground mt-4"
            style={{ fontSize: "clamp(10px, 1.1vw, 14px)" }}
          >
            Operational Intelligence
          </p>
        </FadeUp>

        {/* Headline */}
        <FadeUp delay={0.1}>
          <h1
            className="font-heading font-bold tracking-[-0.01em] leading-[1.03] text-foreground mb-6"
            style={{ fontSize: "clamp(2.4rem, 4.8vw, 4.6rem)" }}
          >
            We don&apos;t write reports.<br />
            We build the software.
          </h1>
        </FadeUp>

        {/* Copy */}
        <FadeUp delay={0.18}>
          <p className="text-[1.05rem] text-muted-foreground max-w-[500px] leading-[1.78] mb-11">
            We work with operators running medium-complex businesses — the ones who&apos;ve outgrown
            their tools but haven&apos;t yet built the systems they actually need.
          </p>
        </FadeUp>

        {/* CTAs */}
        <FadeUp delay={0.24} className="flex items-center gap-3 flex-wrap">
          <Link
            href="#intake"
            className="inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-[0.78rem] font-semibold tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 hover:-translate-y-px no-underline"
          >
            Tell us about your operation
          </Link>
          <Link
            href="#how"
            className="inline-flex items-center gap-2 bg-transparent border border-border hover:border-foreground/25 text-muted-foreground hover:text-foreground text-[0.78rem] font-medium tracking-[0.1em] uppercase px-8 py-4 transition-all duration-200 no-underline"
          >
            How it works
          </Link>
        </FadeUp>
      </div>

      {/* Scroll hint */}
      <div
        className="absolute bottom-11 left-20 flex items-center gap-3 text-[0.68rem] tracking-[0.18em] uppercase text-muted-foreground max-sm:left-6"
        aria-hidden="true"
      >
        <span className="block w-7 h-px bg-muted-foreground/50" />
        Scroll
      </div>
    </section>
  )
}
