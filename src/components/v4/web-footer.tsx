import { Badge } from "./badge"

// Minimal trades footer for the Website-offer surface. FIREWALLED from the enterprise site:
// no Phoenix/Berlin, "Operational Bureau", World Model, or "operators who build software for
// operators". Local and on-message so the offer surface stays coherent for a trades prospect.
export function WebFooter({ previewHref }: { previewHref: string }) {
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
            <div className="fsub">Local Websites · Tucson</div>
          </div>
        </div>
        <div className="foot-tag">
          Real websites for Tucson home-service businesses, built from your brand and shown
          before you pay.
        </div>
        <div className="foot-meta">
          Tucson, Arizona
          <br />
          <a href={previewHref}>See a preview →</a>
        </div>
      </div>
      <div className="foot-bottom">
        <span>© 2026 Praxis · gopraxis.ai</span>
        <span>Built in Tucson</span>
      </div>
    </footer>
  )
}
