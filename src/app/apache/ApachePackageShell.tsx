"use client"

import { useState } from "react"

type ReviewPage = {
  id: string
  navId?: string
  eyebrow: string
  title: string
  description: string
  src: string
}

const reviewPages: ReviewPage[] = [
  {
    id: "home",
    eyebrow: "Read First",
    title: "Start Here",
    description:
      "The plain-English walkthrough: what Praxis found, what Apache should review, and what happens next.",
    src: "/apache-package/apache-review-package-2026-06-22.html",
  },
  {
    id: "strategy",
    eyebrow: "Recommendation",
    title: "Strategy",
    description:
      "The decision layer: where to focus for revenue, what to validate, and how this turns into the website build.",
    src: "/apache-package/phase-2-strategy-review-2026-06-22.html",
  },
  {
    id: "map",
    eyebrow: "Opportunity",
    title: "Revenue Map",
    description:
      "The source map for Apache's offer mix, funnel constraints, margin questions, and strongest growth lanes.",
    src: "/apache-package/phase-1-revenue-map-2026-06-17.html",
  },
  {
    id: "brand",
    eyebrow: "Identity",
    title: "Brand Direction",
    description:
      "The visual and messaging direction for a more local, family-owned Apache presence.",
    src: "/apache-package/apache-brand-system-2026-06-22.html",
  },
  {
    id: "site",
    eyebrow: "The Build",
    title: "Website Draft",
    description:
      "The full working draft: nine pages built from the strategy, brand system, and revenue map. Browse it right here — every page and link works.",
    src: "/apache-site-paper-trail/index.html",
  },
  {
    id: "photos",
    eyebrow: "Homework",
    title: "Photo Shot List",
    description:
      "Nine photos make the site unmistakably Apache. Who and what to shoot, how to frame each one, and exactly where it lands on the site.",
    src: "/apache-site-paper-trail/photo-guide.html",
  },
]

const followUpPage: ReviewPage = {
  id: "follow-up",
  navId: "home",
  eyebrow: "Next Step",
  title: "Follow-Up Agenda",
  description:
    "Use this to align on priorities, answer the missing data questions, and decide whether to move into the website build.",
  src: "/apache-package/apache-review-package-2026-06-22.html#follow-up",
}

export function ApachePackageShell() {
  const [activePage, setActivePage] = useState<ReviewPage>(reviewPages[0])
  const activeNavId = activePage.navId ?? activePage.id

  return (
    <main className="apache-package-shell" aria-label="Apache growth review package">
      <header className="apache-package-nav">
        <div className="apache-package-nav__intro">
          <p>Private Review Package</p>
          <h1>Apache Growth Review</h1>
          <span>
            Recommended path: start with the overview, review the strategy, use the revenue map for
            context, check the brand direction, browse the website draft, and end on the photo shot
            list — that one is homework.
          </span>
          <button
            className="apache-package-nav__cta"
            onClick={() => setActivePage(followUpPage)}
            type="button"
          >
            Open Follow-Up Agenda
          </button>
        </div>

        <nav className="apache-package-nav__links" aria-label="Apache review sections">
          {reviewPages.map((page, index) => (
            <button
              aria-pressed={page.id === activeNavId}
              className={page.id === activeNavId ? "is-active" : undefined}
              key={page.id}
              onClick={() => setActivePage(page)}
              type="button"
            >
              <b>{String(index + 1).padStart(2, "0")}</b>
              <span>
                <small>{page.eyebrow}</small>
                {page.title}
              </span>
            </button>
          ))}
        </nav>
      </header>

      <section className="apache-package-reader" aria-live="polite">
        <a
          className="apache-package-reader__fullscreen"
          href={activePage.src}
          rel="noopener"
          target="_blank"
        >
          Open full screen ↗
        </a>
        <iframe
          className="apache-package-reader__iframe"
          key={activePage.id}
          src={activePage.src}
          title={`Apache ${activePage.title}`}
        />
      </section>
    </main>
  )
}
