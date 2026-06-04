"use client"

import { useState } from "react"

export function CannabisIntakeForm() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form)) as Record<string, string>
    try {
      await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, form_type: "cannabis" }),
      })
    } catch {
      // Fail silently — still show confirmation
    }
    setSubmitted(true)
    setLoading(false)
  }

  if (submitted) {
    return (
      <div
        className="p-8"
        style={{
          background: "rgba(196, 33, 48, 0.12)",
          border: "1px solid rgba(196, 33, 48, 0.42)",
        }}
        role="status"
      >
        <p className="text-[0.95rem] text-foreground leading-[1.72]">
          Got it. If there&apos;s a fit, you&apos;ll hear from us directly —
          not an automated sequence, not an SDR. Just us.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
      {/* Name + Company */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <Field id="name" label="Your name">
          <input
            id="name"
            name="name"
            type="text"
            placeholder="First and last"
            required
            className="w-full bg-card border border-border/80 text-foreground text-[0.92rem] px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground"
            style={{ borderRadius: "var(--radius)" }}
          />
        </Field>
        <Field id="company" label="Company">
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Your operation's name"
            required
            className="w-full bg-card border border-border/80 text-foreground text-[0.92rem] px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground"
            style={{ borderRadius: "var(--radius)" }}
          />
        </Field>
      </div>

      {/* Email */}
      <Field id="email" label="Your email">
        <input
          id="email"
          name="email"
          type="email"
          placeholder="you@company.com"
          required
          className="w-full bg-card border border-border/80 text-foreground text-[0.92rem] px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground"
          style={{ borderRadius: "var(--radius)" }}
        />
      </Field>

      {/* States */}
      <Field id="states" label="What state(s) are you operating in?">
        <input
          id="states"
          name="states"
          type="text"
          placeholder="e.g. Arizona, California, Colorado"
          required
          className="w-full bg-card border border-border/80 text-foreground text-[0.92rem] px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground"
          style={{ borderRadius: "var(--radius)" }}
        />
      </Field>

      {/* Biggest challenge */}
      <Field id="challenge" label="What's your biggest operational challenge right now?">
        <textarea
          id="challenge"
          name="challenge"
          placeholder="Be specific. Compliance, distribution, visibility, staffing — whatever's costing you most."
          required
          rows={4}
          className="w-full bg-card border border-border/80 text-foreground text-[0.92rem] px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground resize-y"
          style={{ borderRadius: "var(--radius)" }}
        />
      </Field>

      {/* Prior attempts */}
      <Field id="prior" label="Have you tried to solve this before? What happened?">
        <textarea
          id="prior"
          name="prior_attempts"
          placeholder="Previous platforms, consultants, internal tools — whatever you've tried."
          rows={3}
          className="w-full bg-card border border-border/80 text-foreground text-[0.92rem] px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground resize-y"
          style={{ borderRadius: "var(--radius)" }}
        />
      </Field>

      {/* Referral */}
      <Field id="referral" label="How did you find us?">
        <input
          id="referral"
          name="referral"
          type="text"
          placeholder="Referral, ICBC, social, search…"
          className="w-full bg-card border border-border/80 text-foreground text-[0.92rem] px-4 py-3 outline-none transition-colors placeholder:text-muted-foreground"
          style={{ borderRadius: "var(--radius)" }}
        />
      </Field>

      <button
        type="submit"
        disabled={loading}
        className="self-start mt-1 inline-flex items-center gap-2 bg-brand hover:bg-brand-hover disabled:opacity-60 text-white text-[0.78rem] font-semibold tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 hover:-translate-y-px"
        style={{ borderRadius: "var(--radius)" }}
      >
        {loading ? "Sending…" : "Send it →"}
      </button>
    </form>
  )
}

function Field({
  id,
  label,
  children,
}: {
  id: string
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase text-muted-foreground"
      >
        {label}
      </label>
      {children}
    </div>
  )
}
