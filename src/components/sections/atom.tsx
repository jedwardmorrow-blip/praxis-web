import Link from "next/link"
import { AtomCanvasMount } from "../v4/atom-canvas-mount"

export function Atom() {
  return (
    <section className="atom-section" id="world-model">
      <div className="atom-intro">
        <div className="eye">FIG. 01 · THE OPERATING ATOM · DRAWN FROM LIVE DATA</div>
        <h2>
          An <span className="gold">orbital schematic</span> of the firm. Every entity, every
          engagement, every table, drawn from the{" "}
          <span className="red">live production infrastructure.</span>
        </h2>
        <p>
          Most firms describe themselves with words. We render the actual structure. The atom
          below is <em>generated from the same context database that runs Cultivo in production</em>.
          The center is the mark. The rings are operators, products, methodology, engagements, and
          the tools layer above. Drag to rotate. Hover any node to inspect.
        </p>
      </div>

      <AtomCanvasMount />

      <div className="atom-foot">
        <div className="meta">
          &ldquo;Most firms have an org chart. We have an <em>operating atom</em>, drawn from the
          same database that runs production. If a relationship breaks in the data, the line breaks
          here.&rdquo;
        </div>
        <Link className="open-full" href="/world-model/3d">
          Open full atom <span className="arr">↗</span>
        </Link>
      </div>
    </section>
  )
}
