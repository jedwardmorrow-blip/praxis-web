"use client"

import { useEffect } from "react"

export function ScrollReveals() {
  useEffect(() => {
    const nodes = Array.from(
      document.querySelectorAll<HTMLElement>(".stagger, .narrative, .strip")
    )
    if (!nodes.length) return

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    nodes.forEach((node) => {
      if (!node.classList.contains("stagger")) return
      const siblings = Array.from(
        node.parentElement?.querySelectorAll<HTMLElement>(".stagger") ?? []
      )
      const index = siblings.indexOf(node)
      node.style.setProperty("--reveal-delay", `${Math.max(index, 0) * 55}ms`)
    })

    const revealAll = () => {
      nodes.forEach((node) => node.classList.add("in"))
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      revealAll()
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("in")
          observer.unobserve(entry.target)
        })
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.12 }
    )

    nodes.forEach((node) => observer.observe(node))
    requestAnimationFrame(() => {
      document.documentElement.classList.add("motion-reveals-ready")
    })

    return () => observer.disconnect()
  }, [])

  return null
}
