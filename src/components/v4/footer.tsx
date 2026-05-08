import Link from "next/link"
import { Badge } from "./badge"

export function FooterV4() {
  return (
    <footer className="site-foot">
      <div className="foot-inner">
        <div className="foot-mark">
          <div className="foot-badge">
            <Badge />
          </div>
          <div>
            <div className="fwm">
              PRAXIS<span className="dot">.</span>
            </div>
            <div className="fsub">Operational Intelligence</div>
          </div>
        </div>
        <div className="foot-tag">
          Operators who build software for other operators.{" "}
          <em>Six engagements per year. Both partners on every one.</em> Fixed-price. We price for
          the answer, not the keystrokes.
        </div>
        <div className="foot-meta">
          Phoenix · Berlin
          <br />
          Est. MMXXVI
          <br />
          <span className="red">·</span>{" "}
          <Link href="/world-model/3d">World Model</Link>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Praxis Operations Co. All operations reserved.</span>
        <span>gopraxis.ai · Operational Bureau No. 26</span>
      </div>
    </footer>
  )
}
