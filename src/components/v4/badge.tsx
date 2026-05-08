// Praxis brand mark, V4. The teeth and the rings are SVG primitives.
// Animated where used (header pulse, hero stamp-in). Pure server-rendered.

type Props = {
  variant?: "static" | "stamp"
  className?: string
}

export function Badge({ variant = "static", className }: Props) {
  // The teeth pattern is a single rect rotated through twelve positions.
  const teeth = (idAttr: string) =>
    [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) =>
      i === 0 ? (
        <g key={i} id={idAttr}>
          <rect x="174" y="0" width="12" height="14" />
        </g>
      ) : (
        <use key={i} href={`#${idAttr}`} transform={`rotate(${deg} 180 180)`} />
      )
    )

  if (variant === "stamp") {
    return (
      <svg viewBox="0 0 360 360" className={className} aria-hidden>
        <circle cx="180" cy="180" r="172" fill="#C9A24B" />
        <g fill="#C9A24B">{teeth("thb")}</g>
        <circle cx="180" cy="180" r="158" fill="#0a2545" />
        <circle
          className="ring-anim"
          cx="180"
          cy="180"
          r="158"
          fill="none"
          stroke="#C9A24B"
          strokeWidth="3"
          pathLength="1000"
        />
        <circle className="center-dot" cx="180" cy="180" r="50" fill="#C42130" />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 360 360" className={className} aria-hidden>
      <circle cx="180" cy="180" r="172" fill="#C9A24B" />
      <g fill="#C9A24B">{teeth("th")}</g>
      <circle cx="180" cy="180" r="158" fill="#0a2545" stroke="#C9A24B" strokeWidth="3" />
      <circle cx="180" cy="180" r="50" fill="#C42130" />
    </svg>
  )
}
