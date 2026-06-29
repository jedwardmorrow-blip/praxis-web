// Ungate A/B experiment: which arm of the Leverage Map funnel a visitor is in.
//   gated   = control (today's behavior: email required before the map generates)
//   ungated = see the map first, save it by email afterward
//
// Assignment is CLIENT-SIDE (a sticky cookie set by the wizard on mount) rather
// than via middleware: the server never needs the arm before render — Act 1/2 are
// identical, the Act-3 gate and the post-readout claim are client-side, and the
// API route reads the arm from the POST body. Avoiding middleware keeps a bug from
// ever taking down the whole /check funnel (including the control arm).
//
// decideVariant is PURE so it is unit-testable and behaves identically everywhere.

export type LeverageVariant = "gated" | "ungated"

export const VARIANT_COOKIE = "px_lm_variant"

function normalize(value: string | null | undefined): LeverageVariant | null {
  return value === "gated" || value === "ungated" ? value : null
}

// Resolve the arm from the available signals. Precedence is deliberate:
//   1. QA override (?v=gated|ungated) always wins, so QA can test either arm.
//   2. Kill switch: rolloutPct <= 0 forces everyone to `gated` immediately,
//      overriding a stale `ungated` cookie (this is the emergency off-ramp).
//   3. Sticky: an already-assigned valid cookie is never reassigned.
//   4. Otherwise split by rolloutPct (default 50/50).
export function decideVariant(opts: {
  existing?: string | null
  override?: string | null
  rolloutPct?: number
  rand: number // [0, 1)
}): LeverageVariant {
  const override = normalize(opts.override)
  if (override) return override

  const pct = Number.isFinite(opts.rolloutPct)
    ? Math.max(0, Math.min(100, opts.rolloutPct as number))
    : 50
  if (pct <= 0) return "gated"

  const existing = normalize(opts.existing)
  if (existing) return existing

  return opts.rand * 100 < pct ? "ungated" : "gated"
}

// Server/route-side parse of the arm off an untrusted request body. Defaults to
// `gated` so any non-experiment caller (or a malformed value) gets today's behavior.
export function parseVariant(value: unknown): LeverageVariant {
  return value === "ungated" ? "ungated" : "gated"
}

// Read the sticky arm from document.cookie (browser only). Returns null when the
// cookie is absent/invalid or document is unavailable. Used by the funnel beacon.
export function readVariantCookie(): LeverageVariant | null {
  if (typeof document === "undefined") return null
  try {
    const match = document.cookie.match(/(?:^|;\s*)px_lm_variant=(gated|ungated)\b/)
    return match ? (match[1] as LeverageVariant) : null
  } catch {
    return null
  }
}

// Persist the sticky arm for a year (browser only). Best-effort; never throws.
export function writeVariantCookie(variant: LeverageVariant): void {
  if (typeof document === "undefined") return
  try {
    document.cookie = `${VARIANT_COOKIE}=${variant}; path=/; max-age=31536000; samesite=lax`
  } catch {
    // private mode / disabled cookies — the in-memory arm still drives this session
  }
}
