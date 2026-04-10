import { FadeUp, Stagger, StaggerItem } from "@/components/motion"

const problems = [
  {
    num: "01",
    title: "You're running on tribal knowledge",
    body: "Critical information lives in people's heads, not systems. When someone leaves, the knowledge leaves with them.",
  },
  {
    num: "02",
    title: "Your tools don't talk to each other",
    body: "Spreadsheets bridging software gaps. Manual exports. Duplicate data. Your team spends hours on work that should take minutes.",
  },
  {
    num: "03",
    title: "You can't see your business clearly",
    body: "Decisions made on gut and lag. No single source of truth. No operational intelligence — just noise.",
  },
]

export function Problem() {
  return (
    <section
      id="problem"
      className="w-full px-20 py-28 max-sm:px-6"
      aria-labelledby="problem-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeUp>
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
            The Problem
          </p>
        </FadeUp>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-start mt-16 max-md:gap-10">
          <FadeUp>
            <h2
              id="problem-heading"
              className="font-heading font-bold tracking-[-0.01em] leading-[1.04] text-foreground"
              style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
            >
              Your operation has outgrown your tools.
            </h2>
            <p className="mt-5 text-[1.05rem] text-muted-foreground leading-[1.78] max-w-[580px]">
              Most software is built for businesses that are either very small or very large. If
              you&apos;re running something in between — with real complexity, real teams, real stakes —
              you&apos;re patching together tools that were never designed for you.
            </p>
          </FadeUp>

          <Stagger className="flex flex-col gap-0.5">
            {problems.map(({ num, title, body }) => (
              <StaggerItem key={num}>
                <div className="group p-7 bg-card border-l-2 border-border hover:border-brand/30 hover:bg-card-hover transition-all duration-200">
                  <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-brand mb-2.5">{num}</p>
                  <h3 className="font-heading font-bold text-[1rem] tracking-[0.04em] text-foreground mb-2">
                    {title}
                  </h3>
                  <p className="text-[0.88rem] text-muted-foreground leading-[1.7]">{body}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </section>
  )
}
