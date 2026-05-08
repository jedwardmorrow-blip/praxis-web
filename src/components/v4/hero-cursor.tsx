"use client"

import { useEffect } from "react"

// Tracks cursor inside .hero, sets --cx and --cy CSS variables
// for the radial gradient overlay. Skipped on touch and reduced-motion.
export function HeroCursor() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) return

    const hero = document.querySelector<HTMLElement>(".hero")
    if (!hero) return

    let raf = 0
    let pendingX = 30
    let pendingY = 35

    const flush = () => {
      hero.style.setProperty("--cx", `${pendingX}%`)
      hero.style.setProperty("--cy", `${pendingY}%`)
      raf = 0
    }

    const onMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect()
      pendingX = ((e.clientX - rect.left) / rect.width) * 100
      pendingY = ((e.clientY - rect.top) / rect.height) * 100
      if (!raf) raf = requestAnimationFrame(flush)
    }

    hero.addEventListener("mousemove", onMove)
    return () => {
      hero.removeEventListener("mousemove", onMove)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return null
}
