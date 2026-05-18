import Link from "next/link"
import "../v4.css"

export const metadata = {
  title: "Praxis Login",
  description: "Authorized access to the Praxis Operations workspace.",
}

export default function LoginPage() {
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
        <section className="portal-card" aria-labelledby="login-title">
          <div className="portal-kicker">Praxis Login</div>
          <h1 id="login-title">Authorized access.</h1>
          <p>
            Sign in with an approved Praxis email to enter the private operations workspace.
          </p>

          <div className="portal-actions">
            <a className="portal-primary" href="https://app.gopraxis.ai/login">
              Continue to Praxis
            </a>
          </div>

          <div className="portal-note">
            Access is restricted to approved internal users. Client access is not open at this time.
          </div>
        </section>
      </main>
    </div>
  )
}
