import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";

export default function CaptainDashboard() {
  const { user } = useAuth();
  const { state, dispatch } = useAppContext();
  const [tab, setTab] = useState("teams");

  const myTeams = state.teams.filter((t) => t.captainUserId === user.id);
  const myMatches = state.matches.filter((m) => m.postedByUserId === user.id);
  const myBookings = state.bookings.filter((b) => b.captainUserId === user.id);

  const [teamForm, setTeamForm] = useState({ name: "", companyName: "", level: "corporate", primaryArea: "", cricHeroesProfileUrl: "" });
  const [matchForm, setMatchForm] = useState({ groundId: "", date: "", startTime: "", endTime: "", ballType: "tennis", format: "T20", level: "corporate", lookingForOpponent: true, notes: "" });

  const addTeam = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_TEAM",
      payload: {
        id: `team${Date.now()}`,
        captainUserId: user.id,
        captainName: user.name,
        captainPhone: user.phone,
        ...teamForm
      }
    });
    setTeamForm({ name: "", companyName: "", level: "corporate", primaryArea: "", cricHeroesProfileUrl: "" });
  };

  const addMatch = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_MATCH",
      payload: {
        id: `m${Date.now()}`,
        postedByUserId: user.id,
        organizerTeamName: myTeams[0]?.name || "Captain Team",
        status: "open",
        ...matchForm
      }
    });
  };

  return (
    <div className="stack">
      <h2>Captain Dashboard</h2>
      <div className="tabbar">
        <button className={`btn ${tab === "teams" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("teams")}>My Teams</button>
        <button className={`btn ${tab === "matches" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("matches")}>My Matches</button>
        <button className={`btn ${tab === "bookings" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("bookings")}>Bookings</button>
      </div>

      {tab === "teams" && (
        <section className="card">
          <h3>My Teams</h3>
          <ul>{myTeams.map((t) => <li key={t.id}>{t.name} - {t.companyName}</li>)}</ul>
          <form className="form-grid" onSubmit={addTeam}>
            <input placeholder="Team name" value={teamForm.name} onChange={(e) => setTeamForm({ ...teamForm, name: e.target.value })} required />
            <input placeholder="Company name" value={teamForm.companyName} onChange={(e) => setTeamForm({ ...teamForm, companyName: e.target.value })} />
            <input placeholder="Level" value={teamForm.level} onChange={(e) => setTeamForm({ ...teamForm, level: e.target.value })} />
            <input placeholder="Primary area" value={teamForm.primaryArea} onChange={(e) => setTeamForm({ ...teamForm, primaryArea: e.target.value })} required />
            <input placeholder="CricHeroes URL" value={teamForm.cricHeroesProfileUrl} onChange={(e) => setTeamForm({ ...teamForm, cricHeroesProfileUrl: e.target.value })} />
            <button className="btn btn-primary">Add New Team</button>
          </form>
        </section>
      )}

      {tab === "matches" && (
        <section className="card">
          <h3>My Matches</h3>
          <ul>{myMatches.map((m) => <li key={m.id}>{m.date} {m.startTime}-{m.endTime} ({m.ballType})</li>)}</ul>
          <form className="form-grid" onSubmit={addMatch}>
            <select value={matchForm.groundId} onChange={(e) => setMatchForm({ ...matchForm, groundId: e.target.value })} required>
              <option value="">Select ground</option>
              {state.grounds.filter((g) => g.isVerified).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
            <input type="date" value={matchForm.date} onChange={(e) => setMatchForm({ ...matchForm, date: e.target.value })} required />
            <input type="time" value={matchForm.startTime} onChange={(e) => setMatchForm({ ...matchForm, startTime: e.target.value })} required />
            <input type="time" value={matchForm.endTime} onChange={(e) => setMatchForm({ ...matchForm, endTime: e.target.value })} required />
            <button className="btn btn-primary">Post New Match</button>
          </form>
        </section>
      )}

      {tab === "bookings" && (
        <section className="card">
          <h3>Bookings</h3>
          <ul>
            {myBookings.map((b) => {
              const g = state.grounds.find((x) => x.id === b.groundId);
              return <li key={b.id}>{g?.name || "Ground"} - {b.date} {b.start}-{b.end}</li>;
            })}
          </ul>
        </section>
      )}
    </div>
  );
}