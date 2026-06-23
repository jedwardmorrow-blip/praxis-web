"use client"

const BOOKING_URL = (process.env.NEXT_PUBLIC_PRAXIS_BOOKING_URL ?? "").trim()

// Actions for the persistent/shareable map page. No PII is available here (the
// page renders from the public payload), so the booking link carries only the
// pattern + first fix, never a name or email.
export function MapActions({ patternLabel, firstFix }: { patternLabel: string; firstFix: string }) {
  const notes = `Praxis Leverage Map — ${patternLabel}. First fix: ${firstFix}`
  const href = BOOKING_URL
    ? `${BOOKING_URL}${BOOKING_URL.includes("?") ? "&" : "?"}${new URLSearchParams({ notes }).toString()}`
    : `mailto:Justin@gopraxis.ai?subject=${encodeURIComponent(`AI Leverage Session — ${patternLabel}`)}`

  return (
    <div className="lm-actions">
      <a
        className="hero-cta"
        href={href}
        {...(BOOKING_URL ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      >
        Book a 30-minute intro call <span className="arr">→</span>
      </a>
      <button type="button" className="lm-print" onClick={() => window.print()}>
        Save as PDF
      </button>
    </div>
  )
}
