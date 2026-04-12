import { FadeUp, Stagger, StaggerItem } from "@/components/motion"

const caseStudies = [
  {
    id: "cultops",
    client: "CultOps",
    sector: "Cannabis — Multi-State Operations",
    headline: "We built the software because nothing else could do the job.",
    body: "A multi-site cannabis operation spanning cultivation, manufacturing, distribution, compliance, and retail — simultaneously, in one of the most regulated industries in the country. Off-the-shelf tools weren't built for this. So we built CultOps: a full operational platform in production, running real complexity, every day.",
    proof: [
      { value: "156", label: "tables in production" },
      { value: "12+", label: "operational modules" },
      { value: "10", label: "US states operated in" },
    ],
    note: "Our own product. Built from zero. The first client was ourselves.",
  },
  {
    id: "aspire",
    client: "Powered by Aspire",
    sector: "Hospitality & Professional Services",
    headline: "Thirty years of expertise needed a platform that matched it.",
    body: "Renie Cavallari has spent 30 years engineering revenue behavior for some of the world's most demanding hospitality brands — Four Seasons, Marriott, Auberge, Atlantis. Her work needed positioning and a digital presence that reflected the depth of the practice. We built it: discovery-led, shipped in days.",
    proof: [
      { value: "30", label: "years of operator experience" },
      { value: "9", label: "published books" },
      { value: "days", label: "not months to ship" },
    ],
    note: "Strategy, positioning, custom site, and SEO foundation — all in one engagement.",
  },
]

export function Intelligence() {
  return (
    <section
      id="intelligence"
      className="w-full px-20 py-28 max-sm:px-6"
      aria-labelledby="intelligence-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeUp className="max-w-[640px] mb-18">
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
            Proof of Work
          </p>
          <h2
            id="intelligence-heading"
            className="font-heading font-bold tracking-[-0.01em] leading-[1.04] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            Built by operators.<br />Proven in production.
          </h2>
          <p className="mt-5 text-[1.05rem] text-muted-foreground leading-[1.78]">
            We don&apos;t pitch hypotheticals. Both of these are real — one is our own product
            running in a live operation, the other is a client we shipped for and stand behind.
          </p>
        </FadeUp>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
          {caseStudies.map((cs) => (
            <StaggerItem key={cs.id}>
              <CaseStudyCard {...cs} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function CaseStudyCard({
  client,
  sector,
  headline,
  body,
  proof,
  note,
}: {
  client: string
  sector: string
  headline: string
  body: string
  proof: { value: string; label: string }[]
  note: string
}) {
  return (
    <div
      className="flex flex-col p-11 min-h-[480px]"
      style={{
        background: "oklch(0.115 0 0)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.03)",
      }}
    >
      {/* Header */}
      <div className="mb-8 pb-7" style={{ borderBottom: "1px solid oklch(0.95 0 0 / 0.06)" }}>
        <p
          className="text-[0.58rem] font-medium tracking-[0.18em] uppercase text-muted-foreground mb-2"
        >
          {sector}
        </p>
        <h3
          className="font-heading font-bold tracking-[0.03em] text-foreground"
          style={{ fontSize: "clamp(1.4rem, 2.2vw, 1.9rem)" }}
        >
          {client}
        </h3>
      </div>

      {/* Proof metrics */}
      <div className="grid grid-cols-3 gap-1 mb-8">
        {proof.map(({ value, label }) => (
          <div
            key={label}
            className="flex flex-col"
            style={{
              background: "oklch(0.07 0 0 / 0.5)",
              border: "1px solid oklch(0.95 0 0 / 0.05)",
              padding: "10px 12px 9px",
            }}
          >
            <span
              className="font-heading font-bold leading-none text-foreground"
              style={{
                fontSize: "clamp(1.4rem, 2vw, 1.8rem)",
                letterSpacing: "-0.01em",
                fontFeatureSettings: '"tnum" 1',
              }}
            >
              {value}
            </span>
            <span
              className="text-muted-foreground mt-1.5 leading-[1.35]"
              style={{ fontSize: "0.6rem", letterSpacing: "0.02em" }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Headline + body */}
      <p
        className="font-heading font-bold text-foreground mb-4 leading-[1.12]"
        style={{ fontSize: "clamp(1rem, 1.4vw, 1.2rem)", letterSpacing: "0.02em" }}
      >
        {headline}
      </p>
      <p className="text-[0.88rem] text-muted-foreground leading-[1.72] flex-1">
        {body}
      </p>

      {/* Note */}
      <p
        className="text-muted-foreground mt-7 pt-6 leading-[1.5]"
        style={{
          fontSize: "0.72rem",
          letterSpacing: "0.04em",
          borderTop: "1px solid oklch(0.95 0 0 / 0.05)",
        }}
      >
        {note}
      </p>
    </div>
  )
}
