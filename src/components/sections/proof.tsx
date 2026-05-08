import { CountUp } from "../v4/count-up"

export function Proof() {
  return (
    <section className="proof" id="proof">
      <span className="sec-tag">§ Proof of work</span>
      <h2 className="sec-h">
        Real systems<span className="red">.</span> Real operators. Real numbers.
      </h2>
      <div className="proof-grid">
        <div className="case">
          <div className="case-head">
            <span className="cn">
              CULTIVO<span className="dot">.</span>
            </span>
            <span className="cm">
              Cannabis operational platform · 2024 → 2026 · in production
            </span>
          </div>
          <div className="case-body">
            <div className="ch">
              From three spreadsheets and one person&rsquo;s head to a multi-state operational
              platform. Cultivation, inventory, sales, and finance, on one source of truth.
            </div>
            <div className="cb">
              156 canonical tables. 12 operational modules. Daily users across cultivation,
              post-production, sales, and finance. Running in multi-state production. Praxis-owned
              product, formerly CultOps. The flagship evidence of how we build, and the foundation
              of every methodology we apply to client work.
            </div>
          </div>
          <div className="case-metrics">
            <div className="case-metric">
              <div className="mn">
                <CountUp to={156} />
              </div>
              <div className="ml">canonical tables in production</div>
            </div>
            <div className="case-metric">
              <div className="mn">
                <CountUp to={12} />+
              </div>
              <div className="ml">operational modules shipped</div>
            </div>
            <div className="case-metric">
              <div className="mn">99.94%</div>
              <div className="ml">uptime over 30 days</div>
            </div>
          </div>
          <div className="case-foot">
            <span>cultivo.ag →</span>
            <span>
              <span className="red">·</span> Multi-state production
            </span>
          </div>
        </div>
        <div className="case">
          <div className="case-head">
            <span className="cn">
              ASPIRE<span className="dot">.</span>
            </span>
            <span className="cm">Hospitality consulting · 2026 · active engagement</span>
          </div>
          <div className="case-body">
            <div className="ch">
              From a website that read like a 2014 brochure to a clear positioning surface and a
              diagnosed roadmap. Website rebuild shipped. Discovery Sprint delivered.
            </div>
            <div className="cb">
              Praxis rebuilt poweredbyaspire.com, then ran a structured Sprint surfacing where the
              operation breaks and what to build next. Findings delivered at aspire.gopraxis.ai.
              Detailed findings available under NDA on request.
            </div>
          </div>
          <div className="case-metrics">
            <div className="case-metric">
              <div className="mn">P1</div>
              <div className="ml">website rebuild · shipped 2026</div>
            </div>
            <div className="case-metric">
              <div className="mn">Sprint</div>
              <div className="ml">complete · findings delivered</div>
            </div>
            <div className="case-metric">
              <div className="mn">P2</div>
              <div className="ml">build proposal · in scoping</div>
            </div>
          </div>
          <div className="case-foot">
            <span>poweredbyaspire.com →</span>
            <span>Sprint delivered · aspire.gopraxis.ai</span>
          </div>
        </div>
      </div>
    </section>
  )
}
