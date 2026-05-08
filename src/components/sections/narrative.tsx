export function Narrative() {
  return (
    <section className="narrative" id="narrative">
      <div className="nar-inner">
        <div className="nar-left">
          <div className="eye">§ Thesis · the seven-percent layer</div>
          <h3 className="nar-h">
            93<span style={{ opacity: 0.5 }}>%</span> goes
            <br />
            to the tools<span className="red">.</span>
            <br />7<span className="red">%</span> goes to
            <br />
            the layer.
          </h3>
          <div className="nar-stat">
            <div className="ninety">
              93<span className="pct">%</span>
            </div>
            <div className="seven">
              7<span className="pct">%</span>
            </div>
          </div>
          <div className="ratio-bar">
            <div className="a" />
            <div className="b" />
          </div>
        </div>
        <div className="nar-right">
          <p>
            Most AI and software investments fail because the operation underneath was never
            documented. The data is scattered. The logic lives in people&rsquo;s heads. The tools
            sit on top of that gap and produce reports nobody trusts.
          </p>
          <p>
            We know because we lived it. We ran a multi-state operation, watched every off-the-shelf
            tool fail us, and <strong>built the infrastructure ourselves</strong>. Now we build it
            for other operators.
          </p>
          <p>
            Cultivo is the proof: 156 tables, 12 modules, running in multi-state production since
            2024. The hierarchy problem and the tribal-knowledge problem are the same problem. We
            felt it, then we built the layer underneath.
          </p>
        </div>
      </div>
    </section>
  )
}
