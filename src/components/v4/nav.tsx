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
        <Link href="/discovery-sprint">Discovery Sprint</Link>
        <Link href="/#how">How</Link>
        <Link href="/#proof">Proof</Link>
        <Link href="/#activity">Live</Link>
        <Link href="/#people">People</Link>
        <Link href="/world-model/3d">World Model</Link>
        <Link href="/login">Praxis Login</Link>
      </nav>
      <div className="h-actions">
        <Link className="h-portal" href="/login">
          Praxis Login
        </Link>
        <a
          className="h-cta"
          href="mailto:justin@gopraxis.ai?subject=Praxis%20%C2%B7%20Discovery%20Sprint%20fit%20call&body=Hi%20Justin%2C%0A%0ACompany%3A%20%0AWorkflow%20worth%20inspecting%3A%20%0AWhat%20is%20leaking%3A%20%0A%0A%E2%80%94"
        >
          Book fit call →
        </a>
      </div>
    </header>
  )
}
