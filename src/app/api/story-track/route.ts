import { createHash } from "node:crypto"
import { createClient, type SupabaseClient } from "@supabase/supabase-js"

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

type StoryTrackEvent = ReturnType<typeof eventFromPayload>

let supabaseClient: SupabaseClient | null = null

function clean(value: unknown, fallback: string, max = 160) {
  const raw = value === undefined || value === null || value === "" ? fallback : String(value)
  return raw.replace(/[\u0000-\u001f\u007f]+/g, " ").slice(0, max)
}

function cleanEnv(value: string | undefined) {
  return value?.trim() || null
}

function getSupabase() {
  if (supabaseClient) return supabaseClient

  const url = cleanEnv(process.env.SUPABASE_URL)
  const key =
    cleanEnv(process.env.SUPABASE_SERVICE_ROLE_KEY) ||
    cleanEnv(process.env.SUPABASE_ANON_KEY) ||
    cleanEnv(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

  if (!url || !key) return null

  supabaseClient = createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })

  return supabaseClient
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

async function persistEvent(event: StoryTrackEvent) {
  const supabase = getSupabase()
  if (!supabase) {
    console.warn(JSON.stringify({ level: "warning", msg: "story_track_supabase_not_configured" }))
    return false
  }

  const { error } = await supabase.from("praxis_ui_events").insert({
    role: "public",
    route: event.path || "/for-story",
    surface: "story_artifact",
    event_name: `story_${event.event}`,
    entity_type: "story_artifact",
    metadata: event,
  })

  if (error) {
    console.error(
      JSON.stringify({
        level: "error",
        msg: "story_track_persist_failed",
        error: error.message,
        code: error.code,
      })
    )
    return false
  }

  return true
}

async function trackEvent(payload: TrackPayload, req: Request) {
  const event = eventFromPayload(payload, req)
  console.log(JSON.stringify(event))
  return persistEvent(event)
}

export async function GET(req: Request) {
  const event = new URL(req.url).searchParams.get("event") || "pixel"
  await trackEvent({ event }, req)

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

  const persisted = await trackEvent(payload, req)

  return Response.json(
    { ok: true, persisted },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    }
  )
}
