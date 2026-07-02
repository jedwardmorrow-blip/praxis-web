"use client"

import { useState } from "react"
import type { ProbeResponse } from "@/lib/leverage-map"

// The probe-return loop: the readout's "Prove it in a week" move ends in a number
// the owner reads themselves. This is where the number comes back. On submit the
// map re-renders with the priced response, so the shareable map stops being a
// static brochure and becomes the first live exchange of the engagement.
//
// Renders in three states: invite (no probe yet), pending (submitting), and
// returned (either just submitted or loaded from a prior visit — the map
// remembers). Hidden from print: the printed map is the artifact, not the form.

type StoredProbe = {
  value: string
  note: string | null
  response: ProbeResponse | null
  at: string
}

export function ProbeReturn({ token, existing }: { token: string; existing: StoredProbe | null }) {
  const [value, setValue] = useState("")
  const [note, setNote] = useState("")
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [returned, setReturned] = useState<StoredProbe | null>(existing)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!value.trim() || busy) return
    setBusy(true)
    setError(null)
    try {
      const res = await fetch("/api/leverage-map/probe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mapToken: token, value: value.trim(), note: note.trim() }),
      })
      const data = await res.json()
      if (!res.ok || !data?.ok) {
        setError("That did not save. Give it another try in a moment.")
        return
      }
      setReturned({ value: value.trim(), note: note.trim() || null, response: data.response ?? null, at: new Date().toISOString() })
    } catch {
      setError("That did not save. Give it another try in a moment.")
    } finally {
      setBusy(false)
    }
  }

  if (returned) {
    return (
      <div className="lm-probe lm-probe-returned">
        <span className="lm-probe-label">Your probe came back</span>
        <p className="lm-probe-number">{returned.value}</p>
        {returned.response ? (
          <>
            <h3>{returned.response.headline}</h3>
            <p>{returned.response.body}</p>
          </>
        ) : null}
      </div>
    )
  }

  return (
    <form className="lm-probe" onSubmit={submit}>
      <span className="lm-probe-label">Ran the probe?</span>
      <h3>Bring the number back.</h3>
      <p>
        Move 02 ends in a number only you can read. Log it here and this map prices it against
        what you told us, so the call starts from a measured leak instead of a hunch.
      </p>
      <div className="lm-probe-fields">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Your number (e.g. 7 missed calls)"
          maxLength={200}
          aria-label="Probe result"
        />
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Anything surprising? (optional)"
          maxLength={500}
          aria-label="Probe note"
        />
        {/* honeypot — hidden from humans, mirrors the quiz form */}
        <input type="text" name="_hp" tabIndex={-1} autoComplete="off" aria-hidden="true" className="lm-probe-hp" />
        <button type="submit" disabled={busy || !value.trim()}>
          {busy ? "Pricing it…" : "Log the number"}
        </button>
      </div>
      {error ? <p className="lm-probe-error">{error}</p> : null}
    </form>
  )
}
