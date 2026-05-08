// Operations Console, V4. Static numbers for first ship. Live wire to brain DB
// is a follow-up session.

export function Console() {
  return (
    <section className="console-section" id="activity">
      <span className="sec-tag">§ The firm in operation · right now</span>
      <h2 className="sec-h">
        A console<span className="red">,</span> not a brochure.
      </h2>
      <p
        style={{
          fontFamily: "var(--font-plex-sans), 'IBM Plex Sans'",
          fontSize: 16,
          lineHeight: 1.6,
          color: "var(--paper-dim)",
          maxWidth: 760,
          marginTop: 18,
        }}
      >
        Production state, capacity, integrity. Drawn from the same context database that runs
        Cultivo in production.{" "}
        <em
          style={{
            color: "var(--gold)",
            fontStyle: "normal",
            fontWeight: 600,
          }}
        >
          If we are operating, this console is moving.
        </em>
      </p>

      <div className="console">
        <div className="scan-beam" />

        <div className="csl-bar">
          <span className="l">
            § <strong>PRAXIS</strong> · OPERATIONS CONSOLE · v1.0
          </span>
          <span className="c">UTC</span>
          <span className="r">
            <span className="breathe" />
            <span>STATIC · refresh on next deploy</span>
          </span>
        </div>

        <div className="csl-row top">
          <div className="csl-panel">
            <div className="lab">
              <span>§ Production system · Cultivo</span>
              <span className="right">
                <span className="led" />
                multi-state
              </span>
            </div>
            <div className="prod-grid">
              <span className="k">tables</span>
              <span className="v gold">156</span>
              <span className="k">modules</span>
              <span className="v gold">12</span>
              <span className="k">uptime · 30d</span>
              <span className="v">99.94 %</span>
              <span className="k">scope</span>
              <span className="v">cult · inv · sales · fin</span>
              <span className="k">in production</span>
              <span className="v">multiple states</span>
            </div>
          </div>

          <div className="csl-panel">
            <div className="lab">
              <span>§ Capacity board</span>
              <span className="right">
                <span className="led" />
                Annual · 2026
              </span>
            </div>
            <div className="cap-summary">
              <div>
                <div className="num">
                  06<span className="suffix">/ yr · max</span>
                </div>
                <div className="label">Engagements per year</div>
              </div>
              <div className="right">
                <div className="v">
                  01
                  <span style={{ color: "var(--paper-mute)", fontSize: 14 }}> open</span>
                </div>
                <div className="label">Available now</div>
              </div>
            </div>
            <div className="cap-list" style={{ gridTemplateColumns: "1fr 1fr" }}>
              <div
                style={{
                  gridColumn: "1 / -1",
                  padding: "4px 0 12px",
                  borderBottom: "0.5px dashed var(--rule-soft)",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-plex-mono), 'IBM Plex Mono'",
                    fontSize: 9.5,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                    color: "var(--paper-mute)",
                    marginBottom: 6,
                  }}
                >
                  By stage · annual pipeline
                </div>
              </div>
              <CapStat n="02" label="in Build" tone="gold" />
              <CapStat n="01" label="in Sprint" tone="gold" />
              <CapStat n="02" label="in Qualify" tone="gold" />
              <CapStat n="01" label="OPEN" tone="red" />
              <a
                className="cap-open-slot"
                href="#intake"
                style={{ gridColumn: "1 / -1", marginTop: 14 }}
              >
                <span className="n">06</span>
                <span className="stage">Open slot · Q3 2026 start</span>
                <span className="bar" />
                <span className="open-cta">
                  File intake <span className="arr">→</span>
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="csl-row bottom">
          <div className="csl-panel">
            <div className="lab">
              <span>§ Operators on duty</span>
              <span className="right">
                <span className="led" />
                Both partners · every engagement
              </span>
            </div>
            <div className="op-list">
              <div className="op">
                <div className="name">
                  Justin Morrow<span className="dot">.</span>
                </div>
                <div className="role">AI engineering · product architecture · technical lead</div>
                <div className="status">
                  <span>JM-001</span>
                  <span className="red">
                    <span className="pulse-mini" />
                    ACTIVE
                  </span>
                </div>
              </div>
              <div className="op">
                <div className="name">
                  Greg Dunaway<span className="dot">.</span>
                </div>
                <div className="role">Client · partnership · engagement structuring</div>
                <div className="status">
                  <span>GD-001</span>
                  <span className="red">
                    <span className="pulse-mini" />
                    ACTIVE
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="csl-panel">
            <div className="lab">
              <span>§ Integrity</span>
              <span className="right">
                <span className="led" />
                All systems
              </span>
            </div>
            <div className="integrity-list">
              <Row lbl="schema lineage" ok ts="verified at deploy" />
              <Row lbl="RLS policies" val="4 layers" ok ts="verified at deploy" />
              <Row lbl="context db" val="live" ok ts="verified at deploy" />
              <Row lbl="backups" val="daily" ok ts="last 06:00 UTC" />
              <Row lbl="env / secrets" val="configured" ok ts="verified at deploy" />
              <Row lbl="deploy gate" val="npm build" ok ts="last build at deploy" />
            </div>
          </div>
        </div>

        <div className="csl-foot">
          <span>drawn from praxis.brain · console v1.0</span>
          <span className="right">STATIC · live wire pending</span>
        </div>
      </div>
    </section>
  )
}

function CapStat({
  n,
  label,
  tone,
}: {
  n: string
  label: string
  tone: "gold" | "red"
}) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
      <span
        style={{
          fontFamily: "var(--font-big-shoulders), 'Big Shoulders Display'",
          fontWeight: 800,
          fontSize: 26,
          color: tone === "red" ? "var(--red)" : "var(--paper)",
        }}
      >
        {n}
      </span>
      <span
        style={{
          fontFamily: "var(--font-plex-mono), 'IBM Plex Mono'",
          fontSize: 10.5,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color: tone === "red" ? "var(--red)" : "var(--gold)",
        }}
      >
        {label}
      </span>
    </div>
  )
}

function Row({
  lbl,
  val,
  ok,
  ts,
}: {
  lbl: string
  val?: string
  ok?: boolean
  ts?: string
}) {
  return (
    <div className="integrity-row">
      <span className="lbl">{lbl}</span>
      {val && <span className="val">{val}</span>}
      {ok && <span className="ok">OK</span>}
      {ts && <span className="ts">{ts}</span>}
    </div>
  )
}
