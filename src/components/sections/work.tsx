import { FadeUp, Stagger, StaggerItem } from "@/components/motion"

const workItems = [
  {
    id: "cultops",
    tag: "Operational Software",
    title: "CultOps",
    body: "Our own product. We ran a multi-site operation spanning agriculture, manufacturing, distribution, compliance, and retail — simultaneously — in one of the most regulated industries in the country. CultOps is what we built to survive it: a full operational platform that replaced a stack of tools that were never designed to work together.",
    tags: ["Agriculture", "Manufacturing", "Distribution", "Compliance", "Inventory"],
    gradient: "linear-gradient(140deg, #0c0a09 0%, #1a0d0b 100%)",
    visual: "cultops",
  },
  {
    id: "aspire",
    tag: "Strategy & Web",
    title: "Powered by Aspire",
    body: "A positioning and web project for a professional development firm targeting hospitality leadership. We mapped the audience, built the strategy, and shipped a site designed to attract the operators Aspire's curriculum is built for. Discovery-led, strategic through to launch.",
    tags: ["Hospitality", "Professional Services", "Strategy", "Web"],
    gradient: "linear-gradient(140deg, #090c0a 0%, #0b140d 100%)",
    visual: "aspire",
  },
]

export function Work() {
  return (
    <section
      id="work"
      className="w-full px-20 py-28 bg-surface max-sm:px-6"
      aria-labelledby="work-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeUp>
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
            Our Work
          </p>
          <h2
            id="work-heading"
            className="font-heading font-bold tracking-[0.02em] leading-[1.05] text-foreground"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
          >
            What we&apos;ve built.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-0.5 mt-16">
          {workItems.map((item) => (
            <StaggerItem key={item.id}>
              <WorkCard {...item} />
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}

function WorkCard({
  tag, title, body, tags, gradient, visual,
}: {
  tag: string; title: string; body: string; tags: string[]; gradient: string; visual: string
}) {
  return (
    <div className="group flex flex-col bg-card hover:bg-card-hover transition-colors duration-200 overflow-hidden">
      {/* Visual */}
      <div className="h-[220px] flex items-center justify-center relative overflow-hidden" style={{ background: gradient }}>
        {visual === "cultops" ? <CultopsPreview /> : <AspirePreview />}
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-9">
        <p className="text-[0.62rem] font-semibold tracking-[0.18em] uppercase text-brand mb-2.5">{tag}</p>
        <h3 className="font-heading font-bold text-[1.35rem] tracking-[0.03em] text-foreground mb-3">{title}</h3>
        <p className="text-[0.88rem] text-muted-foreground leading-[1.72] flex-1">{body}</p>
        <div className="flex gap-2 flex-wrap mt-5 pt-5 border-t border-border">
          {tags.map((t) => (
            <span
              key={t}
              className="text-[0.62rem] font-medium tracking-[0.1em] uppercase text-muted-foreground px-2.5 py-1 border border-border rounded-sm"
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}

function CultopsPreview() {
  return (
    <div
      className="flex flex-col"
      style={{
        width: "80%", height: "75%",
        border: "1px solid oklch(0.52 0.165 22 / 0.20)",
        borderRadius: "3px",
        background: "oklch(0.52 0.165 22 / 0.03)",
        padding: "12px",
        gap: "8px",
        boxShadow: "0 0 40px oklch(0.52 0.165 22 / 0.06)",
      }}
    >
      <div className="flex items-center gap-1.5 mb-1">
        {[1, 0.5, 0.25].map((op, i) => (
          <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: "oklch(0.52 0.165 22)", opacity: op }} />
        ))}
        <span className="flex-1 h-0.5 rounded-sm" style={{ background: "oklch(0.52 0.165 22 / 0.15)" }} />
      </div>
      <div className="flex flex-col gap-1 flex-1">
        {[
          { accent: true, w: "80%" }, { accent: false, w: "100%" }, { accent: false, w: "100%" },
          { accent: true, w: "55%" }, { accent: false, w: "100%" },
          { accent: true, w: "72%" }, { accent: false, w: "100%" }, { accent: false, w: "60%" },
        ].map(({ accent, w }, i) => (
          <div
            key={i}
            className="h-1.5 rounded-sm"
            style={{
              width: w,
              background: accent ? "oklch(0.52 0.165 22 / 0.14)" : "oklch(0.95 0 0 / 0.04)",
            }}
          />
        ))}
      </div>
    </div>
  )
}

function AspirePreview() {
  return (
    <span
      className="font-heading font-bold tracking-[0.18em] uppercase"
      style={{ fontSize: "1.4rem", color: "oklch(0.95 0.009 85 / 0.10)" }}
    >
      ASPIRE
    </span>
  )
}
