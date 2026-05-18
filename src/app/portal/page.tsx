import Link from "next/link"
import "../v4.css"

export const metadata = {
  title: "Praxis Portal",
  description: "Access the Praxis Operations workspace.",
}

export default function PortalPage() {
  return (
    <div className="v4-page portal-page">
      <header className="portal-shell">
        <Link href="/" className="portal-brand" aria-label="Praxis home">
          PRAXIS<span className="dot">.</span>
        </Link>
        <Link href="/" className="portal-back">
          Main site
        </Link>
      </header>

      <main className="portal-main">
        <section className="portal-card" aria-labelledby="portal-title">
          <div className="portal-kicker">Praxis Operations Portal</div>
          <h1 id="portal-title">Enter the operating desk.</h1>
          <p>
            Use your Praxis email to sign in. Greg lands in his workflow; Justin lands in
            the operator dashboard.
          </p>

          <div className="portal-actions">
            <a className="portal-primary" href="https://app.gopraxis.ai/greg">
              Open Greg workspace
            </a>
            <a className="portal-secondary" href="https://app.gopraxis.ai/login">
              Sign in
            </a>
          </div>

          <div className="portal-note">
            Magic links are sent by Supabase Auth and expire after one use.
          </div>
        </section>
      </main>
    </div>
  )
}
