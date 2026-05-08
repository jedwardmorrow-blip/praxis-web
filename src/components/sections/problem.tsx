type Pain = {
  num: string
  head: string
  body: string
  foot: string
}

const pains: Pain[] = [
  {
    num: "PAIN 01",
    head: "I can't leave",
    body:
      "The operation breaks without you. Decisions don't get made. You haven't taken a real vacation in two years.",
    foot: "Trapped operator",
  },
  {
    num: "PAIN 02",
    head: "The data is everywhere",
    body:
      "Six tools. Three spreadsheets. Tribal knowledge in five heads. No source of truth, no two reports agree.",
    foot: "Scattered systems",
  },
  {
    num: "PAIN 03",
    head: "AI didn't fix it",
    body:
      "You bought the tools. The vendors promised the layer underneath. The reports are still wrong.",
    foot: "Stalled investment",
  },
  {
    num: "PAIN 04",
    head: "The next hire won't help",
    body:
      "A fractional CTO advises. A dev shop bills hours. Neither builds the operational layer underneath the tools.",
    foot: "Wrong shape of help",
  },
]

export function Problem() {
  return (
    <section className="problem" id="problem">
      <span className="sec-tag">§ The pain</span>
      <h2 className="sec-h">
        Four ways operations break before software{" "}
        <span className="red">ever helps.</span>
      </h2>
      <div className="pain-grid">
        {pains.map((p) => (
          <div key={p.num} className="pain-card stagger">
            <div className="pn">{p.num}</div>
            <div className="ph">
              {p.head}
              <span className="red">.</span>
            </div>
            <div className="pb">{p.body}</div>
            <div className="pf">{p.foot}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
