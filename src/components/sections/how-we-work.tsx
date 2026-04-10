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
            className="font-heading font-bold tracking-[0.02em] leading-[1.05] text-foreground"
            style={{ fontSize: "clamp(2rem, 4.5vw, 3.25rem)" }}
          >
            Three steps. No fluff.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 md:grid-cols-3 gap-0.5 mt-16">
          {steps.map(({ num, title, body }) => (
            <StaggerItem key={num}>
              <div className="group relative p-12 bg-card overflow-hidden h-full">
                {/* animated left rule */}
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
