import { Badge } from "../v4/badge"
import { HeroCursor } from "../v4/hero-cursor"

export function Hero() {
  return (
    <section className="hero" id="hero">
      <HeroCursor />
      <div className="hero-left">
        <div className="hero-badge-wrap">
          <div className="hero-badge-large">
            <Badge variant="stamp" />
          </div>
          <div className="hero-wm-stack">
            <div className="hwm">
              PRAXIS<span className="dot">.</span>
            </div>
            <div className="hsub">Operational Intelligence · Est. MMXXVI</div>
          </div>
        </div>
        <div className="eye">
          An operator-led software firm <span className="sep">·</span> Phoenix · Berlin{" "}
          <span className="sep">·</span> Est. 2026
        </div>
        <p className="wedge-leader">
          Off-the-shelf tools rarely capture how real operations actually work
          <span className="red">.</span>
        </p>
        <h1 aria-label="Operators who build.">
          <span className="word w1">Operators</span>
          {" "}
          <br />
          <span className="word w2">who</span>{" "}
          <span className="word w3">
            build<span className="red">.</span>
          </span>
        </h1>
        <p className="hero-clarifier">
          Operational Intelligence is the system underneath your tools, the one your team
          currently carries in their heads. We build it, document it, and hand it to you.
        </p>
        <p className="hero-meta-line">
          Founder-led. Fixed-scope. One painful workflow at a time.
        </p>
        <div className="hero-proof">
          <span className="label">Production-tested operating patterns</span>
          <span className="pn">Ops layer</span>
          <span className="sep">·</span>
          <span className="pn">156</span> tables<span className="sep">·</span>
          <span className="pn">12</span> modules<span className="sep">·</span>
          <span className="live-now">
            <span className="pulse-inline" />
            field-tested workflows
          </span>
        </div>
        <div className="hero-cta-row">
          <a
            href="mailto:justin@gopraxis.ai?subject=Praxis%20%C2%B7%20Discovery%20Sprint%20fit%20call&body=Hi%20Justin%2C%0A%0ACompany%3A%20%0AWorkflow%20worth%20inspecting%3A%20%0AWhat%20is%20leaking%3A%20%0A%0A%E2%80%94"
            className="hero-cta"
          >
            Book a 20-min fit call <span className="arr">→</span>
          </a>
          <a href="#how" className="hero-cta-secondary">
            See the sprint path <span className="arr">→</span>
          </a>
          <span className="hero-cta-meta">
            One workflow. One working proof. <span className="red">No account team.</span>
          </span>
        </div>
      </div>
      <div className="hero-right">
        <div className="live">
          <div className="live-bar">
            <span>Operating system · anonymized live state</span>
            <span className="right">
              <span className="pulse" />
              <span>Operational</span>
            </span>
          </div>
          <div className="live-rows">
            <div className="row">
              <span className="k">active cycles</span>
              <span className="v gold">7</span>
            </div>
            <div className="row">
              <span className="k">canopy assignments</span>
              <span className="v gold">196</span>
            </div>
            <div className="row">
              <span className="k">in flowering</span>
              <span className="v">3 cycles</span>
            </div>
            <div className="row">
              <span className="k">in drying</span>
              <span className="v">2 cycles</span>
            </div>
            <div className="row">
              <span className="k">brain rows</span>
              <span className="v">985</span>
            </div>
          </div>
          <div className="live-foot">
            One production-tested operating model. The same patterns ship in every client
            engagement.
          </div>
        </div>
      </div>
    </section>
  )
}
