import "./v4.css"

import { Nav } from "@/components/v4/nav"
import { FooterV4 } from "@/components/v4/footer"
import { ScrollReveals } from "@/components/v4/scroll-reveals"
import { JsonLd } from "@/components/json-ld"
import { Hero } from "@/components/sections/hero"
import { Atom } from "@/components/sections/atom"
import { Velocity } from "@/components/sections/velocity"
import { Stats } from "@/components/sections/stats"
import { Industries } from "@/components/sections/industries"
import { Problem } from "@/components/sections/problem"
import { Narrative } from "@/components/sections/narrative"
import { Capacity } from "@/components/sections/capacity"
import { MidCta } from "@/components/sections/mid-cta"
import { HowWeWork } from "@/components/sections/how-we-work"
import { PullQuote } from "@/components/sections/pull-quote"
import { Proof } from "@/components/sections/proof"
import { Console } from "@/components/sections/console"
import { People } from "@/components/sections/people"
import { Intake } from "@/components/sections/intake"
import { Closing } from "@/components/sections/closing"

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Praxis",
  alternateName: "PRAXIS. Operational Intelligence.",
  url: "https://gopraxis.ai",
  logo: "https://gopraxis.ai/favicon.svg",
  description:
    "Operator-led software firm. Custom software, AI agents, and operational intelligence for owner-led companies.",
  email: "justin@gopraxis.ai",
  areaServed: "US",
  knowsAbout: [
    "Custom Software Development",
    "AI Agents",
    "Operational Intelligence",
    "Business Process Automation",
    "Operations Workflow Software",
  ],
  founder: [
    {
      "@type": "Person",
      name: "Justin Morrow",
      jobTitle: "Co-Founder & Managing Partner",
    },
    {
      "@type": "Person",
      name: "Greg Dunaway",
      jobTitle: "Co-Founder & Managing Partner",
    },
  ],
  sameAs: [],
}

export default function Home() {
  return (
    <div className="v4-page">
      <JsonLd data={organizationJsonLd} />
      <ScrollReveals />
      <Nav />
      <main id="main">
        <Hero />
        <Atom />
        <Velocity />
        <Stats />
        <Industries />
        <Problem />
        <Narrative />
        <Capacity />
        <MidCta />
        <HowWeWork />
        <PullQuote />
        <Proof />
        <Console />
        <People />
        <Intake />
        <Closing />
      </main>
      <FooterV4 />
    </div>
  )
}
