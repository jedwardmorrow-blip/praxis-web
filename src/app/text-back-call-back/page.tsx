import "../v4.css"

import type { Metadata } from "next"
import Link from "next/link"
import { Nav } from "@/components/v4/nav"
import { FooterV4 } from "@/components/v4/footer"

const fitCallHref =
  "mailto:justin@gopraxis.ai?subject=Praxis%20%C2%B7%20Text-back%20and%20call-back%20setup&body=Hi%20Justin%2C%0A%0ABusiness%3A%20%0AIndustry%3A%20%0APhone%20system%20or%20CRM%3A%20%0AWhat%20happens%20when%20a%20call%20is%20missed%3A%20%0AWhere%20new%20leads%20come%20from%3A%20%0A%0A%E2%80%94"

const responseMoments = [
  "Missed calls",
  "After-hours voicemails",
  "Website form fills",
  "Quote requests",
  "Appointment questions",
  "Owner callback queues",
]

const setupSteps = [
  {
    day: "01",
    title: "Capture The Misses",
    body: "We map where calls, forms, texts, and voicemails currently land, then identify which moments need an immediate AI-assisted response.",
  },
  {
    day: "02",
    title: "Write The Response Logic",
    body: "Praxis drafts the text-back, intake, qualification, callback, and escalation scripts in your business voice, using the facts your team actually needs.",
  },
  {
    day: "03",
    title: "Connect The Tools",
    body: "We configure the response layer around your phone system, CRM, forms, calendar, inbox, or a lightweight queue when your current tools are messy.",
  },
  {
    day: "04",
    title: "Test The Handoffs",
    body: "We run missed-call, quote-request, after-hours, and urgent-callback scenarios so the assistant knows when to answer, when to route, and when to stop.",
  },
  {
    day: "05",
    title: "Launch And Tune",
    body: "You get the live workflow, callback queue, operator instructions, and a short improvement list for what should be automated next.",
  },
]

const deliverables = [
  "Missed-call text-back workflow",
  "AI-assisted intake and qualification script",
  "Callback routing and escalation rules",
  "Lead source and response-time visibility",
  "Launch checklist for the team",
]

const businessTypes = [
  "Home services",
  "Auto shops",
  "Clinics",
  "Professional services",
  "Local retail",
  "Specialty contractors",
]

export const metadata: Metadata = {
  title: "AI Text-Back And Call-Back Setup For Local Businesses",
  description:
    "Praxis sets up AI-assisted missed-call text-back, lead intake, and callback routing for local businesses that cannot afford to let new demand go cold.",
  openGraph: {
    title: "AI Text-Back And Call-Back Setup",
    description:
      "Missed calls, form fills, and after-hours leads answered fast, routed cleanly, and escalated to a human when it matters.",
    url: "https://gopraxis.ai/text-back-call-back",
  },
}

export default function TextBackCallBackPage() {
  return (
    <div className="v4-page tb-page">
      <Nav />
      <main>
        <section className="tb-hero">
          <div className="tb-hero-copy">
            <div className="ds-kicker">§ Local Response Layer · Praxis</div>
            <h1>
              AI text-back<span className="red">.</span>
              <br />
              Human call-back<span className="gold">.</span>
            </h1>
            <p className="tb-lede">
              Praxis sets up AI-assisted text-back and call-back workflows for local businesses
              that lose money when calls, form fills, and after-hours leads sit unanswered.
            </p>
            <div className="ds-cta-row">
              <a className="hero-cta" href={fitCallHref}>
                Set up response <span className="arr">→</span>
              </a>
              <a className="hero-cta-secondary" href="#setup-shape">
                See the setup <span className="arr">→</span>
              </a>
            </div>
            <p className="tb-proof-line">
              Built for businesses where speed-to-lead matters, but the owner still wants control
              over tone, routing, promises, and handoff.
            </p>
          </div>

          <div className="tb-phone-panel" aria-label="AI text-back workflow preview">
            <div className="tb-phone-top">
              <span>PX-TB · live response</span>
              <span className="live-now">
                <span className="pulse-inline" />
                ready
              </span>
            </div>
            <div className="tb-thread">
              <div className="tb-msg tb-msg-in">
                Missed call · 6:42 PM
                <span>New estimate request from Mesa</span>
              </div>
              <div className="tb-msg tb-msg-out">
                Thanks for calling. Want us to text a few quick questions so we can route this
                correctly?
              </div>
              <div className="tb-msg tb-msg-in">
                Yes, need help tomorrow.
                <span>Budget and address captured</span>
              </div>
              <div className="tb-alert">
                <span>Callback queued</span>
                <strong>Owner notified · high intent</strong>
              </div>
            </div>
            <div className="tb-phone-stats">
              <div>
                <span className="n">&lt;60s</span>
                <span className="l">first reply</span>
              </div>
              <div>
                <span className="n">24/7</span>
                <span className="l">capture</span>
              </div>
              <div>
                <span className="n">HITL</span>
                <span className="l">handoff</span>
              </div>
            </div>
          </div>
        </section>

        <section className="tb-band" id="setup-shape">
          <div>
            <span className="sec-tag">§ The leak</span>
            <h2 className="sec-h">
              Local demand dies in the gap between ringing and replying<span className="red">.</span>
            </h2>
          </div>
          <p>
            A missed call is not just a missed call. It is a customer choosing whoever replies
            first. The setup gives your business a response layer: answer fast, collect the right
            details, route the callback, and escalate anything that needs a person.
          </p>
        </section>

        <section className="tb-moments">
          <span className="sec-tag">§ Response moments</span>
          <h2 className="sec-h">
            The places where speed makes money<span className="red">.</span>
          </h2>
          <div className="tb-moment-grid">
            {responseMoments.map((moment, index) => (
              <div className="tb-moment" key={moment}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <p>{moment}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="tb-section">
          <span className="sec-tag">§ Five-day setup</span>
          <h2 className="sec-h">
            Designed to launch a controlled response workflow<span className="red">.</span>
          </h2>
          <div className="tb-timeline">
            {setupSteps.map((step) => (
              <article className="tb-step" key={step.day}>
                <div className="tb-step-num">{step.day}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="tb-inversion">
          <div className="tb-inversion-inner">
            <div>
              <span className="sec-tag">§ What gets installed</span>
              <h2>
                Not a chatbot<span>.</span>
                <br />
                A response system.
              </h2>
            </div>
            <div className="tb-deliverables">
              {deliverables.map((item, index) => (
                <div className="tb-deliverable" key={item}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="tb-fit">
          <div className="tb-fit-panel">
            <span className="sec-tag">§ Good fit</span>
            <h3>You already get calls or leads, but follow-up is inconsistent.</h3>
            <p>
              This is best for businesses with real inbound demand: people call, request quotes,
              ask about availability, or need a callback before they choose someone else.
            </p>
            <div className="tb-business-list">
              {businessTypes.map((type) => (
                <span key={type}>{type}</span>
              ))}
            </div>
          </div>
          <div className="tb-fit-panel muted">
            <span className="sec-tag">§ Boundaries</span>
            <h3>No cold blasting. No fake human. No unattended promises.</h3>
            <p>
              Praxis sets up response flows for people who contacted the business or gave permission
              to be contacted. Urgent, sensitive, or unclear requests route back to a human.
            </p>
          </div>
        </section>

        <section className="tb-final">
          <div className="tb-final-inner">
            <span className="sec-tag">§ Next step</span>
            <h2>
              Send Justin the place where leads go cold<span className="red">.</span>
            </h2>
            <p>
              We will look at your phone, form, inbox, CRM, or calendar flow and tell you whether a
              text-back and call-back setup can launch quickly.
            </p>
            <div className="ds-cta-row">
              <a className="hero-cta" href={fitCallHref}>
                Start the setup <span className="arr">→</span>
              </a>
              <Link className="hero-cta-secondary" href="/discovery-sprint">
                Larger workflow? <span className="arr">→</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <FooterV4 />
    </div>
  )
}
