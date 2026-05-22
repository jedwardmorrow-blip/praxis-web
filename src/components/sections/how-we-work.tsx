type Shape = {
  num: string
  name: string
  duration: string
  description: string
  commitment: string
}

const shapes: Shape[] = [
  {
    num: "SHAPE 01",
    name: "Discovery Sprint",
    duration: "Five business days · one workflow, inspected and prototyped.",
    description:
      "We pick one workflow that is costing time, revenue, or owner attention, map how it actually runs, and prove the fix with a working prototype. You leave with a roadmap and a clear build recommendation.",
    commitment: "Fixed-scope first step · priced after fit",
  },
  {
    num: "SHAPE 02",
    name: "Build Sprint",
    duration: "Four to six weeks · one workflow shipped to production.",
    description:
      "The prototype becomes an operator-grade workflow: connected to real data, reviewed by humans where it matters, documented for the team, and supported through launch.",
    commitment: "Fixed-scope implementation · no hourly billing",
  },
  {
    num: "SHAPE 03",
    name: "Operating Retainer",
    duration: "Monthly cadence · continuous improvement after launch.",
    description:
      "For teams that want Praxis to keep improving the operating system month by month: workflow automation, reporting, AI assistant maintenance, and new decision-support surfaces.",
    commitment: "Retainer available after implementation",
  },
]

export function HowWeWork() {
  return (
    <section className="how" id="how">
      <span className="sec-tag">§ How we work</span>
      <h2 className="sec-h">
        Three engagement shapes<span className="red">.</span> Pick the one that fits the problem.
      </h2>
      <div className="shape-grid">
        {shapes.map((s) => {
          return (
            <div key={s.num} className="shape">
              <div className="sn">{s.num}</div>
              <div className="sname">
                {s.name}
                <span className="dot">.</span>
              </div>
              <div className="sdur">{s.duration}</div>
              <div className="sdesc">{s.description}</div>
              <div className="sprice">{s.commitment}</div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
