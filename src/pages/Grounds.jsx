import { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function Grounds() {
  const { state } = useAppContext();
  const [area, setArea] = useState("");
  const [ballType, setBallType] = useState("");

  const verifiedGrounds = state.grounds.filter((g) => g.isVerified);
  const areas = useMemo(() => [...new Set(verifiedGrounds.map((g) => g.area))], [verifiedGrounds]);

  const list = verifiedGrounds.filter((g) => {
    const byArea = !area || g.area === area;
    const byBall = !ballType || g.ballTypeSupported.includes(ballType);
    return byArea && byBall;
  });

  return (
    <div className="stack">
      <h2>Verified Grounds</h2>
      <div className="filters">
        <select value={area} onChange={(e) => setArea(e.target.value)}>
          <option value="">All Areas</option>
          {areas.map((a) => <option key={a} value={a}>{a}</option>)}
        </select>
        <select value={ballType} onChange={(e) => setBallType(e.target.value)}>
          <option value="">All Ball Types</option>
          <option value="leather">leather</option>
          <option value="tennis">tennis</option>
        </select>
      </div>
      <section className="grid-3">
        {list.map((g) => (
          <article className="card" key={g.id}>
            <h3>{g.name}</h3>
            <p>{g.area}</p>
            <p>{g.ballTypeSupported.join(", ")}</p>
            <p>₹{g.pricePerHour}/hr</p>
          </article>
        ))}
      </section>
    </div>
  );
}