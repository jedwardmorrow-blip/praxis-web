"use client"

import { useState } from "react"

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "error"; message: string }
  | { kind: "success" }

export function Intake() {
  const [status, setStatus] = useState<Status>({ kind: "idle" })

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus({ kind: "submitting" })

    const fd = new FormData(e.currentTarget)
    const payload: Record<string, string> = { form_type: "main" }
    for (const [key, value] of fd.entries()) {
      if (typeof value === "string") payload[key] = value
    }

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}) as { error?: string })
        throw new Error(body.error ?? "Submission failed.")
      }
      setStatus({ kind: "success" })
    } catch (err) {
      setStatus({
        kind: "error",
        message: err instanceof Error ? err.message : "Submission failed.",
      })
    }
  }

  if (status.kind === "success") {
    return (
      <section className="intake" id="intake">
        <span className="sec-tag">§ Intake</span>
        <div className="form-success show">
          <div className="eye">§ Received · Form PX-001</div>
          <h3>
            Filed<span className="red">.</span> Greg reads every one.
          </h3>
          <p>
            If we are a fit and have capacity, you will hear back within five working days. If we
            are not a fit, you will hear back with referrals to firms that might be. Either way,
            you hear back.
          </p>
          <p style={{ marginTop: 14 }}>
            In the meantime, the operating atom above is real. Drag it around. The numbers are
            live.
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="intake" id="intake">
      <span className="sec-tag">§ Intake</span>
      <h2 className="sec-h">
        If the shape fits<span className="red">,</span> file an intake.
      </h2>
      <p className="lede">
        Greg reads every one. If we are a fit and have capacity, you will hear back within five
        working days. If we are not a fit, you will still hear back, with one or two referrals.
      </p>
      <p
        style={{
          fontFamily: "var(--font-plex-mono), 'IBM Plex Mono'",
          fontSize: 12,
          letterSpacing: "0.06em",
          color: "var(--paper-mute)",
          marginTop: 14,
        }}
      >
        Already know we should talk?{" "}
        <a
          href="mailto:greg@gopraxis.ai?subject=Praxis%20%C2%B7%20book%20a%2015-minute%20call&body=Hi%20Greg%2C%0A%0AOperation%3A%20%0AIndustry%3A%20%0AReason%20for%20call%3A%20%0A%0A%E2%80%94"
          style={{
            color: "var(--gold)",
            textDecoration: "none",
            borderBottom: "0.5px solid var(--gold)",
            paddingBottom: 1,
          }}
        >
          Book a 15-minute call directly with Greg →
        </a>
      </p>

      <form className="intake-form" onSubmit={onSubmit} noValidate>
        <div className="form-row">
          <div className="field">
            <label htmlFor="intake-name">
              Your name <span className="req">*</span>
            </label>
            <input
              id="intake-name"
              type="text"
              name="name"
              placeholder="First and last"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="intake-company">
              Operation <span className="req">*</span>
            </label>
            <input
              id="intake-company"
              type="text"
              name="company"
              placeholder="Company / firm"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="intake-email">
              Email <span className="req">*</span>
            </label>
            <input
              id="intake-email"
              type="email"
              name="email"
              placeholder="you@operation.com"
              required
            />
          </div>
          <div className="field">
            <label htmlFor="intake-phone">Phone (optional)</label>
            <input
              id="intake-phone"
              type="tel"
              name="phone"
              placeholder="+1 (555) 555-5555"
              autoComplete="tel"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="intake-title">Your role</label>
            <input
              id="intake-title"
              type="text"
              name="title"
              placeholder="Founder · COO · CFO · etc."
            />
          </div>
          <div className="field">
            <label htmlFor="intake-industry">Industry</label>
            <select id="intake-industry" name="industry" defaultValue="">
              <option value="">Select...</option>
              <option value="hospitality_consulting">Hospitality consulting</option>
              <option value="real_estate">Real estate platforms</option>
              <option value="field_services">Field services</option>
              <option value="multi_state_retail">Multi-state retail</option>
              <option value="cannabis_cultivation">Cannabis cultivation</option>
              <option value="other">Other operations</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label htmlFor="intake-team-size">
              Team size <span className="req">*</span>
            </label>
            <select id="intake-team-size" name="team_size" required defaultValue="">
              <option value="">Select...</option>
              <option value="under_10">Fewer than 10</option>
              <option value="10_30">10 to 30</option>
              <option value="30_75">30 to 75</option>
              <option value="75_150">75 to 150</option>
              <option value="over_150">More than 150</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="intake-revenue">Annual revenue range</label>
            <select id="intake-revenue" name="revenue_range" defaultValue="">
              <option value="">Optional</option>
              <option value="under_2m">Under $2M</option>
              <option value="2m_10m">$2M to $10M</option>
              <option value="10m_25m">$10M to $25M</option>
              <option value="25m_75m">$25M to $75M</option>
              <option value="over_75m">Over $75M</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
        </div>
        <div className="form-row full">
          <div className="field">
            <label htmlFor="intake-challenge">
              The biggest operational challenge in front of you{" "}
              <span className="req">*</span>
            </label>
            <textarea
              id="intake-challenge"
              name="challenge"
              required
              placeholder="What is breaking, what is slow, what reports nobody trusts, what you cannot leave alone for a week."
            />
          </div>
        </div>
        <div className="form-row full">
          <div className="field">
            <label htmlFor="intake-prior">
              Have you tried to solve this before? What happened?
            </label>
            <textarea
              id="intake-prior"
              name="prior_attempts"
              placeholder="Previous tools, consultants, internal attempts. What worked, what did not, what got in the way."
            />
          </div>
        </div>
        <div className="form-foot">
          <span className="meta">
            Six engagements per year.{" "}
            <span className="red">Both partners on every one.</span>
          </span>
          <button
            className="form-cta"
            type="submit"
            disabled={status.kind === "submitting"}
          >
            {status.kind === "submitting" ? "Filing..." : "File intake →"}
          </button>
        </div>
        {status.kind === "error" && (
          <div className="form-status error" role="alert">
            <strong>Could not file.</strong> {status.message} Please email
            greg@gopraxis.ai if this persists.
          </div>
        )}
      </form>
    </section>
  )
}
