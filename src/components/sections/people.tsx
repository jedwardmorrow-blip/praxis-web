import { FadeUp, Stagger, StaggerItem } from "@/components/motion"

const people = [
  {
    initials: "JM",
    name: "Justin Morrow",
    title: "Co-Founder & Managing Partner",
    bio: "I didn't come up through product or consulting. I ran operations — cannabis, multi-state, one of the most regulated industries in the country — and I built the software because nothing on the market could do what I needed. CultOps started as an internal tool and became a production platform with 156 tables running live across multiple sites. That's the shape of what I bring to every engagement: someone who's been in the room where decisions actually get made, and who can build the system that makes them faster.",
    tags: ["Product Architecture", "AI Engineering", "Systems Design", "Distribution"],
    contact: "Justin@gopraxis.ai",
  },
  {
    initials: "GD",
    name: "Greg Dunaway",
    title: "Co-Founder & Managing Partner",
    bio: "Fifteen years operating across verticals — hospitality, professional services, specialty industries. Four companies built from scratch, one through Series A, one through acquisition. I've spent my career inside the rooms where operators make hard calls, and I've learned what most consultants never learn: the gap between how an organization is supposed to work and how it actually works is where the real work lives. At PRAXIS, I lead discovery and client relationships — which means I'm usually the first person to sit down and listen.",
    tags: ["Business Development", "Enterprise Sales", "Capital Strategy", "Org Design"],
    contact: "Greg@gopraxis.ai",
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
          <p className="mt-5 text-[1.05rem] text-muted-foreground max-w-[560px] leading-[1.78]">
            We built real things in real operations before we started building for others.
            That&apos;s not a credential — it&apos;s a different way of working.
          </p>
        </FadeUp>

        <Stagger className="grid grid-cols-1 md:grid-cols-2 gap-0.5 mt-16">
          {people.map((person) => (
            <StaggerItem key={person.initials}>
              <div className="flex flex-col bg-card p-12 h-full">
                {/* Avatar */}
                <div
                  className="flex items-center justify-center rounded-full mb-7 flex-shrink-0"
                  style={{
                    width: 56,
                    height: 56,
                    background: "oklch(0.12 0 0)",
                    border: "1px solid oklch(0.95 0 0 / 0.10)",
                    fontFamily: "var(--font-heading)",
                    fontWeight: 700,
                    fontSize: "1.15rem",
                    color: "oklch(0.55 0.004 80)",
                    letterSpacing: "0.04em",
                  }}
                  aria-hidden="true"
                >
                  {person.initials}
                </div>

                {/* Name + title */}
                <h3 className="font-heading font-bold text-[1.6rem] tracking-[0.03em] text-foreground mb-1">
                  {person.name}
                </h3>
                <p className="text-[0.68rem] font-semibold tracking-[0.16em] uppercase text-muted-foreground mb-6">
                  {person.title}
                </p>

                {/* Bio */}
                <p className="text-[0.92rem] text-muted-foreground leading-[1.78] flex-1">
                  {person.bio}
                </p>

                {/* Tags */}
                <div className="flex gap-2 flex-wrap mt-7 pt-6" style={{ borderTop: "1px solid oklch(0.95 0 0 / 0.05)" }}>
                  {person.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[0.6rem] font-medium tracking-[0.12em] uppercase text-muted-foreground px-2.5 py-1 border border-border rounded-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Contact */}
                <p className="mt-4 text-[0.72rem] tracking-[0.06em] text-muted-foreground">
                  {person.contact}
                </p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  )
}
