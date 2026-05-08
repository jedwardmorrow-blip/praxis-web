import { CountUp } from "../v4/count-up"

export function Stats() {
  return (
    <section className="stats">
      <div className="stats-row">
        <div className="stat">
          <div className="num">
            <CountUp to={79} />
            <span className="red">%</span>
          </div>
          <div className="lab">of companies fail to see ROI from AI investment</div>
        </div>
        <div className="stat">
          <div className="num">
            <CountUp to={93} />
            <span className="red">%</span>
          </div>
          <div className="lab">of AI budget goes to tools, not the operations underneath</div>
        </div>
        <div className="stat">
          <div className="num">
            <CountUp to={12} />
            <span className="gold">+</span>
          </div>
          <div className="lab">operational modules shipped in Cultivo, in production today</div>
        </div>
        <div className="stat">
          <div className="num">
            <CountUp to={5} />{" "}
            <span style={{ fontSize: 32, color: "var(--gold)" }}>YRS</span>
          </div>
          <div className="lab">operating in production before we sold our first engagement</div>
        </div>
      </div>
    </section>
  )
}
