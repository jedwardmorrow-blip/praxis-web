import "../v4.css"
import "./websites.css"

import type { Metadata } from "next"
import Link from "next/link"
import { WebNav } from "@/components/v4/web-nav"
import { WebFooter } from "@/components/v4/web-footer"

const previewHref =
  "mailto:justin@gopraxis.ai?subject=Praxis%20%C2%B7%20Website%20preview&body=Hi%20Justin%2C%0A%0ABusiness%3A%20%0AWhat%20you%20have%20now%20(Facebook%2C%20an%20old%20site%2C%20nothing)%3A%20%0APhone%3A%20%0AWhat%20you%27d%20want%20it%20to%20do%3A%20%0A%0A%E2%80%94"

const steps = [
  {
    n: "01",
    title: "We Build The Preview",
    body: "We pull your real logo, photos, and Google reviews and design a working site around them. Not a template with your name dropped in. A site that is unmistakably yours.",
  },
  {
    n: "02",
    title: "You See It First",
    body: "We send you a link. You open your own site on your phone before you have spent a dollar. If it is not right, we fix it. If it is not for you, you walk away.",
  },
  {
    n: "03",
    title: "We Make It Live",
    body: "We put it on your own domain, wire the call button and quote form to your phone, and make sure it shows up when a neighbor searches for what you do.",
  },
  {
    n: "04",
    title: "We Keep It Working",
    body: "Hosting, edits, seasonal updates, and new reviews flowing in. You run the business. The site stays current without you touching it.",
  },
]

const included = [
  "A bespoke one-page site, designed from your brand",
  "Your real photos and Google reviews, placed properly",
  "Click-to-call and a quote form wired to your phone",
  "A review-request flow that earns you more reviews",
  "Your own domain set up, with the first year of hosting",
  "Mobile-first, fast, and findable on Google",
]

const addons = [
  {
    title: "Text-Back & Call-Back",
    price: "+$300/mo",
    body: "Never lose a lead to a missed call again. An AI-assisted text-back answers fast, captures the details, and routes the callback to you.",
    href: "/text-back-call-back",
    cta: "See how it works",
  },
  {
    title: "Google Profile Setup",
    price: "one-time",
    body: "Claim and sharpen your Google Business Profile so you show up on Maps and local search. This is where most of your calls actually start.",
    href: previewHref,
    cta: "Ask about it",
  },
  {
    title: "Brand Starter",
    price: "one-time",
    body: "No logo yet? We build a clean wordmark and color system from scratch, so the whole presence finally looks as good as the work.",
    href: previewHref,
    cta: "Ask about it",
  },
]

export const metadata: Metadata = {
  title: "Websites For Local Businesses, Built Before You Pay",
  description:
    "Praxis builds a working preview of your website from your real brand, photos, and Google reviews first. You see it live before you spend a dollar. $1,500, or six monthly payments.",
  alternates: {
    canonical: "https://gopraxis.ai/websites",
  },
  openGraph: {
    title: "Websites Built Before You Pay | PRAXIS",
    description:
      "A real site from your real brand, photos, and reviews. See it live before you decide. $1,500, or six monthly payments.",
    url: "https://gopraxis.ai/websites",
    siteName: "PRAXIS",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
  },
}

export default function WebsitesPage() {
  return (
    <div className="v4-page web-page">
      <WebNav previewHref={previewHref} />
      <main>
        {/* HERO */}
        <section className="web-hero">
          <div>
            <div className="ds-kicker">§ Local Web Presence · Praxis</div>
            <h1>
              A real website<span className="red">.</span>
              <br />
              Built before you pay<span className="gold">.</span>
            </h1>
            <p className="web-lede">
              We build a working preview of your site from your real brand, photos, and Google
              reviews first. You see it live on your phone before you spend a dollar. Then we make
              it yours.
            </p>
            <div className="ds-cta-row">
              <a className="hero-cta" href={previewHref}>
                See a preview <span className="arr">→</span>
              </a>
              <a className="hero-cta-secondary" href="#how">
                How it works <span className="arr">→</span>
              </a>
            </div>
            <p className="web-proof-line">
              For Tucson home-service and trade businesses with great reviews and no website, or a
              weak one that does not match how good the work is.
            </p>
          </div>

          <div className="web-preview" aria-label="Website preview example">
            <div className="web-preview-bar">
              <span className="web-dot" />
              <span className="web-dot" />
              <span className="web-dot" />
              <span className="web-preview-url">yourbusiness.com · preview</span>
            </div>
            <div className="web-preview-body">
              <span className="web-pv-tag">§ Free preview by Praxis</span>
              <div className="web-pv-h">Your business, done right.</div>
              <span className="web-pv-rev">
                <span className="web-pv-stars">★★★★★</span> 5.0 · 120 Google reviews
              </span>
              <div className="web-pv-photos" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <span className="web-pv-cta">Call now →</span>
              <p className="web-pv-foot">Built from your real brand, before you pay.</p>
            </div>
          </div>
        </section>

        {/* THE GAP */}
        <section className="web-band">
          <div className="web-band-inner">
            <div className="web-sec-head">
              <span className="sec-tag">§ The gap</span>
              <h2 className="sec-h">
                Your reputation is five stars. Your website is a Facebook page<span className="red">.</span>
              </h2>
            </div>
            <p className="web-p">
              The people ready to hire you check online first. If they find nothing, or a site that
              looks nothing like the quality of your work, they call the next name on the list. A
              site that matches your reputation turns the searches you are already getting into
              calls.
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="web-sec" id="how">
          <div className="web-sec-head">
            <span className="sec-tag">§ How it works</span>
            <h2 className="sec-h">
              See it before you buy it<span className="red">.</span>
            </h2>
          </div>
          <div className="web-steps">
            {steps.map((step) => (
              <article className="web-step" key={step.n}>
                <div className="web-step-num">{step.n}</div>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        {/* WHAT'S INCLUDED */}
        <section className="web-sec" style={{ paddingTop: 0 }}>
          <div className="web-sec-head">
            <span className="sec-tag">§ What you get</span>
            <h2 className="sec-h">
              Everything to turn a search into a call<span className="red">.</span>
            </h2>
          </div>
          <div className="web-included">
            {included.map((item, i) => (
              <div className="web-inc" key={item}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <p>{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PRICING */}
        <section className="web-sec" id="pricing" style={{ paddingTop: 0 }}>
          <div className="web-sec-head">
            <span className="sec-tag">§ Pricing</span>
            <h2 className="sec-h">
              One bespoke site. Pay in full or split it<span className="red">.</span>
            </h2>
            <p className="web-lede">
              No tiers and no surprises. The same bespoke build whether you have a tired site or
              nothing but a Facebook page. Pay in full and save, or spread it over six months.
            </p>
          </div>
          <div className="web-price-grid">
            <div className="web-price feature">
              <span className="web-price-tag">§ The build</span>
              <div className="web-price-name">Your bespoke site</div>
              <p className="web-price-sub">
                A complete one-page site designed from your real brand, photos, and Google reviews.
              </p>
              <div className="web-price-amt">
                <span className="mo">$1,500</span>
                <span className="per">paid in full</span>
              </div>
              <div className="web-price-setup">or 6 monthly payments of $300 ($1,800)</div>
              <ul>
                <li>Built from your brand, photos &amp; reviews</li>
                <li>Click-to-call and quote form to your phone</li>
                <li>A review-request flow that earns you more reviews</li>
                <li>Your domain set up, first year of hosting included</li>
              </ul>
              <a className="hero-cta-secondary" href={previewHref}>
                See a preview <span className="arr">→</span>
              </a>
            </div>

            <div className="web-price">
              <span className="web-price-tag">§ After year one</span>
              <div className="web-price-name">Care plan</div>
              <p className="web-price-sub">
                Optional. Keeps the site hosted, current, and the review flow running.
              </p>
              <div className="web-price-amt">
                <span className="mo">$97</span>
                <span className="per">/ month</span>
              </div>
              <div className="web-price-setup">first 12 months included with your build</div>
              <ul>
                <li>Hosting, security &amp; uptime</li>
                <li>Unlimited small edits</li>
                <li>Seasonal updates &amp; fresh photos</li>
                <li>Keeps your review-request flow running</li>
              </ul>
              <a className="hero-cta-secondary" href={previewHref}>
                Ask about care <span className="arr">→</span>
              </a>
            </div>
          </div>
          <p className="web-price-foot">
            Founding rate for the first Tucson businesses · pay in full and save, or split into six ·
            the site is built and shown before you commit.
          </p>
        </section>

        {/* ADD-ONS */}
        <section className="web-sec" style={{ paddingTop: 0 }}>
          <div className="web-sec-head">
            <span className="sec-tag">§ Add-ons</span>
            <h2 className="sec-h">
              Get found. Get the call. Never miss it<span className="red">.</span>
            </h2>
            <p className="web-lede">
              The site gets you found. These do more: never miss a lead, get found on Maps, or
              finally get a real logo. Add them when you are ready.
            </p>
          </div>
          <div className="web-addons">
            {addons.map((addon) => (
              <div className="web-addon" key={addon.title}>
                <div className="web-addon-top">
                  <h3>{addon.title}</h3>
                  <span className="price">{addon.price}</span>
                </div>
                <p>{addon.body}</p>
                {addon.href.startsWith("/") ? (
                  <Link href={addon.href}>{addon.cta} →</Link>
                ) : (
                  <a href={addon.href}>{addon.cta} →</a>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* FIT / HONESTY */}
        <section className="web-sec" style={{ paddingTop: 0 }}>
          <div className="web-fit">
            <div className="web-fit-panel">
              <span className="sec-tag">§ Good fit</span>
              <h3>Owner-run, well-reviewed, and getting calls.</h3>
              <p className="web-p">
                This is for local home-service and trade businesses that already do great work and
                have the reviews to prove it, but whose online presence is holding them back. If
                neighbors are searching for you, we can turn that into more calls.
              </p>
            </div>
            <div className="web-fit-panel muted">
              <span className="sec-tag">§ How we work</span>
              <h3>Built from your real brand. Nothing faked.</h3>
              <p className="web-p">
                Your photos, your reviews, your real services. We never use stock photos as your
                work, never invent claims you cannot back, and never put a license or award on your
                site that you do not hold. The preview is honest, which is exactly why it converts.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* FINAL CTA */}
      <section className="web-final">
        <div className="web-final-inner">
          <span className="sec-tag">§ Next step</span>
          <h2>
            See your site before you decide<span className="red">.</span>
          </h2>
          <p className="web-lede" style={{ marginLeft: "auto", marginRight: "auto" }}>
            Send Justin your business name and phone. We will build a real preview and text you the
            link. No cost, no commitment, no pressure.
          </p>
          <div className="ds-cta-row">
            <a className="hero-cta" href={previewHref}>
              See a preview <span className="arr">→</span>
            </a>
            <Link className="hero-cta-secondary" href="/text-back-call-back">
              Just missing calls? <span className="arr">→</span>
            </Link>
          </div>
        </div>
      </section>

      <WebFooter previewHref={previewHref} />
    </div>
  )
}
