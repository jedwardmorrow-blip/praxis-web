"use client"

import { FormEvent, useMemo, useState } from "react"
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
  type LeverageMapAiResult,
  type LeverageMapInput,
  type LeverageMapScore,
} from "@/lib/leverage-map"

const STEPS = [
  { eyebrow: "01", title: "Pick the messy moment", short: "Moment" },
  { eyebrow: "02", title: "Trace the handoff", short: "Handoff" },
  { eyebrow: "03", title: "Measure the consequence", short: "Consequence" },
  { eyebrow: "04", title: "Unlock the readout", short: "Contact" },
] as const

type ApiResult = {
  score: LeverageMapScore
  result: LeverageMapAiResult
  leadId: string | null
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

  const activeStep = STEPS[stepIndex]
  const completion = useMemo(() => Math.round(((stepIndex + 1) / STEPS.length) * 100), [stepIndex])

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
          body: JSON.stringify(form),
      })
      const payload = await response.json()
      if (!response.ok) throw new Error(payload?.error || "Could not create leverage map")
      setResult(payload)
      window.setTimeout(() => {
        document.getElementById("leverage-result")?.scrollIntoView({ behavior: "smooth", block: "start" })
      }, 80)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create leverage map")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="check-workbench" id="map">
      <div className="check-workbench-head">
        <div>
          <span className="sec-tag">Praxis Leverage Map</span>
          <h2 className="sec-h">
            Find your first AI leverage point<span className="red">.</span>
          </h2>
        </div>
        <div className="check-progress" aria-label={`Map completion ${completion}%`}>
          <span>
            Step {stepIndex + 1} of {STEPS.length} · {activeStep.short}
          </span>
          <div>
            <i style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>

      <div className="check-stepper" aria-label="Leverage map steps">
        {STEPS.map((step, index) => (
          <button
            key={step.short}
            type="button"
            className={index === stepIndex ? "active" : index < stepIndex ? "complete" : ""}
            onClick={() => {
              if (index <= stepIndex) {
                setError("")
                setStepIndex(index)
              }
            }}
          >
            <span>{step.eyebrow}</span>
            {step.short}
          </button>
        ))}
      </div>

      <form className="check-form wizard" onSubmit={handleSubmit}>
        {stepIndex === 0 ? (
          <section className="check-block">
            <div className="check-block-label">
              <span>{activeStep.eyebrow}</span>
              <strong>{activeStep.title}</strong>
            </div>
            <div className="check-example-strip" aria-label="Example operating messes">
              <div>
                <span>Need a starting point?</span>
                <p>Pick the closest example and rewrite it in your words.</p>
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
            <ChoiceGrid
              title="Which recent moment is closest?"
              value={form.brokenMoment}
              options={BROKEN_MOMENTS}
              onChange={(value) => update("brokenMoment", value)}
              large
            />
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
            </Field>
          </section>
        ) : null}

        {stepIndex === 1 ? (
          <section className="check-block">
          <div className="check-block-label">
            <span>{activeStep.eyebrow}</span>
            <strong>{activeStep.title}</strong>
          </div>
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
          </section>
        ) : null}

        {stepIndex === 2 ? (
          <section className="check-block">
          <div className="check-block-label">
            <span>{activeStep.eyebrow}</span>
            <strong>{activeStep.title}</strong>
          </div>
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
          <Field label="If your best employee handled this perfectly, what would they know or do?">
            <textarea
              value={form.perfectEmployee}
              onChange={(e) => update("perfectEmployee", e.target.value)}
              rows={4}
              placeholder="This is the hidden leverage question. Describe the judgment, context, or sequence that a strong person already carries."
            />
          </Field>
          </section>
        ) : null}

        {stepIndex === 3 ? (
          <section className="check-block identity">
            <div className="check-block-label">
              <span>{activeStep.eyebrow}</span>
              <strong>{activeStep.title}</strong>
            </div>
            <p className="check-unlock-copy">
              Your leverage readout is generated after this step. We ask for context last so you can map
              the workflow before handing over contact info.
            </p>
            <div className="check-grid two">
              <Field label="Company" required>
                <input value={form.company} onChange={(e) => update("company", e.target.value)} />
              </Field>
              <Field label="Business type" required>
                <input
                  value={form.businessKind}
                  onChange={(e) => update("businessKind", e.target.value)}
                  placeholder="e.g. HVAC, CPA firm, distributor, clinic"
                />
              </Field>
              <Field label="Your name" required>
                <input value={form.name} onChange={(e) => update("name", e.target.value)} />
              </Field>
              <Field label="Email" required>
                <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </Field>
              <Field label="Phone">
                <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
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
          />
          </section>
        ) : null}

        <div className="check-submit-row">
          {stepIndex > 0 ? (
            <button
              type="button"
              className="check-back"
              onClick={() => {
                setError("")
                setStepIndex((current) => Math.max(0, current - 1))
              }}
            >
              Back
            </button>
          ) : null}
          <button className="check-submit" type="submit" disabled={submitting}>
            {submitting
              ? "Mapping..."
              : stepIndex === STEPS.length - 1
                ? "Create leverage map"
                : "Continue"}
          </button>
          <p>
            {stepIndex === STEPS.length - 1
              ? "You get the practical readout immediately. Justin gets the internal CRM summary."
              : "No contact info yet. Build the map first, then unlock the result at the end."}
          </p>
        </div>
        {error ? <div className="check-error">{error}</div> : null}
      </form>

      {result ? (
        <section className="check-result" id="leverage-result">
          <div className="check-result-top">
            <div>
              <span className="sec-tag">Your leverage pattern</span>
              <h2>{result.result.pattern_label}</h2>
            </div>
            <div className="check-score">
              <span>{result.score.composite}/9</span>
              <strong>{result.score.resultBand}</strong>
            </div>
          </div>
          <div className="check-result-grid">
            <article className="check-readout">
              <span>Here is what we heard</span>
              <p>{result.result.operator_readout}</p>
            </article>
            <article>
              <span>What you are already doing right</span>
              <p>{result.result.what_you_are_already_doing_right}</p>
            </article>
            <article>
              <span>Where the cost hides</span>
              <p>{result.result.where_it_costs_you}</p>
            </article>
            <article>
              <span>What an intervention looks like</span>
              <p>{result.result.what_an_intervention_looks_like}</p>
            </article>
            <article>
              <span>First fix</span>
              <p>{result.result.first_fix}</p>
            </article>
            <article>
              <span>Why this is fixable</span>
              <p>{result.result.why_this_is_fixable}</p>
            </article>
          </div>
          <div className="check-questions check-public-next">
            <span>90 day picture</span>
            <p>{result.result.ninety_day_picture}</p>
          </div>
          <div className="check-session-next">
            <span>Recommended next step</span>
            <h3>Want Justin to map this with you?</h3>
            <p>
              Bring this exact workflow into a focused AI Leverage Session. We will trace the
              handoff, identify the first useful intervention, and decide whether this is worth
              turning into a real operating system improvement.
            </p>
          </div>
          <div className="check-result-actions">
            <a
              className="hero-cta"
              href={`mailto:justin@gopraxis.ai?subject=Praxis%20Leverage%20Map%20-%20${encodeURIComponent(form.company)}&body=${encodeURIComponent(
                `Hi Justin,\n\nI completed the Praxis Leverage Map.\n\nCompany: ${form.company}\nPattern: ${result.result.pattern_label}\nFirst fix: ${result.result.first_fix}\n\nI'd like to talk about an AI Leverage Session.\n\n- ${form.name}`,
              )}`}
            >
              Map this with Justin <span className="arr">→</span>
            </a>
            <button
              type="button"
              onClick={() => {
                setResult(null)
                setStepIndex(0)
              }}
              className="check-reset"
            >
              Edit answers
            </button>
          </div>
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
    setStepIndex((current) => Math.min(STEPS.length - 1, current + 1))
    window.setTimeout(() => {
      document.getElementById("map")?.scrollIntoView({ behavior: "smooth", block: "start" })
    }, 40)
  }
}

function validateStep(stepIndex: number, form: LeverageMapInput) {
  if (stepIndex === 0) {
    if (!form.brokenMoment) return "Pick the messy moment closest to what happened."
    if (form.momentStory.trim().length < 20) return "Add a little more detail about what happened."
  }
  if (stepIndex === 1) {
    if (!form.peopleTouches.length) return "Pick at least one person or team that touches the workflow."
    if (!form.truthLocations.length) return "Pick where the truth usually lives."
    if (!form.frictions.length) return "Pick at least one thing that made the handoff harder."
  }
  if (stepIndex === 2) {
    if (!form.consequences.length) return "Pick at least one consequence."
    if (!form.painStatement) return "Pick the sentence that hits hardest."
    if (!form.frequency) return "Pick how often this shows up."
    if (!form.costBand) return "Pick the rough monthly weight, even if it is unknown."
    if (form.perfectEmployee.trim().length < 20) return "Describe what a strong employee would know or do."
  }
  if (stepIndex === 3) {
    if (!form.company.trim()) return "Add the company name to unlock the readout."
    if (!form.businessKind.trim()) return "Add the business type."
    if (!form.name.trim()) return "Add your name."
    if (!form.email.includes("@")) return "Add a valid email."
    if (!form.teamSize) return "Pick the operating size."
    if (!form.openToSession) return "Pick whether an AI Leverage Session is on the table."
  }
  return ""
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
  title: string
  value: string
  options: T
  onChange: (value: keyof T & string) => void
  large?: boolean
}) {
  return (
    <div className="check-choice-group">
      <h3>{title}</h3>
      <div className={large ? "check-choice-grid large" : "check-choice-grid"}>
        {Object.entries(options).map(([key, option]) => {
          const label = typeof option === "string" ? option : option.label
          const active = value === key
          return (
            <button
              key={key}
              type="button"
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
      <h3>{title}</h3>
      <div className="check-choice-grid multi">
        {Object.entries(options).map(([key, label]) => {
          const active = values.includes(key)
          return (
            <button
              key={key}
              type="button"
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
