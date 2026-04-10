import { FadeUp, Stagger, StaggerItem } from "@/components/motion"

const people = [
  {
    initials: "JM",
    name: "Justin Morrow",
    title: "Operator and Co-Founder",
    bio: "Justin has spent years running operationally complex businesses — managing compliance, distribution, teams, and technology simultaneously across multiple verticals. He built CultOps out of necessity: the tools didn't exist, so he made them. At PRAXIS, he leads product strategy and client engagement, translating operational chaos into intelligent, purpose-built systems.",
    tags: ["Operational Strategy", "Product", "Systems Design", "Distribution"],
  },
  {
    initials: "GD",
    name: "Greg Dunaway",
    title: "Operator and Co-Founder",
    bio: "Greg brings deep experience in business development and organizational strategy. He's worked alongside operators in hospitality, professional services, and specialty industries — helping them understand their businesses more clearly and act on that understanding. At PRAXIS, he leads discovery, client relationships, and the methodology that turns insight into leverage.",
    tags: ["Business Development", "Discovery", "Hospitality", "Org Strategy"],
  },
]

export function People() {
  return (
    <section
      id="people"
      className="w-full px-20 py-28 max-sm:px-6"
      aria-labelledby="people-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeUp>
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
            The People
          </p>
          <h2
            id="people-heading"
            className="font-heading font-bold tracking-[-0.01em] leading-[1.04] text-foreground"
            style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}
          >
            Operators, not consultants.
          </h2>
        </FadeUp>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-0.5 mt-16">
          {people.map((person) => (
            <StaggerItem key={person.initials}>
              <div className="flex flex-col bg-card p-11 h-full">
                <div
                  className="flex items-center justify-center rounded-full mb-6 flex-shrink-0"
                  style={{
                    width: 52,
                    height: 52,
                    background: "oklch(0.12 0 0)",
                    border: "1px solid oklch(0.95 0 0 / 0.11)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    color: "oklch(0.64 0.004 80)",
                    letterSpacing: "0.04em",
                  }}
                  aria-hidden="true"
                >
                  {person.initials}
                </div>
                <h3 className="font-heading font-bold text-[1.5rem] tracking-[0.03em] text-foreground mb-1">
                  {person.name}
                </h3>
                <p className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase text-brand mb-5">
                  {person.title}
                </p>
                <p className="text-[0.9rem] text-muted-foreground leading-[1.75] flex-1">
                  {person.bio}
                </p>
                <div className="flex gap-2 flex-wrap mt-6">
                  {person.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.6rem] font-medium tracking-[0.12em] uppercase text-muted-foreground px-2.5 py-1 border border-border rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
