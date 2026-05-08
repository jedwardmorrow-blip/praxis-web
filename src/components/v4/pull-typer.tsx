"use client"

import { useEffect, useRef, useState } from "react"

const PULL_TEXT =
  "Why fixed-price, not hours? Output-based pricing rewards velocity. Fixed pricing rewards correctness. Most operators have already paid for velocity, and gotten the wrong system fast. We price for the answer, not the keystrokes."

// Typewriter that fires once when the section enters viewport. Reduced motion
// and SSR fallback both render the full quote without animation.
export function PullTyper() {
  const ref = useRef<HTMLParagraphElement>(null)
  const [text, setText] = useState("")
  const [done, setDone] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (reduce) {
      setText(PULL_TEXT)
      setDone(true)
      return
    }

    const node = ref.current
    if (!node) return
    let timer: ReturnType<typeof setTimeout> | undefined
    let started = false

    const type = (i: number) => {
      if (i >= PULL_TEXT.length) {
        setDone(true)
        return
      }
      setText(PULL_TEXT.slice(0, i + 1))
      const ch = PULL_TEXT.charAt(i)
      const delay = ch === "." || ch === "?" ? 220 : ch === "," || ch === ";" ? 80 : Math.random() * 12 + 24
      timer = setTimeout(() => type(i + 1), delay)
    }

    const obs = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !started) {
            started = true
            type(0)
            obs.disconnect()
            break
          }
        }
      },
      { threshold: 0.5 }
    )
    obs.observe(node)

    return () => {
      if (timer) clearTimeout(timer)
      obs.disconnect()
    }
  }, [])

  return (
    <>
      <p className="pull-q" ref={ref}>
        <span className="typer">{text}</span>
        {!done && <span className="caret" />}
      </p>
      <div className={`pull-attr${done ? " in" : ""}`}>
        From the Praxis operator&rsquo;s manual <span className="red">·</span> 2026
      </div>
    </>
  )
}
