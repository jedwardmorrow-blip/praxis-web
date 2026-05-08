// Praxis operating atom data, V4. Orbits + edges + palette.
// Type-safe so the canvas component can rely on the schema.

export type AtomNode = {
  id: string
  name: string
  kind: "mark" | "operator" | "product" | "method" | "engagement" | "tool"
  cat: string
  desc: string
  meta: string
  size: number
  color?: "paper" | "gold" | "method" | "engagement" | "tool"
  stage?: "build" | "sprint" | "qualify"
}

export type AtomOrbit = {
  r: number
  tilt: number
  speed?: number
  name: string
  nodes: AtomNode[]
}

export const ORBITS: AtomOrbit[] = [
  {
    r: 0,
    tilt: 0,
    name: "Mark",
    nodes: [
      {
        id: "praxis",
        name: "PRAXIS",
        kind: "mark",
        cat: "Firm",
        desc:
          "Operator-led software firm. Two managing partners. Six engagements per year.",
        meta: "Phoenix · Berlin · Est. MMXXVI",
        size: 0.55,
      },
    ],
  },
  {
    r: 1.9,
    tilt: 0,
    speed: 0.18,
    name: "Operators",
    nodes: [
      {
        id: "jm",
        name: "JUSTIN MORROW",
        kind: "operator",
        cat: "Co-Founder",
        desc:
          "AI engineering and product architecture. Built Cultivo from zero in production.",
        meta: "justin@gopraxis.ai",
        size: 0.3,
        color: "paper",
      },
      {
        id: "gd",
        name: "GREG DUNAWAY",
        kind: "operator",
        cat: "Co-Founder",
        desc:
          "15-year operator. Four-time founder. Runs client relationships, structures engagements.",
        meta: "greg@gopraxis.ai",
        size: 0.3,
        color: "paper",
      },
    ],
  },
  {
    r: 3.0,
    tilt: 0.42,
    speed: 0.13,
    name: "Products",
    nodes: [
      {
        id: "cultivo",
        name: "CULTIVO",
        kind: "product",
        cat: "Flagship · cannabis operational platform",
        desc:
          "156 tables, 12 modules, multi-state production. Owned and commercialized by Praxis. Formerly CultOps.",
        meta: "99.94% uptime · cultivo.ag",
        size: 0.34,
        color: "gold",
      },
      {
        id: "cultlos",
        name: "CULTLOS",
        kind: "product",
        cat: "Sister product",
        desc: "Lab and operations system. Cultivo-derivative for cannabis testing labs.",
        meta: "In active development",
        size: 0.26,
        color: "gold",
      },
      {
        id: "textback",
        name: "TEXTBACK",
        kind: "product",
        cat: "Owned product",
        desc: "Operator messaging bot. Field-ops paging for distributed teams.",
        meta: "Production",
        size: 0.24,
        color: "gold",
      },
      {
        id: "getreceipts",
        name: "GET RECEIPTS",
        kind: "product",
        cat: "Consumer product · co-owned",
        desc:
          "Curated DIY background-check directory and ebook. Co-owned with Paloma. Editorial register, public-records guidance.",
        meta: "In active build · getreceipts.io",
        size: 0.26,
        color: "gold",
      },
    ],
  },
  {
    r: 4.2,
    tilt: -0.28,
    speed: 0.1,
    name: "Methodology",
    nodes: [
      {
        id: "sprint",
        name: "DISCOVERY SPRINT",
        kind: "method",
        cat: "Shape 01",
        desc: "Two weeks. Operator interviews. Findings deck.",
        meta: "Fixed-price · $24K",
        size: 0.26,
        color: "method",
      },
      {
        id: "build",
        name: "BUILD",
        kind: "method",
        cat: "Shape 02",
        desc: "8 to 16 weeks. One operator-grade module shipped to production.",
        meta: "Fixed-price · $80K to $220K",
        size: 0.26,
        color: "method",
      },
      {
        id: "platform",
        name: "PLATFORM",
        kind: "method",
        cat: "Shape 03",
        desc: "Quarterly retainer. Multi-module platform, built and handed to the client.",
        meta: "From $90K / qtr",
        size: 0.26,
        color: "method",
      },
    ],
  },
  {
    r: 5.6,
    tilt: 0.62,
    speed: 0.07,
    name: "Engagements",
    nodes: [
      {
        id: "aspire",
        name: "ASPIRE",
        kind: "engagement",
        stage: "build",
        cat: "Hospitality consulting",
        desc:
          "Multi-coach hospitality consulting firm. Website rebuild shipped. Discovery Sprint delivered, findings at aspire.gopraxis.ai.",
        meta: "Sprint complete · Active 2026",
        size: 0.28,
        color: "engagement",
      },
      {
        id: "hausmatch",
        name: "ENGAGEMENT 02",
        kind: "engagement",
        stage: "qualify",
        cat: "Real estate platform",
        desc:
          "Visual AI home-search platform. In qualification, scope and timeline under discussion.",
        meta: "Qualification · 2026",
        size: 0.28,
        color: "engagement",
      },
      {
        id: "eng03",
        name: "ENGAGEMENT 03",
        kind: "engagement",
        stage: "sprint",
        cat: "Hospitality framework operator",
        desc:
          "Discovery Sprint in progress. Operational layer beneath a published methodology. Available under NDA.",
        meta: "In Discovery Sprint",
        size: 0.26,
        color: "engagement",
      },
      {
        id: "eng04",
        name: "ENGAGEMENT 04",
        kind: "engagement",
        stage: "qualify",
        cat: "Cannabis tech partnership",
        desc: "Integration layer. Partnership track. Available under NDA.",
        meta: "Qualification · partnership",
        size: 0.24,
        color: "engagement",
      },
      {
        id: "eng05",
        name: "ENGAGEMENT 05",
        kind: "engagement",
        stage: "qualify",
        cat: "Hospitality focus group",
        desc:
          "Multi-coach hospitality firm. Sprint-track inquiry. Available under NDA.",
        meta: "Qualification · Q2 2026",
        size: 0.24,
        color: "engagement",
      },
    ],
  },
  {
    r: 7.0,
    tilt: -0.48,
    speed: 0.04,
    name: "Tools layer · 93%",
    nodes: [
      { id: "t1", name: "ANTHROPIC", kind: "tool", cat: "LLM provider", desc: "Foundation model.", meta: "Tools layer", size: 0.18, color: "tool" },
      { id: "t2", name: "SUPABASE", kind: "tool", cat: "Data substrate", desc: "Postgres backbone for context DB and product surfaces.", meta: "Tools layer", size: 0.18, color: "tool" },
      { id: "t3", name: "VERCEL", kind: "tool", cat: "Deploy", desc: "Production hosting.", meta: "Tools layer", size: 0.18, color: "tool" },
      { id: "t4", name: "SLACK", kind: "tool", cat: "Comms", desc: "Operator paging.", meta: "Tools layer", size: 0.16, color: "tool" },
      { id: "t5", name: "AIRTABLE", kind: "tool", cat: "Audit", desc: "Floor-level audits.", meta: "Tools layer", size: 0.16, color: "tool" },
      { id: "t6", name: "METRC", kind: "tool", cat: "Compliance", desc: "State-mandated cannabis tracking.", meta: "Tools layer", size: 0.16, color: "tool" },
      { id: "t7", name: "NOTION", kind: "tool", cat: "Docs", desc: "External-facing documentation.", meta: "Tools layer", size: 0.16, color: "tool" },
      { id: "t8", name: "GMAIL", kind: "tool", cat: "Comms", desc: "External operator communications.", meta: "Tools layer", size: 0.16, color: "tool" },
      { id: "t9", name: "STRIPE", kind: "tool", cat: "Payments", desc: "Engagement billing rail.", meta: "Tools layer", size: 0.16, color: "tool" },
      { id: "t10", name: "GITHUB", kind: "tool", cat: "Source", desc: "All code surfaces.", meta: "Tools layer", size: 0.18, color: "tool" },
    ],
  },
]

export const EDGES: Array<[string, string]> = [
  ["aspire", "sprint"],
  ["aspire", "build"],
  ["eng03", "sprint"],
  ["eng04", "platform"],
  ["eng05", "sprint"],
  ["cultivo", "jm"],
  ["cultlos", "jm"],
  ["textback", "jm"],
  ["getreceipts", "jm"],
  ["aspire", "gd"],
  ["hausmatch", "gd"],
  ["eng03", "gd"],
  ["build", "cultivo"],
  ["platform", "cultivo"],
]

export const PALETTE = {
  paper: 0xf1e8d2,
  gold: 0xc9a24b,
  red: 0xc42130,
  navy: 0x14365e,
  navyMid: 0x2c5384,
  navyDeep: 0x0a2545,
} as const
