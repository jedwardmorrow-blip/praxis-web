"use client"

import { useState } from "react"
import { FadeUp } from "@/components/motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export function Intake() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      id="intake"
      className="w-full px-20 py-28 bg-surface max-sm:px-6"
      aria-labelledby="intake-heading"
    >
      <div className="max-w-[1200px] mx-auto">
        <FadeUp className="max-w-[640px]">
          <p className="text-[0.65rem] font-semibold tracking-[0.22em] uppercase text-brand mb-5">
            Work With Us
          </p>
          <h2
            id="intake-heading"
            className="font-heading font-bold tracking-[-0.01em] leading-[1.04] text-foreground mb-3.5"
            style={{ fontSize: "clamp(2.2rem, 4.2vw, 3.6rem)" }}
          >
            Tell us about your operation.
          </h2>
          <p className="text-[0.95rem] text-muted-foreground leading-[1.75] mb-14">
            We take on a limited number of engagements. If what you&apos;re building sounds like
            what we do, we want to hear about it. Five questions. No sales call required to start.
          </p>

          {submitted ? (
            <div
              className="p-8"
              style={{
                background: "oklch(0.52 0.165 22 / 0.10)",
                border: "1px solid oklch(0.52 0.165 22 / 0.30)",
              }}
              role="status"
            >
              <p className="text-[0.95rem] text-foreground leading-[1.72]">
                We received it. If there&apos;s a fit, we&apos;ll be in touch directly — no
                automated sequence, no SDR. Just us.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
              <FormField id="business" label="What's your business?">
                <Input
                  id="business"
                  name="business"
                  placeholder="Company name and what you do"
                  required
                  className="bg-card border-border/80 focus:border-brand/55 text-foreground placeholder:text-muted-foreground rounded-sm"
                />
              </FormField>

              <FormField id="size" label="How many people are on your team?">
                <select
                  id="size"
                  name="team_size"
                  required
                  defaultValue=""
                  className="w-full bg-card border border-border/80 focus:border-brand/55 text-foreground text-[0.92rem] px-4 py-3 outline-none transition-colors rounded-sm appearance-none cursor-pointer"
                >
                  <option value="" disabled>Select a range</option>
                  <option value="1-5">1–5</option>
                  <option value="6-20">6–20</option>
                  <option value="21-50">21–50</option>
                  <option value="51-100">51–100</option>
                  <option value="100+">100+</option>
                </select>
              </FormField>

              <FormField id="challenge" label="What's your biggest operational challenge right now?">
                <Textarea
                  id="challenge"
                  name="challenge"
                  placeholder="Be specific. The more detail, the better."
                  required
                  rows={4}
                  className="bg-card border-border/80 focus:border-brand/55 text-foreground placeholder:text-muted-foreground rounded-sm resize-y"
                />
              </FormField>

              <FormField id="tools" label="What tools are you currently using?">
                <Input
                  id="tools"
                  name="current_tools"
                  placeholder="e.g. QuickBooks, Slack, spreadsheets, custom software…"
                  className="bg-card border-border/80 focus:border-brand/55 text-foreground placeholder:text-muted-foreground rounded-sm"
                />
              </FormField>

              <FormField id="referral" label="How did you find us?">
                <Input
                  id="referral"
                  name="referral"
                  placeholder="Referral, social, search…"
                  className="bg-card border-border/80 focus:border-brand/55 text-foreground placeholder:text-muted-foreground rounded-sm"
                />
              </FormField>

              <button
                type="submit"
                className="self-start mt-2 inline-flex items-center gap-2 bg-brand hover:bg-brand-hover text-white text-[0.78rem] font-semibold tracking-[0.12em] uppercase px-8 py-4 transition-all duration-200 hover:-translate-y-px rounded-sm"
              >
                Submit →
              </button>
            </form>
          )}
        </FadeUp>
      </div>
    </section>
  )
}

function FormField({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-[0.68rem] font-semibold tracking-[0.14em] uppercase text-muted-foreground">
        {label}
      </Label>
      {children}
    </div>
  )
}
