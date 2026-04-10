import { Nav } from "@/components/nav"
import { Hero } from "@/components/sections/hero"
import { Stats } from "@/components/sections/stats"
import { Industries } from "@/components/sections/industries"
import { Problem } from "@/components/sections/problem"
import { HowWeWork } from "@/components/sections/how-we-work"
import { PullQuote } from "@/components/sections/pull-quote"
import { Intelligence } from "@/components/sections/intelligence"
import { Work } from "@/components/sections/work"
import { People } from "@/components/sections/people"
import { Intake } from "@/components/sections/intake"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Industries />
        <div className="h-px w-full bg-border" />
        <Problem />
        <div className="h-px w-full bg-border" />
        <HowWeWork />
        <PullQuote />
        <div className="h-px w-full bg-border" />
        <Intelligence />
        <div className="h-px w-full bg-border" />
        <Work />
        <div className="h-px w-full bg-border" />
        <People />
        <div className="h-px w-full bg-border" />
        <Intake />
      </main>
      <Footer />
    </>
  )
}
