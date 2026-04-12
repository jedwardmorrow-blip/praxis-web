import { FadeUp, Stagger, StaggerItem } from "@/components/motion"

const problems = [
  {
    num: "01",
    title: "Your operation runs on one person",
    body: "There's someone on your team who knows how everything actually works — the routing logic, the vendor relationships, the exceptions the software can't handle. When they're out, things slow down. When they leave, things break. That knowledge should live in a system, not a person.",
  },
  {
    num: "02",
    title: "Your 'system' is five tools and three spreadsheets",
    body: "A dispatch tool that doesn't talk to accounting. A CRM that doesn't connect to field ops. Spreadsheets bridging the gaps between them. Someone exports a file on Friday and re-enters it Monday morning. The data exists — moving it between systems is just a job nobody hired for.",
  },
  {
    num: "03",
    title: "You find out what happened last month",
    body: "Margin by job. Delivery performance. Which accounts are actually worth keeping. If these numbers require a manual pull or waiting for accounting to close, you're making decisions on lag. By the time you see the data, the moment to act on it is already gone.",
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
              You built something real. Your tools didn&apos;t keep up.
            </h2>
            <p className="mt-5 text-[1.05rem] text-muted-foreground leading-[1.78] max-w-[580px]">
              Most software is built for businesses that are either very small or very
              large. If you&apos;re running 20 to 100 people — with real workflows, real
              teams, real stakes — you&apos;ve outgrown simple tools but you&apos;re not
              big enough for enterprise. So you patch. And the patchwork has a cost.
            </p>
          </FadeUp>

          <Stagger className="flex flex-col gap-0.5">
            {problems.map(({ num, title, body }) => (
              <StaggerItem key={num}>
                <div className="group p-7 bg-card border-l-2 border-border hover:border-foreground/15 hover:bg-card-hover transition-all duration-200">
                  <p className="text-[0.65rem] font-semibold tracking-[0.16em] text-muted-foreground mb-2.5">{num}</p>
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
