import { createHash } from "node:crypto"

export const dynamic = "force-dynamic"
export const runtime = "nodejs"

type TrackPayload = {
  event?: unknown
  recipient?: unknown
  r?: unknown
  path?: unknown
  title?: unknown
  href?: unknown
  referrer?: unknown
  section?: unknown
  ts?: unknown
}

function clean(value: unknown, fallback: string, max = 160) {
  const raw = value === undefined || value === null || value === "" ? fallback : String(value)
  return raw.replace(/[\u0000-\u001f\u007f]+/g, " ").slice(0, max)
}

function hashIp(req: Request) {
  const forwarded = req.headers.get("x-forwarded-for") || ""
  const ip = forwarded.split(",")[0]?.trim()
  if (!ip) return "unknown"

  return createHash("sha256").update(ip).digest("hex").slice(0, 16)
}

function eventFromPayload(payload: TrackPayload, req: Request) {
  const url = new URL(req.url)

  return {
    level: "info",
    msg: "story_track",
    page: "for-story",
    event: clean(payload.event ?? url.searchParams.get("event"), "view", 80),
    recipient: clean(
      payload.recipient ?? payload.r ?? url.searchParams.get("recipient") ?? url.searchParams.get("r"),
      "unknown",
      80
    ),
    path: clean(payload.path ?? url.searchParams.get("path"), "/for-story", 240),
    title: clean(payload.title, "", 160),
    href: clean(payload.href ?? url.searchParams.get("href"), "", 500),
    referrer: clean(payload.referrer, "", 500),
    section: clean(payload.section ?? url.searchParams.get("section"), "", 80),
    client_ts: clean(payload.ts, "", 80),
    header_referer: clean(req.headers.get("referer"), "", 500),
    user_agent: clean(req.headers.get("user-agent"), "", 240),
    ip_hash: hashIp(req),
    vercel_id: clean(req.headers.get("x-vercel-id"), "", 120),
    at: new Date().toISOString(),
  }
}

function logEvent(payload: TrackPayload, req: Request) {
  console.log(JSON.stringify(eventFromPayload(payload, req)))
}

export async function GET(req: Request) {
  const event = new URL(req.url).searchParams.get("event") || "pixel"
  logEvent({ event }, req)

  return new Response(null, {
    status: 204,
    headers: {
      "Cache-Control": "no-store",
    },
  })
}

export async function POST(req: Request) {
  let payload: TrackPayload = {}

  try {
    const body = await req.text()
    const parsed = body ? JSON.parse(body) : {}
    payload = parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : { event: "invalid" }
  } catch {
    payload = { event: "malformed" }
  }

  logEvent(payload, req)

  return Response.json(
    { ok: true },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}
