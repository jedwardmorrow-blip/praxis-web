"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Nav() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 60)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-10 py-4",
        "border-b border-border backdrop-blur-2xl",
        "bg-background/84",
        "transition-transform duration-400 ease-[cubic-bezier(0.4,0,0.2,1)]",
        visible ? "translate-y-0" : "-translate-y-full"
      )}
      aria-label="Site navigation"
    >
      <Link href="#hero" className="flex items-center gap-1.5 no-underline">
        <span className="font-heading text-base font-bold tracking-[0.06em] text-foreground">
          PRAXIS
        </span>
        <span className="h-[5px] w-[5px] rounded-full bg-brand flex-shrink-0" aria-hidden="true" />
      </Link>

      <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
        {[
          { href: "#how", label: "How We Work" },
          { href: "#intelligence", label: "Intelligence" },
          { href: "#work", label: "Work" },
          { href: "#people", label: "People" },
        ].map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-muted-foreground hover:text-foreground transition-colors no-underline"
            >
              {label}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="#intake"
            className="text-[0.75rem] font-medium tracking-[0.1em] uppercase text-brand hover:text-brand-hover transition-colors no-underline"
          >
            Let&apos;s Talk
          </Link>
        </li>
      </ul>
    </nav>
  )
}
