import "../v4.css"

import type { Metadata } from "next"
import Link from "next/link"
import { Nav } from "@/components/v4/nav"
import { FooterV4 } from "@/components/v4/footer"

const fitCallHref =
  "mailto:justin@gopraxis.ai?subject=Praxis%20%C2%B7%20Discovery%20Sprint%20fit%20call&body=Hi%20Justin%2C%0A%0ACompany%3A%20%0AWorkflow%20worth%20inspecting%3A%20%0AWhat%20is%20leaking%3A%20%0AWhat%20would%20change%20if%20this%20worked%3A%20%0A%0A%E2%80%94"

const leakSignals = [
  "Lead intake and follow-up",
  "Quote or proposal handoff",
  "Dispatch and scheduling",
  "Compliance document review",
  "Reporting nobody trusts",
  "Owner decision bottlenecks",
]

const sprintDays = [
  {
    day: "01",
    title: "Workflow Capture",
    body: "We pick the workflow, trace the real path, and collect examples from the tools, inboxes, docs, exports, or spreadsheets where the work actually happens.",
  },
  {
    day: "02",
    title: "Leak Map",
    body: "Praxis identifies where time, revenue, trust, or owner attention is leaking, then separates symptoms from the leverage point worth prototyping.",
  },
  {
    day: "03",
    title: "Proof Build",
    body: "We build a working proof against real operating context: intake, review, routing, reporting, decision support, or another contained workflow surface.",
  },
  {
    day: "04",
    title: "Operator Review",
    body: "You react to the proof while the workflow is still malleable. We tighten the logic, expose gaps, and decide whether production build is justified.",
  },
  {
    day: "05",
    title: "Roadmap And Scope",
    body: "You leave with the workflow map, working proof, implementation path, risks, and a fixed-scope build recommendation if the opportunity is worth pursuing.",
  },
]

const deliverables = [
  "Workflow map of the target process",
  "Ranked automation and AI opportunities",
  "Working proof or demo tied to the real workflow",
  "30/60/90 day implementation roadmap",
  "Fixed-scope build recommendation",
]

export const metadata: Metadata = {
  title: "Discovery Sprint",
  description:
    "A five-business-day engagement for owner-led companies: inspect one painful workflow, prove the fix, and leave with a clear implementation path.",
  alternates: {
    canonical: "https://gopraxis.ai/discovery-sprint",
  },
  openGraph: {
    title: "Praxis Discovery Sprint",
    description:
      "One painful workflow. Five business days. Working proof. Clear implementation path.",
    url: "https://gopraxis.ai/discovery-sprint",
    siteName: "PRAXIS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
}

export default function DiscoverySprintPage() {
  return (
    <div className="v4-page ds-page">
      <Nav />
      <main>
        <section className="ds-hero">
          <div className="ds-hero-copy">
            <div className="ds-kicker">§ Discovery Sprint · Praxis</div>
            <h1 aria-label="One painful workflow. Five business days.">
              One painful workflow<span className="red">.</span>
              {" "}
              <br />
              Five business days<span className="gold">.</span>
            </h1>
            <p className="ds-lede">
              Praxis helps owner-led companies find the workflow where time, revenue, trust, or
              owner attention is leaking, then proves the fix with a working proof.
            </p>
            <div className="ds-cta-row">
              <a className="hero-cta" href={fitCallHref}>
                Book a 20-min fit call <span className="arr">→</span>
              </a>
              <a className="hero-cta-secondary" href="#sprint-shape">
                See the sprint <span className="arr">→</span>
              </a>
            </div>
            <p className="ds-proof-line">
              Built for owner-led service, regulated, and process-heavy businesses where the
              operating system still lives in people&apos;s heads.
            </p>
          </div>

          <div className="ds-command-panel" aria-label="Discovery Sprint command panel">
            <div className="ds-panel-bar">
              <span>PX-DS · workflow inspection</span>
              <span className="live-now">
                <span className="pulse-inline" />
                sprint slot open
              </span>
            </div>
            <div className="ds-panel-core">
              <div className="ds-panel-stat">
                <span className="n">01</span>
                <span className="l">workflow</span>
              </div>
              <div className="ds-panel-stat">
                <span className="n">05</span>
                <span className="l">business days</span>
              </div>
              <div className="ds-panel-stat">
                <span className="n">01</span>
                <span className="l">proof</span>
              </div>
            </div>
            <div className="ds-signal-list">
              {leakSignals.map((signal) => (
                <div className="ds-signal" key={signal}>
                  <span className="mark" />
                  <span>{signal}</span>
                </div>
              ))}
            </div>
            <div className="ds-panel-foot">
              No generic AI strategy. No hourly engineering menu. The sprint earns the build.
            </div>
          </div>
        </section>

        <section className="ds-band" id="sprint-shape">
          <div>
            <span className="sec-tag">§ The job</span>
            <h2 className="sec-h">
              Make the invisible workflow visible<span className="red">.</span>
            </h2>
          </div>
          <p>
            Most operational drag hides between systems: inbox to CRM, quote to follow-up, dispatch
            to reporting, compliance review to decision. The Discovery Sprint isolates one of those
            workflows, maps the real path, and tests whether software can remove the drag.
          </p>
        </section>

        <section className="ds-section">
          <span className="sec-tag">§ Five-day sprint</span>
          <h2 className="sec-h">
            Designed to create proof before scope<span className="red">.</span>
          </h2>
          <div className="ds-timeline">
            {sprintDays.map((item) => (
              <article className="ds-day" key={item.day}>
                <div className="ds-day-num">{item.day}</div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="ds-inversion">
          <div className="ds-inversion-inner">
            <div>
              <span className="sec-tag">§ What you get</span>
              <h2>
                Not a deck<span>.</span>
                <br />
                A working wedge.
              </h2>
            </div>
            <div className="ds-deliverables">
              {deliverables.map((item, index) => (
                <div className="ds-deliverable" key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ds-fit">
          <div className="ds-fit-card">
            <span className="sec-tag">§ Good fit</span>
            <h3>There is a named workflow and a real consequence.</h3>
            <p>
              The best sprint starts when your team can point to a process and say: this is slow,
              this is unreliable, this costs us follow-up, this keeps coming back to the owner, or
              this report cannot be trusted.
            </p>
          </div>
          <div className="ds-fit-card muted">
            <span className="sec-tag">§ Not yet</span>
            <h3>The problem is still too vague to prove.</h3>
            <p>
              If the ask is &quot;we need AI&quot; or &quot;we need a better system&quot; without
              one workflow, examples, and a decision owner, Praxis will help narrow the target
              before proposing a sprint.
            </p>
          </div>
        </section>

        <section className="ds-final">
          <div className="ds-final-inner">
            <span className="sec-tag">§ Next step</span>
            <h2>
              Send Justin one workflow worth inspecting<span className="red">.</span>
            </h2>
            <p>
              The fit call is short. We identify the workflow, confirm there is enough context to
              prove the fix, and decide whether a Discovery Sprint is the right first paid step.
            </p>
            <div className="ds-cta-row">
              <a className="hero-cta" href={fitCallHref}>
                Book a 20-min fit call <span className="arr">→</span>
              </a>
              <Link className="hero-cta-secondary" href="/#proof">
                View proof <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <FooterV4 />
    </div>
  )
}
