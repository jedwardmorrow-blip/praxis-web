# Leverage Map Quiz — Build Spec (v1)

**Repo:** `praxis-web-leverage-map-clean` (Next.js, deploys to gopraxis.ai/check)
**Goal:** Upgrade the Leverage Map self-serve assessment in three ways: convert it to a multi-step wizard, move lead capture to the end, and make the OpenAI integration deliver a genuinely valuable user-facing result. The foundation is good. Improve it, do not rebuild it.

## Read first
- This repo is a NON-STANDARD Next.js with breaking changes. Per `AGENTS.md`, read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Do not rely on memorized Next.js APIs.
- Key files:
  - `src/app/api/leverage-map/route.ts` — server route: scoring, OpenAI call, Supabase `praxis_leads` insert, Resend notify. Key is server-side (`process.env.OPENAI_API_KEY`). Keep it that way.
  - `src/lib/leverage-map.ts` — deterministic scoring engine (`scoreLeverageMap`), pattern dictionary (`LEVERAGE_PATTERNS`), option dictionaries, types, `fallbackAiResult`. This is the IP. Build on it.
  - `src/app/check/leverage-map-form.tsx` — current single-scroll assessment UI. This is what becomes the wizard.

## Do NOT change
- The deterministic `scoreLeverageMap` engine and pattern dictionaries. Scoring stays server-side and unchanged.
- Server-side key handling. No `NEXT_PUBLIC` key, no `dangerouslyAllowBrowser`, no client-side OpenAI calls.
- The Supabase `praxis_leads` insert and the Resend notification. Keep field mappings intact.
- The voice guardrails in the system prompt (no "diagnostic", "maturity", "competency"; no ROI promises; sharp-operator tone).
- Field names and option keys, so the API contract and scoring stay intact.

## Change 1 — Multi-step wizard (front-end, page.tsx)
Convert the single scroll into a stepped wizard, one section per screen, with a progress indicator. Mobile-first, since it is scanned from a QR on a phone. Step order:
1. Pick the messy moment (`brokenMoment`) plus the free-text story (`momentStory`).
2. Trace the handoff (`peopleTouches`, `truthLocations`, `frictions`).
3. Measure the consequence (`consequences`, `painStatement`, `frequency`, `costBand`) plus the perfect-employee free text (`perfectEmployee`).
4. Contact and context LAST (`company`, `businessKind`, `name`, `email`, `phone?`, `role?`, `teamSize`), then submit.

Validate per step. Do not let lead capture block the map. The user thinks first and hands over contact info only at the end to unlock the result.

## Change 2 — Capture last, result gated
The AI-generated leverage map is the reward for completing, shown after submit, which is also when contact info is collected. This fixes the current front-loaded capture that costs completions.

## Change 3 — Use the OpenAI API to its potential (route.ts)
- **Model:** set `OPENAI_LEVERAGE_MAP_MODEL` to a strong model for the user-facing synthesis, not `gpt-4.1-mini`. The readout is the conversion moment; the cost delta is trivial against a 15-60K engagement. Keep the env override.
- **Richer user-facing output:** expand the JSON shape and prompt so the USER gets a real leverage map, not a 2-3 sentence blurb. Suggested user-facing fields:
  - `pattern_label`, `result_title` (keep)
  - `operator_readout` — remove the 2-3 sentence cap; a sharp, specific multi-sentence read of THEIR mess in their language.
  - `where_it_costs_you` — the specific operational spot the leverage hides and how the cost shows up.
  - `what_an_intervention_looks_like` — concrete, plain-English, specific to their situation; no generic AI tools.
  - `first_fix` — the one place to start, small enough to prove.
  - `ninety_day_picture` — what good looks like if they act.
- **Keep the internal slice** as a separate part of the same JSON so one call serves both sides: `session_questions[3]`, `follow_up_opener`, `crm_summary`, `confidence`. These continue to feed the Resend email and the `praxis_leads` insert. Never surface the internal slice to the user.
- Instruct the model to mine the two free-text inputs hardest (`momentStory`, `perfectEmployee`); they are already passed.
- Update `normalizeAiResult`, `fallbackAiResult`, and the `LeverageMapAiResult` type for the new fields. The deterministic fallback must still produce a complete result when the key is absent.

## Change 4 (optional, phase 2) — Reactive feel
After the free-text `momentStory`, optionally call the model for a one-line reflective acknowledgment or a single sharpening follow-up, so it reads like a conversation, not a form. Same server-side key, graceful skip if no key.

## Acceptance criteria
- Wizard works on a phone viewport: one section per screen, progress shown, contact captured last.
- On submit: user sees a rich, specific leverage map; a `praxis_leads` row is written; the Resend email fires; deterministic fallback still works with no key.
- API contract (field names, option keys) and scoring unchanged.
- No key exposed client-side. Run an end-to-end test with and without `OPENAI_API_KEY`.

## Security to-do
- Confirm `public/aspire/linkedin/index.html` and `public/sites/nu-waves-pool-services-llc/index.html` contain no real API key. The `sk-` matches are likely word fragments (task-, risk-); verify and remove anything real.
