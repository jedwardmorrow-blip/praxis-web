import "../v4.css"
import "./apache.css"

import type { Metadata } from "next"
import Link from "next/link"
import { Nav } from "@/components/v4/nav"
import { FooterV4 } from "@/components/v4/footer"

const justinEmail =
  "https://mail.google.com/mail/?view=cm&fs=1&to=justin@gopraxis.ai&su=Apache%20Business%20Systems%20%C2%B7%20Website%20%2B%20Discovery%20Sprint"
const apachePreview = "https://apache-business-systems.vercel.app"

const inspectList = [
  "Where the revenue actually lives",
  "Where the leads come from",
  "What the new site should lead with",
  "What to feature, what to retire",
  "Where systems save the team time",
]

const websiteWins = [
  {
    t: "A real front door",
    b: "Turns a decade-old site, one losing the “postage meter Tucson” search to a competitor, into something that brings in business.",
  },
  {
    t: "The whole Apache, up front",
    b: "Ends the “they just do postage meters” problem by leading with the full range: shipping, parcel lockers, document, and phones.",
  },
  {
    t: "Leads you lose today",
    b: "A clear contact and service path, plus basic local search, captures inbound the current site quietly drops on the floor.",
  },
  {
    t: "Time back for the team",
    b: "Online service requests and supply reorders mean fewer interruptions and less phone tag. The site does work so people do not have to.",
  },
  {
    t: "Wake up the base",
    b: "Show long-time mail customers the lines they never knew Apache offered. The cheapest growth there is.",
  },
  {
    t: "Looks like sixty years of trust",
    b: "Quiet credibility for the serious clients Apache serves, who judge a vendor by whether the site looks alive.",
  },
]

const lenses = [
  {
    n: "Lens 01",
    t: "The Revenue Map",
    b: "Where Apache actually makes money: equipment sales versus recurring service contracts versus supplies versus leases, across all five categories. For a dealer the profit usually lives in the recurring service and supply annuity, not the box on the floor. We confirm where that holds, and find the lines that look busy but barely pay.",
    out: "Tells the site which lines to put first.",
  },
  {
    n: "Lens 02",
    t: "The Lead Engine",
    b: "How new business actually shows up: referrals, the sixty-year base, manufacturer leads, renewals, repeat customers. We trace where the next customer really comes from, and where the base is leaking: lapsed accounts, contracts never renewed, a mail customer never offered shipping or phones.",
    out: "Tells the site whose attention to win.",
  },
  {
    n: "Lens 03",
    t: "Lean In",
    b: "Where to double down: the lines that are growing and profitable, parcel lockers and shipping riding e-commerce, document, phones, and the recurring annuity, plus the one edge no competitor can copy, sixty years of trust and a local hand on the phone.",
    out: "Becomes the headline of the new site.",
  },
  {
    n: "Lens 04",
    t: "Lean Away",
    b: "Where to stop spending the team’s hours on low-return work and promises that are hard to keep. Focus is a strategy. The site should reflect the business Apache wants more of, not all of it weighted equally.",
    out: "Keeps the site honest and focused.",
  },
]

const sprintSteps = [
  {
    n: "01",
    t: "A Recorded Call",
    b: "A short call, recorded and transcribed, about how Apache really runs: the lines, the customers, the week. Recording it means nothing gets lost and it becomes the map.",
  },
  {
    n: "02",
    t: "The Numbers",
    b: "A light look at the books and where the time goes. Revenue, margin, and effort by line. Enough to see the shape, not a full audit.",
  },
  {
    n: "03",
    t: "The Map",
    b: "Synthesis: the revenue map, the lead engine, and the lean-in and lean-away picture, from the calls and the numbers together.",
  },
  {
    n: "04",
    t: "The Systems View",
    b: "How the work and the handoffs flow, and where simple systems, starting with the website, give the team time back.",
  },
  {
    n: "05",
    t: "The Readout",
    b: "A clear picture of where Apache makes money and finds customers, and exactly what the new site should say and lead with.",
  },
]

const deliverables = [
  {
    t: "New website direction",
    m: "Exactly what the site should lead with, page by page, drawn from the findings.",
  },
  {
    t: "Apache revenue and effort map",
    m: "What every line earns against the effort it costs, by category.",
  },
  {
    t: "Lead-engine map",
    m: "Where business comes from today, and where it is leaking.",
  },
  {
    t: "Lean-in / lean-away calls",
    m: "The few bets worth the focus, and what to ease off of.",
  },
  {
    t: "A simple systems view",
    m: "Where the website and a few light tools give the team time back.",
  },
]

const sprintThemes = [
  "Where the money actually comes from today, and which parts are growing or shrinking.",
  "Where new customers come from, and what finding them currently costs.",
  "What deserves more of your energy, and what deserves less.",
  "How work moves through the shop, from the phone ringing to the invoice getting paid.",
  "What the website should say about Apache, and the story it should tell.",
]

const bringList = [
  "Revenue by category for the last year, even rough",
  "The ZoomInfo invoice, and who actually uses it",
  "How many service contracts are active right now",
  "Which parts of Zoho actually get used",
  "The three customer testimonial videos, wherever they live",
  "Top ten customers last quarter, and what each buys",
]

export const metadata: Metadata = {
  title: "Apache Business Systems · Website Overhaul · Praxis",
  description:
    "Praxis is rebuilding Apache Business Systems’ website. First, a short Discovery Sprint to find where the revenue and the leads actually come from, so the new site leads with what drives the business.",
  robots: { index: false, follow: false },
  alternates: { canonical: "https://gopraxis.ai/apache" },
  openGraph: {
    title: "Apache Business Systems · Website Overhaul · Praxis",
    description:
      "A new website, built on what actually pays. Prepared for Apache Business Systems.",
    url: "https://gopraxis.ai/apache",
    siteName: "PRAXIS",
    locale: "en_US",
    type: "website",
  },
}

export default function ApachePage() {
  return (
    <div className="v4-page apache-sprint">
      <Nav />
      <main>
        {/* HERO */}
        <section className="ax-hero">
          <div className="ax-hero-grid">
            <div>
              <div className="ax-eye">
                § Website Overhaul <span className="sep">·</span> Apache Business Systems{" "}
                <span className="sep">·</span> Est. 1961
              </div>
              <p className="ax-lead-type">
                Sixty years of Apache, finally shown in full, and a site that brings the next
                customer to the <span className="gold">door</span>.
              </p>
              <h1 className="ax-h1" aria-label="A new website, built on what actually pays.">
                <span className="ln">
                  <i>A new website,</i>
                </span>
                <span className="ln">
                  <i style={{ animationDelay: "0.12s" }}>built on what</i>
                </span>
                <span className="ln">
                  <i style={{ animationDelay: "0.24s" }}>
                    actually pays<span className="red">.</span>
                  </i>
                </span>
              </h1>
              <p className="ax-clar">
                Praxis is rebuilding Apache&apos;s website. First we run a short Discovery Sprint to
                learn where the revenue and the leads actually come from, so the new site leads with
                what drives the business, not just a sharper version of the old one.
              </p>
              <div className="ax-cta-row ax-hero-actions">
                <a className="ax-cta" href={justinEmail} target="_blank" rel="noopener noreferrer">
                  Email Justin <span className="arr">→</span>
                </a>
                <a className="ax-cta2" href={apachePreview} target="_blank" rel="noopener noreferrer">
                  View preview <span className="arr">→</span>
                </a>
              </div>
              <p className="ax-meta">
                <span className="lbl">The deal, up front</span>
                <br />
                No invoice, it&apos;s family, and it sharpens how we work. <span className="gold">·</span>{" "}
                The Sprint feeds the new site. <span className="gold">·</span> You keep everything.
              </p>
            </div>
            <aside className="ax-panel" aria-label="Sprint at a glance">
              <div className="bar">
                <span>PX-DS · Apache Business Systems</span>
                <span className="live">
                  <span className="pulse" />
                  scope locked
                </span>
              </div>
              <div className="core">
                <div className="stat">
                  <div className="n">60</div>
                  <div className="l">Years</div>
                </div>
                <div className="stat">
                  <div className="n">21</div>
                  <div className="l">Lines</div>
                </div>
                <div className="stat">
                  <div className="n">5</div>
                  <div className="l">Categories</div>
                </div>
              </div>
              <div className="list">
                {inspectList.map((item) => (
                  <div className="row" key={item}>
                    <span className="mk" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="foot">
                Not a sales call. The homework that makes the new website actually work.
              </div>
            </aside>
          </div>
        </section>

        {/* THE JOB */}
        <section className="ax-band">
          <div className="ax-job-grid">
            <div>
              <span className="ax-tag">§ Why a Sprint before the site</span>
              <h2 className="ax-h2">
                Build the site around the truth<span className="red">.</span>
              </h2>
            </div>
            <div>
              <p className="ax-lead">
                The current site is a decade out of date and quietly losing ground in search to
                other Tucson dealers. Rather than redesign it on guesswork, we spend a little time
                learning how Apache actually makes money and finds customers, then build the new
                site to lead with that. Same reason we do it for any operator: a website only works
                when it is built on what is real.
              </p>
            </div>
          </div>
        </section>

        {/* WHAT THE SITE DOES */}
        <section className="ax-band">
          <span className="ax-tag">§ What the new site does</span>
          <h2 className="ax-h2">
            A website that pulls its weight<span className="red">.</span>
          </h2>
          <div className="ax-wins">
            {websiteWins.map((w) => (
              <article className="ax-win" key={w.t}>
                <h3>{w.t}</h3>
                <p>{w.b}</p>
              </article>
            ))}
          </div>
          <p className="ax-systems-line">
            Praxis streamlines operational efficiency through systems. The website is the first of
            those systems, and the one your customers see.{" "}
            <a href={apachePreview} target="_blank" rel="noopener noreferrer">
              See where the new site is headed <span className="arr">→</span>
            </a>
          </p>
        </section>

        {/* FOUR LENSES */}
        <section className="ax-band">
          <span className="ax-tag">§ The four lenses</span>
          <h2 className="ax-h2">
            Four questions the site needs answered<span className="red">.</span>
          </h2>
          <div className="ax-lenses">
            {lenses.map((l) => (
              <article className="ax-lens" key={l.n}>
                <div className="ln-tag">{l.n}</div>
                <h3>
                  {l.t}
                  <span className="red">.</span>
                </h3>
                <p>{l.b}</p>
                <div className="out">
                  <b>For the site</b>
                  {l.out}
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* THE SHAPE */}
        <section className="ax-band">
          <span className="ax-tag">§ The shape</span>
          <h2 className="ax-h2">
            Built around a working shop<span className="red">.</span>
          </h2>
          <div className="ax-timeline">
            {sprintSteps.map((s) => (
              <article className="ax-step" key={s.n}>
                <div className="num">{s.n}</div>
                <h4>{s.t}</h4>
                <p>{s.b}</p>
              </article>
            ))}
          </div>
          <p className="ax-pace">
            <span className="gold">On pace:</span> five steps, not five back-to-back days. One
            focused call, the rest in short messages around the shop&apos;s schedule, because a
            working shop has no afternoons to clear.
          </p>
        </section>

        {/* SPRINT QUESTIONS */}
        <section className="ax-band" id="sprint-questions">
          <span className="ax-tag">§ Sprint questions</span>
          <h2 className="ax-h2">
            What the first call covers<span className="red">.</span>
          </h2>
          <p className="ax-q-intro">
            One conversation, about an hour, Jon and Viktor together. It gets recorded so I can
            listen instead of scribbling notes, and so nothing gets lost or remembered wrong.
            Nothing here is a test and none of it needs preparation. This is just so you know
            what&apos;s coming.
          </p>
          <div className="ax-q-grid">
            <div className="ax-themes">
              {sprintThemes.map((t, i) => (
                <div className="ax-q" key={t}>
                  <span className="qn">{String(i + 1).padStart(2, "0")}</span>
                  <p>{t}</p>
                </div>
              ))}
            </div>
            <aside className="ax-panel ax-bring" aria-label="Worth having handy">
              <div className="bar">
                <span>Worth having handy</span>
                <span>No prep required</span>
              </div>
              <div className="list">
                {bringList.map((item) => (
                  <div className="row" key={item}>
                    <span className="mk" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="foot">
                None of this is homework. If a number isn&apos;t handy, a rough guess is fine,
                and we&apos;ll firm it up after the call.
              </div>
            </aside>
          </div>
          <p className="ax-pace">
            <span className="gold">After the call:</span> the homework is mine. You&apos;ll see
            everything that comes out of it before it goes anywhere.
          </p>
        </section>

        {/* DELIVERABLES */}
        <section className="ax-band">
          <div className="ax-inv">
            <div>
              <span className="ax-tag">§ What you keep</span>
              <h2 className="ax-inv-h">
                Not a deck<span className="red">.</span>
                <br />A site that works.
              </h2>
            </div>
            <div className="ax-delivs">
              {deliverables.map((d, i) => (
                <div className="ax-deliv" key={d.t}>
                  <span className="dn">{String(i + 1).padStart(2, "0")}</span>
                  <p>
                    {d.t}
                    <span className="m">{d.m}</span>
                  </p>
                </div>
              ))}
              <p className="ax-own">You own all of it, whether or not we do anything after.</p>
            </div>
          </div>
        </section>

        {/* STRAIGHT TALK */}
        <section className="ax-band">
          <span className="ax-tag">§ Straight talk</span>
          <h2 className="ax-h2">
            Why there&apos;s no invoice<span className="red">.</span>
          </h2>
          <div className="ax-pb">
            <div className="pb">
              <h3>Why it&apos;s free</h3>
              <p>
                It&apos;s family, and it&apos;s the business I grew up around. Honestly it is a favor
                both ways: you get a website built on what is true, and we get to sharpen the way
                Praxis works on a real, sixty-year business. What I&apos;d ask back is not money,
                just a couple of recorded calls, a look at the numbers, and an introduction or two
                down the road if it helps.
              </p>
            </div>
            <div className="pb muted">
              <h3>What it isn&apos;t</h3>
              <p>
                It is not a sales pitch, and it is not a magic fix by Friday. It gives you the shape,
                the big moves, and a website built on them. The hard calls come from Apache&apos;s
                own numbers, not from me.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL */}
        <section className="ax-final">
          <span className="ax-tag">§ Next step</span>
          <p className="ax-lead-type">
            No pitch. One short recorded call to walk the lines and how customers find you.
          </p>
          <h2 className="ax-final-h">
            Let&apos;s book the
            <br />
            first call<span className="red">.</span>
          </h2>
          <p className="ax-final-p">
            From there, the new site mostly writes itself. It can wait until we know what it should
            say.
          </p>
          <div className="ax-cta-row">
            <a className="ax-cta" href={justinEmail} target="_blank" rel="noopener noreferrer">
              Email Justin <span className="arr">→</span>
            </a>
            <Link className="ax-cta2" href="/">
              Explore Praxis <span className="arr">→</span>
            </Link>
          </div>
          <p className="ax-contact-note">
            Or reach me directly at <a href="mailto:justin@gopraxis.ai">justin@gopraxis.ai</a>
          </p>
        </section>
      </main>
      <FooterV4 />
    </div>
  )
}
