import {
  reframeLine,
  type LeverageMapScore,
  type PublicLeverageResult,
} from "@/lib/leverage-map"

// One editorial composition shared by the inline result (client form) and the
// persistent /check/map/[token] page. Presentational only — no client hooks —
// so it renders identically in a Server or Client Component. Callers append
// their own action row (book / share / print / edit) below it.
export function LeverageMapReadout({
  company,
  score,
  result,
}: {
  company: string
  score: LeverageMapScore
  result: PublicLeverageResult
}) {
  // The free readout intentionally STOPS at one falsifiable proof step. The full
  // intervention design and the 90-day plan are held back for the call (see
  // toPublicResult) — the session is the value, not the readout.
  const moves: Array<{ no: string; label: string; body: string; sub?: string; key?: boolean }> = [
    { no: "01", label: "Where it costs you", body: result.where_it_costs_you },
    {
      no: "02",
      label: "Prove it in a week",
      body: result.first_fix,
      key: true,
    },
  ]

  return (
    <article className="lm" id="leverage-result">
      <header className="lm-head">
        <span className="lm-eyebrow">Praxis Leverage Map · {company}</span>
        <h2 className="lm-pattern">{result.pattern_label}</h2>
        <p className="lm-signal">
          Signal {score.composite}/9 · {score.resultBand}
        </p>
      </header>

      <blockquote className="lm-read">
        <span className="lm-label">What we heard</span>
        <p>{result.operator_readout}</p>
      </blockquote>

      <p className="lm-grounding">
        <span className="lm-label">You are already doing this right</span>
        {result.what_you_are_already_doing_right}
      </p>

      <p className="lm-reframe">{reframeLine(score)}</p>

      <ol className="lm-moves">
        {moves.map((move) => (
          <li key={move.no} className={move.key ? "lm-move key" : "lm-move"}>
            <span className="lm-move-no">{move.no}</span>
            <div className="lm-move-body">
              <h3>{move.label}</h3>
              <p>{move.body}</p>
              {move.sub ? <p className="lm-move-sub">{move.sub}</p> : null}
            </div>
          </li>
        ))}
      </ol>

      <p className="lm-fixable">
        <span className="lm-label">Why this is fixable</span>
        {result.why_this_is_fixable}
      </p>

      {result.what_you_cannot_see_yet ? (
        <p className="lm-unseen">
          <span className="lm-label">What you can&rsquo;t see yet</span>
          {result.what_you_cannot_see_yet}
        </p>
      ) : null}

      <div className="lm-unlock">
        <span className="lm-label">What a session unlocks</span>
        <p>{result.what_the_session_unlocks}</p>
      </div>
    </article>
  )
}
