"use client"

import { useEffect, useRef, useState } from "react"

type Props = {
  to: number
  durationMs?: number
}

// Counts from 0 to `to` once when scrolled into view. Respects
// prefers-reduced-motion by snapping straight to the final value.
export function CountUp({ to, durationMs = 1400 }: Props) {
  const ref = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      const raf = requestAnimationFrame(() => setValue(to))
      return () => cancelAnimationFrame(raf)
    }
    const el = ref.current
    if (!el) return

    let raf = 0
    let start = 0
    let played = false

    const ease = (t: number) => 1 - Math.pow(1 - t, 4)

    const step = (now: number) => {
      if (!start) start = now
      const elapsed = now - start
      const progress = Math.min(elapsed / durationMs, 1)
      setValue(Math.floor(ease(progress) * to))
      if (progress < 1) {
        raf = requestAnimationFrame(step)
      } else {
        setValue(to)
      }
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !played) {
            played = true
            raf = requestAnimationFrame(step)
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0.4 }
    )
    obs.observe(el)

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
    }
  }, [to, durationMs])

  return (
    <span ref={ref} className="ct">
      {value}
    </span>
  )
}
