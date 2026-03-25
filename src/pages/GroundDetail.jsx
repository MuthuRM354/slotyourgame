import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";

export default function GroundDetail() {
  const { id } = useParams();
  const { state } = useAppContext();

  const ground = state.grounds.find((g) => g.id === id);
  if (!ground) return <p>Ground not found.</p>;

  const recentMatches = state.matches.filter((m) => m.groundId === id).slice(0, 3);

  return (
    <div className="stack">
      <h2>{ground.name}</h2>
      <p>{ground.area} | {ground.type}</p>
      <p>Pitch: {ground.pitchType}</p>
      <p>Supported formats: {ground.ballTypeSupported.join(", ")}</p>
      <a className="btn btn-outline" href={ground.googleMapsLink} target="_blank" rel="noreferrer">
        Open Map
      </a>

      <section className="banner">No convenience fees</section>

      <section className="card">
        <h3>Available Slots</h3>
        <ul>
          {ground.availableSlots.map((s, i) => (
            <li key={i}>{s.date} | {s.start} - {s.end}</li>
          ))}
        </ul>
      </section>

      <section className="card">
        <h3>Request Booking</h3>
        <form className="form-grid">
          <input placeholder="Team Name" />
          <input placeholder="Captain Name" />
          <input placeholder="Phone" />
          <input type="date" />
          <button type="button" className="btn btn-primary">Request Slot</button>
        </form>
      </section>

      <section className="card">
        <h3>Recent matches</h3>
        {recentMatches.length ? (
          <ul>{recentMatches.map((m) => <li key={m.id}>{m.organizerTeamName} - {m.date}</li>)}</ul>
        ) : (
          <p>Recent matches data will be available soon.</p>
        )}
      </section>
    </div>
  );
}