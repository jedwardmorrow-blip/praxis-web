"use client"

import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import {
  BROKEN_MOMENTS,
  CONSEQUENCES,
  COST_BANDS,
  FREQUENCIES,
  FRICTIONS,
  PAIN_STATEMENTS,
  PEOPLE_TOUCHES,
  SESSION_OPENNESS,
  TEAM_SIZES,
  TRUTH_LOCATIONS,
  type LeverageMapInput,
  type LeverageMapScore,
  type PublicLeverageResult,
} from "@/lib/leverage-map"
import { LeverageMapReadout } from "./leverage-map-readout"
import { track } from "@/lib/track"

const STEPS = [
  { eyebrow: "01", title: "Name the mess", short: "The mess" },
  { eyebrow: "02", title: "Trace it", short: "Trace" },
  { eyebrow: "03", title: "Unlock your map", short: "Unlock" },
] as const

const LOADING_PHASES = [
  "Reading your story",
  "Tracing the handoff",
  "Locating where it costs you",
  "Writing your leverage map",
] as const

const STORAGE_KEY = "praxis-leverage-map-v1"
const BOOKING_URL = (process.env.NEXT_PUBLIC_PRAXIS_BOOKING_URL ?? "").trim()

type ApiResult = {
  score: LeverageMapScore
  result: PublicLeverageResult
  leadId: string | null
  mapToken: string | null
}

const emptyInput: LeverageMapInput = {
  company: "",
  name: "",
  email: "",
  phone: "",
  role: "",
  businessKind: "",
  teamSize: "",
  brokenMoment: "",
  momentStory: "",
  peopleTouches: [],
  truthLocations: [],
  frictions: [],
  consequences: [],
  painStatement: "",
  frequency: "",
  costBand: "",
  perfectEmployee: "",
  openToSession: "",
}

const EXAMPLE_PROMPTS = [
  {
    label: "Missed follow-up",
    title: "A good lead came in, then got cold",
    brokenMoment: "lead_followup",
    story:
      "A real lead came in through a call, form, or message. The first response was not tight, the details lived in a few places, and by the time someone followed up the opportunity had already lost momentum.",
  },
  {
    label: "Owner bottleneck",
    title: "The decision came back to you",
    brokenMoment: "owner_decision",
    story:
      "A normal operating decision stalled because the team needed owner context, judgment, or approval. Nothing was technically broken, but the business could not move cleanly without one person stepping back into the workflow.",
  },
  {
    label: "Status confusion",
    title: "Nobody had the current answer",
    brokenMoment: "customer_update",
    story:
      "A customer, manager, or team member needed a simple status update. The answer existed somewhere, but it took too much hunting through calls, texts, inboxes, notes, or people to know what was actually true.",
  },
] satisfies Array<{
  label: string
  title: string
  brokenMoment: LeverageMapInput["brokenMoment"]
  story: string
}>

export function LeverageMapForm() {
  const [form, setForm] = useState<LeverageMapInput>(emptyInput)
  const [stepIndex, setStepIndex] = useState(0)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [loadingPhase, setLoadingPhase] = useState(0)
  const [hydrated, setHydrated] = useState(false)
  const [restored, setRestored] = useState(false)
  const [showDetail, setShowDetail] = useState(false)

  const botRef = useRef<HTMLInputElement>(null)
  const stepBodyRef = useRef<HTMLDivElement>(null)
  const shouldFocusStep = useRef(false)
  const startedRef = useRef(false)

  const activeStep = STEPS[stepIndex]
  const completion = useMemo(() => Math.round(((stepIndex + 1) / STEPS.length) * 100), [stepIndex])
  // Act 2 leads with the high-signal free-text + economics; the chip taxonomy is
  // collapsed behind a disclosure so the middle step stops greeting people with a
  // ~50-chip wall. This counts what is hidden so a user knows detail is in there.
  const detailSelectionCount =
    form.peopleTouches.length +
    form.truthLocations.length +
    form.frictions.length +
    form.consequences.length +
    (form.painStatement ? 1 : 0)

  // Top of funnel: reached the wizard. Fired once per mount (the pilot reads
  // started -> completed -> booking_click from praxis_funnel_events).
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    track("quiz_start")
  }, [])

  // Restore in-progress answers (mobile users tab away constantly).
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as { form?: Partial<LeverageMapInput>; stepIndex?: number }
        if (parsed?.form) {
          setForm((current) => ({ ...current, ...parsed.form }))
          if (typeof parsed.stepIndex === "number") {
            setStepIndex(Math.min(STEPS.length - 1, Math.max(0, parsed.stepIndex)))
          }
          if (parsed.form.brokenMoment || (parsed.form.momentStory ?? "").trim().length > 0) {
            setRestored(true)
          }
          const f = parsed.form
          const hadDetail =
            (f.peopleTouches?.length ?? 0) +
              (f.truthLocations?.length ?? 0) +
              (f.frictions?.length ?? 0) +
              (f.consequences?.length ?? 0) >
              0 || Boolean(f.painStatement)
          if (hadDetail) setShowDetail(true)
        }
      }
    } catch {
      // ignore corrupt storage
    }
    setHydrated(true)
  }, [])

  // Persist progress until the map is generated.
  useEffect(() => {
    if (!hydrated || result) return
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ form, stepIndex }))
    } catch {
      // ignore quota / privacy-mode errors
    }
  }, [form, stepIndex, hydrated, result])

  // Walk the loading copy forward while the model writes the map.
  useEffect(() => {
    if (!submitting) {
      setLoadingPhase(0)
      return
    }
    const id = window.setInterval(() => {
      setLoadingPhase((phase) => Math.min(LOADING_PHASES.length - 1, phase + 1))
    }, 1500)
    return () => window.clearInterval(id)
  }, [submitting])

  // Move focus to the new step for keyboard / screen-reader users.
  useEffect(() => {
    if (shouldFocusStep.current && stepBodyRef.current) {
      stepBodyRef.current.focus()
      shouldFocusStep.current = false
    }
  }, [stepIndex])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (stepIndex < STEPS.length - 1) {
      goNext()
      return
    }

    const validationError = validateStep(stepIndex, form)
    if (validationError) {
      setError(validationError)
      return
    }

    setError("")
    setSubmitting(true)
    setResult(null)

    try {
      const response = await fetch("/api/leverage-map", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, _hp: botRef.current?.value ?? "" }),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || "Could not create leverage map")
      try {
        window.localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore
      }
      setResult(payload)
      track("quiz_complete", payload?.mapToken)
      window.setTimeout(() => {
        document.getElementById("leverage-result")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 80)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create leverage map")
    } finally {
      setSubmitting(false)
    }
  }

  const showWizard = !result && !submitting

  return (
    <section className="check-workbench" id="map">
      <div className="check-workbench-head">
        <div>
          <span className="sec-tag">Praxis Leverage Map</span>
          <h2 className="sec-h">
            Find your first AI leverage point<span className="red">.</span>
          </h2>
        </div>
        {showWizard ? (
          <div className="check-progress" aria-label={`Map completion ${completion}%`}>
            <span>
              Act {stepIndex + 1} of {STEPS.length} · {activeStep.short}
            </span>
            <div>
              <i style={{ width: `${completion}%` }} />
            </div>
          </div>
        ) : null}
      </div>

      {showWizard && restored ? (
        <p className="check-resumed" role="status">
          Picked up where you left off. <button type="button" onClick={resetEverything}>Start over</button>
        </p>
      ) : null}

      {showWizard ? (
        <div className="check-stepper" aria-label="Leverage map acts">
          {STEPS.map((step, index) => (
            <button
              key={step.short}
              type="button"
              aria-current={index === stepIndex ? "step" : undefined}
              className={index === stepIndex ? "active" : index < stepIndex ? "complete" : ""}
              onClick={() => {
                if (index <= stepIndex) {
                  setError("")
                  shouldFocusStep.current = true
                  setStepIndex(index)
                }
              }}
            >
              <span>{step.eyebrow}</span>
              {step.short}
            </button>
          ))}
        </div>
      ) : null}

      {submitting ? <LoadingPanel phase={loadingPhase} /> : null}

      {showWizard ? (
        <form className="check-form wizard" onSubmit={handleSubmit}>
          <input
            ref={botRef}
            type="text"
            name="_hp"
            className="check-hp"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="check-step-body" key={stepIndex} ref={stepBodyRef} tabIndex={-1}>
            {stepIndex === 0 ? (
              <section className="check-block">
                <div className="check-block-label">
                  <span>{activeStep.eyebrow}</span>
                  <strong>{activeStep.title}</strong>
                </div>
                <div className="check-opener">
                  <h3 className="check-opener-q">
                    Think back over the last week or two of running the place. Which of these came up?
                  </h3>
                  <p className="check-opener-sub">
                    Pick the one that stuck with you. You will tell it in a line or two next.
                  </p>
                </div>
                <ChoiceGrid
                  value={form.brokenMoment}
                  options={BROKEN_MOMENTS}
                  onChange={(value) => update("brokenMoment", value)}
                  large
                />
                <div className="check-example-strip" aria-label="Example operating messes">
                  <div>
                    <span>Need a starting point?</span>
                    <p>Borrow the closest example and rewrite it in your words.</p>
                  </div>
                  <div className="check-example-grid">
                    {EXAMPLE_PROMPTS.map((prompt) => (
                      <button
                        key={prompt.label}
                        type="button"
                        onClick={() => {
                          setError("")
                          setForm((current) => ({
                            ...current,
                            brokenMoment: prompt.brokenMoment,
                            momentStory: prompt.story,
                          }))
                        }}
                      >
                        <span>{prompt.label}</span>
                        {prompt.title}
                      </button>
                    ))}
                  </div>
                </div>
                <Field
                  label="What happened?"
                  hint="Plain English is best. Name the handoff, delay, customer, report, or owner interruption."
                >
                  <textarea
                    value={form.momentStory}
                    onChange={(e) => update("momentStory", e.target.value)}
                    rows={5}
                    placeholder="Example: A quote request came in after hours, the details landed in voicemail, the owner had to ask two people what happened, and the customer was already talking to another company by the next morning."
                  />
                  <TextStrength value={form.momentStory} ideal={80} />
                </Field>
              </section>
            ) : null}

            {stepIndex === 1 ? (
              <section className="check-block">
                <div className="check-block-label">
                  <span>{activeStep.eyebrow}</span>
                  <strong>{activeStep.title}</strong>
                </div>
                <p className="check-trace-copy">
                  One question does most of the work here. Answer it, set the rough size, and you
                  are done — or open the detail tags for an even sharper read. None of it is required.
                </p>

                <Field
                  label="If your best employee handled this perfectly, what would they know or do?"
                  hint="This is the hidden-leverage question. It is the single most useful thing you can write here."
                >
                  <textarea
                    value={form.perfectEmployee}
                    onChange={(e) => update("perfectEmployee", e.target.value)}
                    rows={4}
                    placeholder="Describe the judgment, context, or sequence that a strong person already carries in their head."
                  />
                  <TextStrength value={form.perfectEmployee} ideal={60} />
                </Field>

                <div className="check-grid two compact">
                  <ChoiceGrid
                    title="How often?"
                    value={form.frequency}
                    options={FREQUENCIES}
                    onChange={(value) => update("frequency", value)}
                  />
                  <ChoiceGrid
                    title="Rough monthly weight"
                    value={form.costBand}
                    options={COST_BANDS}
                    onChange={(value) => update("costBand", value)}
                  />
                </div>

                <div className="check-trace-more">
                  <button
                    type="button"
                    className="check-trace-toggle"
                    aria-expanded={showDetail}
                    aria-controls="check-trace-detail"
                    onClick={() => setShowDetail((open) => !open)}
                  >
                    {showDetail ? "Hide detail tags" : "Add detail tags"}
                    <span aria-hidden="true">{showDetail ? "–" : "+"}</span>
                  </button>
                  {!showDetail && detailSelectionCount > 0 ? (
                    <span className="check-trace-count">{detailSelectionCount} selected</span>
                  ) : (
                    <span className="check-trace-hint">Optional — who, where, and what it cost</span>
                  )}
                </div>

                {showDetail ? (
                  <div className="check-trace-detail" id="check-trace-detail">
                    <div className="check-trace-cluster">
                      <span className="check-cluster-label">Who and where</span>
                      <MultiGrid
                        title="Who usually touches this?"
                        values={form.peopleTouches}
                        options={PEOPLE_TOUCHES}
                        onChange={(values) => update("peopleTouches", values)}
                      />
                      <MultiGrid
                        title="Where does the truth live?"
                        values={form.truthLocations}
                        options={TRUTH_LOCATIONS}
                        onChange={(values) => update("truthLocations", values)}
                      />
                      <MultiGrid
                        title="What made it harder than it should have been?"
                        values={form.frictions}
                        options={FRICTIONS}
                        onChange={(values) => update("frictions", values)}
                      />
                    </div>

                    <div className="check-trace-cluster">
                      <span className="check-cluster-label">What it cost</span>
                      <MultiGrid
                        title="What did it cost?"
                        values={form.consequences}
                        options={CONSEQUENCES}
                        onChange={(values) => update("consequences", values)}
                      />
                      <ChoiceGrid
                        title="Which sentence hits hardest?"
                        value={form.painStatement}
                        options={PAIN_STATEMENTS}
                        onChange={(value) => update("painStatement", value)}
                        large
                      />
                    </div>
                  </div>
                ) : null}
              </section>
            ) : null}

            {stepIndex === 2 ? (
              <section className="check-block identity">
                <div className="check-block-label">
                  <span>{activeStep.eyebrow}</span>
                  <strong>{activeStep.title}</strong>
                </div>
                <p className="check-unlock-copy">
                  Your leverage map is generated after this step, and a copy goes to your inbox. We
                  ask for contact info last so you map the workflow first. Three fields unlock it.
                </p>
                <div className="check-grid two">
                  <Field label="Company" required>
                    <input
                      autoComplete="organization"
                      value={form.company}
                      onChange={(e) => update("company", e.target.value)}
                    />
                  </Field>
                  <Field label="Your name" required>
                    <input autoComplete="name" value={form.name} onChange={(e) => update("name", e.target.value)} />
                  </Field>
                  <Field label="Email" required>
                    <input
                      type="email"
                      inputMode="email"
                      autoComplete="email"
                      value={form.email}
                      onChange={(e) => update("email", e.target.value)}
                    />
                  </Field>
                  <Field label="Phone">
                    <input
                      type="tel"
                      inputMode="tel"
                      autoComplete="tel"
                      value={form.phone}
                      onChange={(e) => update("phone", e.target.value)}
                    />
                  </Field>
                </div>

                <div className="check-optional-divider">
                  <span>Optional context</span>
                  <p>Skip any of these. Each one sharpens the readout and the follow-up.</p>
                </div>
                <div className="check-grid two">
                  <Field label="Business type">
                    <input
                      autoComplete="organization-title"
                      value={form.businessKind}
                      onChange={(e) => update("businessKind", e.target.value)}
                      placeholder="e.g. HVAC, CPA firm, distributor, clinic"
                    />
                  </Field>
                  <Field label="Role">
                    <input
                      value={form.role}
                      onChange={(e) => update("role", e.target.value)}
                      placeholder="Owner, operator, manager..."
                    />
                  </Field>
                </div>
                <ChoiceGrid
                  title="Daily operating size"
                  value={form.teamSize}
                  options={TEAM_SIZES}
                  onChange={(value) => update("teamSize", value)}
                />
                <ChoiceGrid
                  title="Would you want a 60-90 minute AI Leverage Session if the map shows a real opportunity?"
                  value={form.openToSession}
                  options={SESSION_OPENNESS}
                  onChange={(value) => update("openToSession", value)}
                  large
                />
              </section>
            ) : null}
          </div>

          <div className="check-submit-row">
            {stepIndex > 0 ? (
              <button
                type="button"
                className="check-back"
                onClick={() => {
                  setError("")
                  shouldFocusStep.current = true
                  setStepIndex((current) => Math.max(0, current - 1))
                }}
              >
                Back
              </button>
            ) : null}
            <button className="check-submit" type="submit" disabled={submitting}>
              {stepIndex === STEPS.length - 1 ? "Create my leverage map" : "Continue"}
            </button>
            <p>
              {stepIndex === STEPS.length - 1
                ? "You get the map immediately and a copy by email. Justin gets the internal summary."
                : "No contact info yet. Build the map first, then unlock the result at the end."}
            </p>
          </div>
          {error ? (
            <div className="check-error" role="alert">
              {error}
            </div>
          ) : null}
        </form>
      ) : null}

      {result ? (
        <section className="check-result-wrap">
          <LeverageMapReadout company={form.company} score={result.score} result={result.result} />

          <div className="lm-session-next">
            <span>Recommended next step</span>
            <h3>Want Justin to map this with you?</h3>
            <p>
              Start with a focused 30-minute intro call. We trace the handoff, name the first
              useful intervention, and decide together whether it is worth a full 60-90 minute AI
              Leverage Session.
            </p>
          </div>

          <div className="lm-actions">
            <a
              className="hero-cta"
              href={primaryCtaHref(form, result.result)}
              {...primaryCtaTarget()}
              onClick={() => track("booking_click", result.mapToken)}
            >
              Book a 30-minute intro call <span className="arr">→</span>
            </a>
            {result.mapToken ? (
              <a
                className="check-secondary-link"
                href={`/check/map/${result.mapToken}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View &amp; share your map →
              </a>
            ) : null}
            <button
              type="button"
              onClick={() => {
                setError("")
                setResult(null)
                setStepIndex(0)
              }}
              className="check-reset"
            >
              Edit answers
            </button>
          </div>

          {result.mapToken ? (
            <p className="lm-emailed">A copy of your map is on its way to your inbox.</p>
          ) : null}
        </section>
      ) : null}
    </section>
  )

  function update<K extends keyof LeverageMapInput>(key: K, value: LeverageMapInput[K]) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function goNext() {
    const validationError = validateStep(stepIndex, form)
    if (validationError) {
      setError(validationError)
      return
    }
    setError("")
    shouldFocusStep.current = true
    setStepIndex((current) => Math.min(STEPS.length - 1, current + 1))
    window.setTimeout(() => {
      document.getElementById("map")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 40)
  }

  function resetEverything() {
    try {
      window.localStorage.removeItem(STORAGE_KEY)
    } catch {
      // ignore
    }
    setForm(emptyInput)
    setStepIndex(0)
    setError("")
    setRestored(false)
  }
}

function LoadingPanel({ phase }: { phase: number }) {
  return (
    <div className="check-loading" role="status" aria-live="polite">
      <div className="lm-skeleton" aria-hidden="true">
        <span className="lm-sk lm-sk-eyebrow" />
        <span className="lm-sk lm-sk-title" />
        <span className="lm-sk lm-sk-line w80" />
        <span className="lm-sk lm-sk-line w95" />
        <span className="lm-sk lm-sk-line w60" />
      </div>
      <strong>Building your leverage map</strong>
      <ul className="check-loading-phases">
        {LOADING_PHASES.map((label, index) => (
          <li key={label} className={index < phase ? "done" : index === phase ? "active" : ""}>
            {label}
          </li>
        ))}
      </ul>
      <p>Reading the moment you described and writing a practical, specific read. A few seconds.</p>
    </div>
  )
}

function TextStrength({ value, ideal }: { value: string; ideal: number }) {
  const length = value.trim().length
  const ratio = Math.min(1, length / ideal)
  const tier = length === 0 ? "empty" : length < 20 ? "thin" : ratio < 1 ? "ok" : "strong"
  const message =
    tier === "empty"
      ? "A sentence or two unlocks a sharper map."
      : tier === "thin"
        ? "Keep going — name who, what, and when."
        : tier === "ok"
          ? "Good. One more concrete detail makes the read sharper."
          : "That is plenty of signal for a strong read."
  return (
    <div className={`check-strength ${tier}`} aria-hidden="true">
      <div className="check-strength-track">
        <i style={{ width: `${Math.max(tier === "empty" ? 0 : 8, ratio * 100)}%` }} />
      </div>
      <span>{message}</span>
    </div>
  )
}

function validateStep(stepIndex: number, form: LeverageMapInput) {
  if (stepIndex === 0) {
    if (!form.brokenMoment) return "Pick the moment closest to what came up."
    if (form.momentStory.trim().length < 20) return "Add a little more detail about what happened."
  }
  // Act 2 (Trace it) is entirely optional — every chip sharpens the map, none gate it.
  if (stepIndex === 2) {
    if (!form.company.trim()) return "Add the company name to unlock the map."
    if (!form.name.trim()) return "Add your name."
    if (!form.email.includes("@")) return "Add a valid email."
  }
  return ""
}

function mailtoHref(form: LeverageMapInput, result: PublicLeverageResult) {
  const subject = `Praxis Leverage Map - ${form.company}`
  const body = [
    "Hi Justin,",
    "",
    "I completed the Praxis Leverage Map.",
    "",
    `Company: ${form.company}`,
    `Pattern: ${result.pattern_label}`,
    `First fix: ${result.first_fix}`,
    "",
    "I'd like to talk about an AI Leverage Session.",
    "",
    `- ${form.name}`,
  ].join("\n")
  return `mailto:justin@gopraxis.ai?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

function primaryCtaHref(form: LeverageMapInput, result: PublicLeverageResult) {
  if (!BOOKING_URL) return mailtoHref(form, result)
  const sep = BOOKING_URL.includes("?") ? "&" : "?"
  const notes = `Praxis Leverage Map — ${result.pattern_label}. First fix: ${result.first_fix}`
  const params = new URLSearchParams({
    name: form.name,
    email: form.email,
    notes,
  })
  return `${BOOKING_URL}${sep}${params.toString()}`
}

function primaryCtaTarget() {
  return BOOKING_URL ? { target: "_blank", rel: "noopener noreferrer" } : {}
}

function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="check-field">
      <span>
        {label}
        {required ? <b> required</b> : null}
      </span>
      {children}
      {hint ? <em>{hint}</em> : null}
    </label>
  )
}

function ChoiceGrid<T extends Record<string, { label: string } | string>>({
  title,
  value,
  options,
  onChange,
  large,
}: {
  title?: string
  value: string
  options: T
  onChange: (value: keyof T & string) => void
  large?: boolean
}) {
  return (
    <div className="check-choice-group">
      {title ? <h3>{title}</h3> : null}
      <div className={large ? "check-choice-grid large" : "check-choice-grid"}>
        {Object.entries(options).map(([key, option]) => {
          const label = typeof option === "string" ? option : option.label
          const active = value === key
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              className={active ? "active" : ""}
              onClick={() => onChange(key as keyof T & string)}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function MultiGrid<T extends Record<string, string>>({
  title,
  values,
  options,
  onChange,
}: {
  title: string
  values: string[]
  options: T
  onChange: (values: string[]) => void
}) {
  return (
    <div className="check-choice-group">
      <h3>
        {title}
        {values.length ? <span className="check-choice-count">{values.length} selected</span> : null}
      </h3>
      <div className="check-choice-grid multi">
        {Object.entries(options).map(([key, label]) => {
          const active = values.includes(key)
          return (
            <button
              key={key}
              type="button"
              aria-pressed={active}
              className={active ? "active" : ""}
              onClick={() => {
                onChange(active ? values.filter((item) => item !== key) : [...values, key])
              }}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
