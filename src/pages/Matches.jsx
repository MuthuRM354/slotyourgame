import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";

export default function Matches() {
  const { user } = useAuth();
  const { state, dispatch } = useAppContext();

  const handleBook = (groundId) => {
    if (!user || user.role !== "captain") return;
    dispatch({
      type: "ADD_BOOKING",
      payload: { id: `b${Date.now()}`, captainUserId: user.id, groundId, date: "2026-04-02", start: "06:00", end: "08:00" }
    });
  };

  return (
    <div className="stack">
      <h2>Match Listings</h2>
      <section className="grid-3">
        {state.matches.map((m) => {
          const g = state.grounds.find((x) => x.id === m.groundId);
          return (
            <article className="card" key={m.id}>
              <h3>{g?.name || "Ground"}</h3>
              <p>{m.date} {m.startTime}-{m.endTime}</p>
              <p>{m.ballType} | {m.level}</p>
              <p>Team: {m.organizerTeamName}</p>
              {user?.role === "captain" && <button className="btn btn-primary" onClick={() => handleBook(m.groundId)}>Book this</button>}
            </article>
          );
        })}
      </section>
    </div>
  );
}