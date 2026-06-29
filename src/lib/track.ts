// Lightweight first-party funnel tracking for the Leverage Map pilot.
// Fire-and-forget — never blocks or breaks the UI for an analytics call. Records
// quiz_start (reached the wizard), quiz_complete (got a map), and booking_click
// (clicked the call CTA), tied together by an anon client session id so the
// funnel can be read from praxis_funnel_events. No PII is sent.

import { readVariantCookie } from "@/lib/variant"

const SID_KEY = "praxis-fm-sid"

function sessionId(): string {
  try {
    let s = window.localStorage.getItem(SID_KEY)
    if (!s) {
      s = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).slice(2)}`
      window.localStorage.setItem(SID_KEY, s)
    }
    return s
  } catch {
    return "nostore"
  }
}

export type FunnelEvent = "quiz_start" | "quiz_complete" | "booking_click"

export function track(event: FunnelEvent, leadToken?: string | null, meta?: Record<string, unknown>): void {
  if (typeof window === "undefined") return
  try {
    // The ungate arm rides on every beacon so completion/conversion is comparable
    // by variant. Read straight from the sticky cookie (set by the wizard on mount).
    const body = JSON.stringify({
      event,
      sessionId: sessionId(),
      leadToken: leadToken ?? null,
      variant: readVariantCookie(),
      meta: meta ?? null,
    })
    // sendBeacon survives the navigation a booking click triggers; keepalive fetch is the fallback.
    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }))
    } else {
      void fetch("/api/events", { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {})
    }
  } catch {
    // analytics must never break the page
  }
}
