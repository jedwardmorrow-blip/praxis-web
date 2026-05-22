export function Velocity() {
  return (
    <section className="velocity-section" id="velocity">
      <span className="sec-tag">§ Engagement velocity</span>
      <h2 className="sec-h">
        Five engagements<span className="red">,</span> at five points{" "}
        <span className="gold">in motion.</span>
      </h2>
      <p
        style={{
          fontFamily: "var(--font-plex-sans), 'IBM Plex Sans'",
          fontSize: 16,
          lineHeight: 1.6,
          color: "var(--paper-dim)",
          maxWidth: 740,
          marginTop: 18,
        }}
      >
        Each particle below is one anonymized engagement, plotted at its current position on the
        methodology pipeline. As an engagement moves through Discovery Sprint into Build Sprint
        into operating retainer, its dot drifts right.{" "}
        <em
          style={{
            color: "var(--gold)",
            fontStyle: "normal",
            fontWeight: 600,
          }}
        >
          Whoever lands the open slot becomes a sixth particle, starting at the left.
        </em>
      </p>

      <div className="velocity-frame">
        <div className="velocity-head">
          <div className="left">
            <span className="eye">§ Pipeline · 2026 · anonymized</span>
            <span className="h">
              5 active <span className="red">·</span> 1 open
            </span>
          </div>
          <span className="right">drifts left → right · auto-updated</span>
        </div>

        <div className="velocity-track">
          <div className="velocity-stages">
            <div className="velocity-stage">
              <div className="stage-name">Discovery Sprint</div>
              <div className="stage-dur">Five business days</div>
              <div className="stage-price">One workflow · working prototype</div>
              <span className="velocity-arrow">→</span>
            </div>
            <div className="velocity-stage">
              <div className="stage-name">Build Sprint</div>
              <div className="stage-dur">4 to 6 weeks</div>
              <div className="stage-price">Production workflow · fixed scope</div>
              <span className="velocity-arrow">→</span>
            </div>
            <div className="velocity-stage">
              <div className="stage-name">Operating Retainer</div>
              <div className="stage-dur">Monthly cadence</div>
              <div className="stage-price">Continuous improvement after launch</div>
            </div>
          </div>

          <div className="velocity-particles">
            <div className="vp build" style={{ top: 50, left: "62%" }}>
              <div className="dot" />
              <div className="label">
                ENGAGEMENT 01<span className="stage">Build · week 6</span>
              </div>
            </div>
            <div className="vp build above" style={{ top: 0, left: "41%" }}>
              <div className="dot" />
              <div className="label">
                ENGAGEMENT 02<span className="stage">Build · pre-week 1</span>
              </div>
            </div>
            <div className="vp sprint" style={{ top: 50, left: "24%" }}>
              <div className="dot" />
              <div className="label">
                ENGAGEMENT 03<span className="stage">Sprint · week 1</span>
              </div>
            </div>
            <div className="vp qualify" style={{ top: 50, left: "4%" }}>
              <div className="dot" />
              <div className="label">
                ENGAGEMENT 04<span className="stage">Qualify</span>
              </div>
            </div>
            <div className="vp qualify above" style={{ top: 0, left: "18%" }}>
              <div className="dot" />
              <div className="label">
                ENGAGEMENT 05<span className="stage">Qualify</span>
              </div>
            </div>
          </div>
        </div>

        <div className="velocity-foot">
          <div className="stats">
            <span>
              <strong>02</strong> in Build
            </span>
            <span>
              <strong>01</strong> in Sprint
            </span>
            <span>
              <strong>02</strong> in Qualify
            </span>
            <span className="red">
              <strong>01</strong> OPEN
            </span>
          </div>
          <div className="legend">
            <span className="swatch">
              <span className="sw q" /> Qualify
            </span>
            <span className="swatch">
              <span className="sw s" /> Sprint
            </span>
            <span className="swatch">
              <span className="sw b" /> Build
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
