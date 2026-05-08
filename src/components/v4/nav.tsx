import Link from "next/link"
import { Badge } from "./badge"

export function Nav() {
  return (
    <header className="header">
      <div className="left">
        <div className="h-badge" id="header-badge">
          <Badge variant="static" />
        </div>
        <div>
          <div className="h-wm">
            PRAXIS<span className="dot">.</span>
          </div>
          <div className="h-sub">Operational Intelligence</div>
        </div>
      </div>
      <nav className="h-nav" aria-label="Primary">
        <a href="#how">How</a>
        <a href="#proof">Proof</a>
        <a href="#activity">Live</a>
        <a href="#people">People</a>
        <Link href="/world-model/3d">World Model</Link>
      </nav>
      <a className="h-cta" href="#intake">
        File an intake →
      </a>
    </header>
  )
}
