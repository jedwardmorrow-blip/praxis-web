const industries = [
  "Cannabis",
  "Distribution",
  "Specialty Trades",
  "Hospitality",
  "Agriculture",
  "Manufacturing",
  "Logistics",
  "Professional Services",
]

export function Industries() {
  // Duplicate for seamless loop
  const items = [...industries, ...industries]

  return (
    <div
      id="industries"
      className="w-full py-6 border-b border-border overflow-hidden bg-background"
      aria-label="Industries we understand"
      style={{
        maskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
        WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%)",
      }}
    >
      <div className="flex" aria-hidden="true">
        <ul
          className="flex items-center gap-0 list-none m-0 p-0 animate-marquee"
          style={{ width: "max-content" }}
        >
          {items.map((name, i) => (
            <li key={i} className="flex items-center gap-5 px-10 whitespace-nowrap">
              <span className="text-[0.68rem] font-medium tracking-[0.18em] uppercase text-muted-foreground">
                {name}
              </span>
              <span className="h-[3px] w-[3px] rounded-full flex-shrink-0" style={{ background: "oklch(0.95 0 0 / 0.18)" }} aria-hidden="true" />
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
