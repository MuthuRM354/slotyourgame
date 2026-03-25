import { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";

export default function AdminDashboard() {
  const { state, dispatch } = useAppContext();
  const [selected, setSelected] = useState(null);

  const pending = state.organizers.filter((o) => o.status === "pending");
  const analytics = useMemo(
    () => ({
      activeGrounds: state.grounds.filter((g) => g.isVerified).length,
      matchesPosted: state.matches.length,
      teams: state.teams.length
    }),
    [state]
  );

  return (
    <div className="stack">
      <h2>Admin Dashboard</h2>

      <section className="grid-3">
        <article className="card"><h3>Active Grounds</h3><p>{analytics.activeGrounds}</p></article>
        <article className="card"><h3>Matches Posted</h3><p>{analytics.matchesPosted}</p></article>
        <article className="card"><h3>Total Teams</h3><p>{analytics.teams}</p></article>
      </section>

      <section className="card">
        <h3>Pending Organizers</h3>
        <table className="table">
          <thead><tr><th>Name</th><th>Phone</th><th>Grounds</th><th>Actions</th></tr></thead>
          <tbody>
            {pending.map((o) => (
              <tr key={o.id}>
                <td>{o.name}</td>
                <td>{o.phone}</td>
                <td>{state.grounds.filter((g) => g.organizerId === o.id).length}</td>
                <td>
                  <button className="btn btn-outline" onClick={() => setSelected(o)}>Review</button>
                  <button className="btn btn-primary" onClick={() => dispatch({ type: "APPROVE_ORGANIZER", payload: o.id })}>Approve</button>
                  <button className="btn btn-outline" onClick={() => dispatch({ type: "REJECT_ORGANIZER", payload: o.id })}>Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {selected && (
        <div className="modal-overlay" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3>Verification Workflow</h3>
            <p>Name: {selected.name}</p>
            <p>Docs: {selected.docs.join(", ") || "None"}</p>
            <button className="btn btn-primary" onClick={() => { dispatch({ type: "APPROVE_ORGANIZER", payload: selected.id }); setSelected(null); }}>
              Mark Verified
            </button>
          </div>
        </div>
      )}
    </div>
  );
}