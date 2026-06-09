import { Badge } from "./badge"

// Minimal trades nav for the Website-offer surface (/websites and any future local pages).
// FIREWALLED from the enterprise site on purpose: no Discovery Sprint, World Model, Login, or
// "Operational Intelligence". A cold-called trades owner who clicks through from a preview
// stays in the local-web-design world the banner promised, instead of landing on the
// operator-software story that reads as the wrong (or fishy) fit. See the harness firewall note.
export function WebNav({ previewHref }: { previewHref: string }) {
  return (
    <header className="header">
      <div className="left">
        <div className="h-badge">
          <Badge variant="static" />
        </div>
        <div>
          <div className="h-wm">
            PRAXIS<span className="dot">.</span>
          </div>
          <div className="h-sub">Local Websites · Tucson</div>
        </div>
      </div>
      <div className="h-actions">
        <a className="h-cta" href={previewHref}>
          See a preview →
        </a>
      </div>
    </header>
  )
}
