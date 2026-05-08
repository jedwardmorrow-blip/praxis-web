import "./v4.css"

import { Nav } from "@/components/v4/nav"
import { FooterV4 } from "@/components/v4/footer"
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

export default function Home() {
  return (
    <div className="v4-page">
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
