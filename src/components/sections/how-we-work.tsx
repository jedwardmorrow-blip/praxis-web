type Shape = {
  num: string
  name: string
  duration: string
  description: string
  price: string
}

const shapes: Shape[] = [
  {
    num: "SHAPE 01",
    name: "Discovery Sprint",
    duration: "Two weeks · operator interviews + findings deck.",
    description:
      "You leave with a written diagnostic of where your operation breaks, the seven-percent layer to build first, and a fixed-price scope to build it. If we are not the right firm to build it, we tell you who is.",
    price: "Fixed-price · $24K",
  },
  {
    num: "SHAPE 02",
    name: "Build",
    duration: "8 to 16 weeks · one module, shipped to production.",
    description:
      "You hand off to your team a single operator-grade module that runs in production, replaces a workflow nobody currently trusts, and lets you stop firefighting that part of the operation. Both partners on the engagement, every week.",
    price: "Fixed-price · $80K to $220K",
  },
  {
    num: "SHAPE 03",
    name: "Platform",
    duration: "Quarterly cadence · multi-module platform, owned by you.",
    description:
      "For operators ready to commit long-term. We build module by module, hand the keys over as we go, and stay on retainer to operate alongside your team. The relationship where 'who built this' becomes 'who runs this with us.'",
    price: "Quarterly retainer · from $90K / qtr",
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
          const [priceLabel, priceNum] = s.price.split(" · ")
          return (
            <div key={s.num} className="shape">
              <div className="sn">{s.num}</div>
              <div className="sname">
                {s.name}
                <span className="dot">.</span>
              </div>
              <div className="sdur">{s.duration}</div>
              <div className="sdesc">{s.description}</div>
              <div className="sprice">
                {priceLabel} · <span className="num">{priceNum}</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}
