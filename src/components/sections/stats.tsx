import { Stagger, StaggerItem } from "@/components/motion"

const stats = [
  { number: "842", suffix: "+", label: "Business context records encoded in production" },
  { number: "196", suffix: "",  label: "Knowledge graph entities mapped across one operation" },
  { number: "12",  suffix: "+", label: "Operational modules shipped in CultOps" },
  { number: "5",   suffix: "yrs", label: "In the field before we sold a single engagement" },
]

export function Stats() {
  return (
    <div
      id="stats"
      className="w-full bg-surface border-b border-border"
      aria-label="By the numbers"
    >
      <Stagger className="grid grid-cols-2 md:grid-cols-4 border-l border-border">
        {stats.map(({ number, suffix, label }) => (
          <StaggerItem key={label}>
            <div className="group relative p-10 border-r border-t border-border overflow-hidden max-sm:p-7">
              {/* accent left rule on hover */}
              <span className="absolute top-0 left-0 w-0.5 h-0 bg-border transition-all duration-400 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:h-full" aria-hidden="true" />
              <div className="font-heading font-bold leading-none tracking-[0.02em] text-foreground" style={{ fontSize: "clamp(2.2rem, 3.5vw, 3rem)" }}>
                {number}
                <span className="text-muted-foreground" style={{ fontSize: "0.65em" }}>{suffix}</span>
              </div>
              <p className="mt-2.5 text-[0.72rem] text-muted-foreground leading-[1.5] tracking-[0.06em]">
                {label}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </div>
  )
}
