"use client"

import dynamic from "next/dynamic"
import { useEffect, useRef, useState } from "react"

// Loaded only after the section enters viewport AND prefers-reduced-motion
// is not set. Three.js + bloom passes never enter the initial bundle.
const AtomCanvas = dynamic(() => import("./atom-canvas"), {
  ssr: false,
  loading: () => null,
})

export function AtomCanvasMount() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [shouldMount, setShouldMount] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setReduceMotion(mq.matches)
  }, [])

  useEffect(() => {
    if (reduceMotion) return
    const node = wrapRef.current
    if (!node) return
    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setShouldMount(true)
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(node)
    return () => obs.disconnect()
  }, [reduceMotion])

  return (
    <div ref={wrapRef} className="atom-stage-wrap">
      {shouldMount ? <AtomCanvas /> : <AtomFallback reduce={reduceMotion} />}
    </div>
  )
}

function AtomFallback({ reduce }: { reduce: boolean }) {
  // Static SVG schematic that matches the live atom layout. Always rendered
  // before the heavy canvas mounts (so the section never collapses), and is
  // the permanent state when prefers-reduced-motion is set.
  return (
    <div
      className="atom-stage"
      role="img"
      aria-label="Praxis operating atom: a six-orbit schematic of the firm"
    >
      <span className="corner tl" />
      <span className="corner tr" />
      <span className="corner bl" />
      <span className="corner br" />
      <span className="stage-tl">FIG. 01</span>
      <span className="stage-tr">PRAXIS · OPERATING ATOM</span>
      <span className="stage-bl">SCALE · 1:1 LOGICAL</span>
      <span className="stage-br">2026 · MMXXVI</span>
      <svg
        viewBox="-10 -10 20 20"
        preserveAspectRatio="xMidYMid meet"
        style={{
          width: "100%",
          height: "100%",
          display: "block",
          background: "linear-gradient(180deg, #03101f 0%, #061a33 100%)",
        }}
        aria-hidden
      >
        {[1.9, 3.0, 4.2, 5.6, 7.0].map((r, i) => (
          <circle
            key={i}
            cx="0"
            cy="0"
            r={r}
            fill="none"
            stroke="#C9A24B"
            strokeWidth="0.02"
            strokeDasharray="0.1 0.1"
            opacity="0.45"
          />
        ))}
        <circle cx="0" cy="0" r="0.55" fill="#C42130" />
        <circle cx="0" cy="0" r="1.32" fill="none" stroke="#C9A24B" strokeWidth="0.018" opacity="0.55" />
      </svg>
      <div className="hud-tr">
        <div>
          <span className="v gold">26</span> entities · <span className="v">06</span> orbits
        </div>
        <div>
          <span className="v">156</span> tables · <span className="v">12</span> modules
        </div>
        <div>
          <span className="v red">99.94%</span> uptime · 30d
        </div>
      </div>
      {reduce && (
        <div className="controls-hint" style={{ pointerEvents: "auto" }}>
          <div>Motion is reduced. Open the full atom at /world-model/3d to interact.</div>
        </div>
      )}
    </div>
  )
}
