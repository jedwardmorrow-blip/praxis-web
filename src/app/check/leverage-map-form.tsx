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

export function LeverageMapForm() {
  const [form, setForm] = useState<LeverageMapInput>(emptyInput)
  const [result, setResult] = useState<ApiResult | null>(null)
  const [error, setError] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const completion = useMemo(() => {
    const fields = [
      form.company,
      form.name,
      form.email,
      form.businessKind,
      form.teamSize,
      form.brokenMoment,
      form.momentStory,
      form.peopleTouches.length ? "x" : "",
      form.truthLocations.length ? "x" : "",
      form.frictions.length ? "x" : "",
      form.consequences.length ? "x" : "",
      form.painStatement,
      form.frequency,
      form.costBand,
      form.perfectEmployee,
      form.openToSession,
    ]
    return Math.round((fields.filter(Boolean).length / fields.length) * 100)
  }, [form])

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
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
          <span className="sec-tag">Start with one real operating moment</span>
          <h2 className="sec-h">
            The better the mess, the better the map<span className="red">.</span>
          </h2>
        </div>
        <div className="check-progress" aria-label={`Map completion ${completion}%`}>
          <span>{completion}% mapped</span>
          <div>
            <i style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>

      <form className="check-form" onSubmit={submit}>
        <section className="check-block identity">
          <div className="check-block-label">
            <span>01</span>
            <strong>Who is this for?</strong>
          </div>
          <div className="check-grid two">
            <Field label="Company" required>
              <input value={form.company} onChange={(e) => update("company", e.target.value)} required />
            </Field>
            <Field label="Business type" required>
              <input
                value={form.businessKind}
                onChange={(e) => update("businessKind", e.target.value)}
                placeholder="e.g. HVAC, CPA firm, distributor, clinic"
                required
              />
            </Field>
            <Field label="Your name" required>
              <input value={form.name} onChange={(e) => update("name", e.target.value)} required />
            </Field>
            <Field label="Email" required>
              <input type="email" value={form.email} onChange={(e) => update("email", e.target.value)} required />
            </Field>
            <Field label="Phone">
              <input value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </Field>
            <Field label="Role">
              <input value={form.role} onChange={(e) => update("role", e.target.value)} placeholder="Owner, operator, manager..." />
            </Field>
          </div>
          <ChoiceGrid
            title="Daily operating size"
            value={form.teamSize}
            options={TEAM_SIZES}
            onChange={(value) => update("teamSize", value)}
          />
        </section>

        <section className="check-block">
          <div className="check-block-label">
            <span>02</span>
            <strong>Pick the messy moment</strong>
          </div>
          <ChoiceGrid
            title="Which recent moment is closest?"
            value={form.brokenMoment}
            options={BROKEN_MOMENTS}
            onChange={(value) => update("brokenMoment", value)}
            large
          />
          <Field label="What happened?" hint="Plain English is best. Name the handoff, delay, customer, report, or owner interruption.">
            <textarea
              value={form.momentStory}
              onChange={(e) => update("momentStory", e.target.value)}
              rows={5}
              placeholder="Example: A quote request came in after hours, the details landed in voicemail, the owner had to ask two people what happened, and the customer was already talking to another company by the next morning."
            />
          </Field>
        </section>

        <section className="check-block">
          <div className="check-block-label">
            <span>03</span>
            <strong>Trace the handoff</strong>
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

        <section className="check-block">
          <div className="check-block-label">
            <span>04</span>
            <strong>Measure the consequence</strong>
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
          <ChoiceGrid
            title="Would you want a 60-90 minute on-site AI Leverage Session if the map shows a real opportunity?"
            value={form.openToSession}
            options={SESSION_OPENNESS}
            onChange={(value) => update("openToSession", value)}
          />
        </section>

        <div className="check-submit-row">
          <button className="check-submit" type="submit" disabled={submitting}>
            {submitting ? "Mapping..." : "Create leverage map"}
          </button>
          <p>
            You will get the pattern immediately. Justin gets the CRM summary and follow-up angle.
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
              <span>Operator readout</span>
              <p>{result.result.operator_readout}</p>
            </article>
            <article>
              <span>Why it matters</span>
              <p>{result.result.why_it_matters}</p>
            </article>
            <article>
              <span>First workflow to inspect</span>
              <p>{result.result.first_workflow_to_inspect}</p>
            </article>
            <article>
              <span>Follow-up angle</span>
              <p>{result.result.follow_up_opener}</p>
            </article>
          </div>
          <div className="check-questions">
            <span>Session questions</span>
            {result.result.session_questions.map((question, index) => (
              <p key={question}>
                <strong>{String(index + 1).padStart(2, "0")}</strong>
                {question}
              </p>
            ))}
          </div>
          <div className="check-result-actions">
            <a
              className="hero-cta"
              href={`mailto:justin@gopraxis.ai?subject=Praxis%20Leverage%20Map%20-%20${encodeURIComponent(form.company)}&body=${encodeURIComponent(
                `Hi Justin,\n\nI completed the Praxis Leverage Map.\n\nCompany: ${form.company}\nPattern: ${result.result.pattern_label}\nFirst workflow: ${result.result.first_workflow_to_inspect}\n\nI'd like to talk about an AI Leverage Session.\n\n- ${form.name}`,
              )}`}
            >
              Request AI Leverage Session <span className="arr">→</span>
            </a>
            <button type="button" onClick={() => setResult(null)} className="check-reset">
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
