// Unit test for findGiveawayLeaks: it must flag a build component named as the
// session's DELIVERABLE, but exempt the give-away-CLOSING construction (a build
// word inside a "no bolt-on tool can ..." / "can't ..." sentence). Observability,
// not a blocker — but the negation guard is what keeps it from crying wolf on the
// very lines that close the give-away. Run: node --experimental-strip-types scripts/test-giveaway-leaks.ts
import { findGiveawayLeaks } from "../src/lib/leverage-map.ts"

let fails = 0
function assert(cond: boolean, msg: string) {
  if (!cond) {
    console.error("FAIL:", msg)
    fails++
  }
}

// LEAK — build word names the deliverable, no negation in the sentence.
assert(findGiveawayLeaks("The session tracks response time for every lead.").includes("track"), "flag 'tracks' as deliverable")
assert(findGiveawayLeaks("You get a dashboard of every open job.").includes("dashboard"), "flag 'dashboard'")
assert(findGiveawayLeaks("It alerts you the moment a handoff stalls.").includes("alert"), "flag 'alert'")

// NOT a leak — give-away-closing constructions (negation present).
assert(findGiveawayLeaks("No bolt-on tool can track which leads slip away.").length === 0, "'no ... can track' exempt")
assert(findGiveawayLeaks("Off-the-shelf auto-replies can't flag the slow ones.").length === 0, "\"can't flag\" exempt")
assert(findGiveawayLeaks("This is more than just a dashboard you can buy.").length === 0, "'more than just' exempt")

// Clean prose — no build words at all.
assert(findGiveawayLeaks("You'll know which leads cost you the most, in dollars.").length === 0, "clean unlock: no flags")
assert(findGiveawayLeaks("").length === 0, "empty input: no flags")

if (fails === 0) {
  console.log("PASS — findGiveawayLeaks flags build-component deliverables and exempts give-away-closing constructions")
} else {
  console.error(`${fails} failure(s)`)
  process.exit(1)
}
