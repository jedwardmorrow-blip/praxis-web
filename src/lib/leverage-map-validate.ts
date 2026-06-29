// Pure step validation for the Leverage Map wizard. Extracted from the client
// form so it can be unit-tested without pulling React, and so the ungate A/B arm
// can branch the Act-3 gate in one place.
import type { LeverageMapInput } from "@/lib/leverage-map"
import type { LeverageVariant } from "@/lib/variant"

// Returns an error string for the given step, or "" when the step is valid.
// Act 1 (the mess) and Act 2 (trace, fully optional) are identical across arms.
// Act 3 (contact) is the only difference: the gated arm requires an email before
// the map generates; the ungated arm drops ONLY the email (company + name stay
// required), since the owner saves the map by email after seeing it.
export function validateStep(
  stepIndex: number,
  form: LeverageMapInput,
  variant: LeverageVariant = "gated",
): string {
  if (stepIndex === 0) {
    if (!form.brokenMoment) return "Pick the moment closest to what came up."
    if (form.momentStory.trim().length < 12) return "A few words on what happened is enough to start."
  }
  if (stepIndex === 2) {
    if (!form.company.trim()) return "Add the company name to unlock the map."
    if (!form.name.trim()) return "Add your name."
    if (variant !== "ungated" && !form.email.includes("@")) return "Add a valid email."
  }
  return ""
}
