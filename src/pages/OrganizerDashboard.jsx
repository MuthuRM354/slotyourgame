import { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const { state, dispatch } = useAppContext();
  const [tab, setTab] = useState("grounds");

  const organizer = state.organizers.find((o) => o.id === user.id);
  const myGrounds = state.grounds.filter((g) => g.organizerId === user.id);
  const myTournaments = state.tournaments.filter((t) => t.organizerId === user.id);

  const [groundForm, setGroundForm] = useState({
    name: "", area: "OMR", type: "open-ground leather", pitchType: "matting", pricePerHour: 2000
  });
  const [tourForm, setTourForm] = useState({
    name: "", season: "Summer 2026", locationArea: "OMR", ballType: "tennis", startDate: "", endDate: "", numberOfTeams: 8, prizePool: "₹50,000"
  });
  const [verifyForm, setVerifyForm] = useState({ idProof: "", photos: "" });

  const inventoryRows = useMemo(
    () => myGrounds.flatMap((g) => g.availableSlots.map((s, i) => ({ key: `${g.id}-${i}`, ground: g.name, ...s }))),
    [myGrounds]
  );

  const addGround = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_GROUND",
      payload: {
        id: `g${Date.now()}`,
        organizerId: user.id,
        ...groundForm,
        pricePerHour: Number(groundForm.pricePerHour),
        ballTypeSupported: groundForm.type.includes("leather") ? ["leather"] : ["tennis"],
        availableSlots: [],
        isVerified: organizer?.status === "approved",
        organizerContact: user.phone,
        googleMapsLink: "https://maps.google.com"
      }
    });
    setGroundForm({ name: "", area: "OMR", type: "open-ground leather", pitchType: "matting", pricePerHour: 2000 });
  };

  const addTournament = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_TOURNAMENT",
      payload: {
        id: `t${Date.now()}`,
        organizerId: user.id,
        ...tourForm,
        status: "upcoming",
        numberOfTeams: Number(tourForm.numberOfTeams),
        usesCricHeroes: false,
        cricHeroesLink: ""
      }
    });
  };

  const requestVerification = (e) => {
    e.preventDefault();
    dispatch({
      type: "ADD_VERIFICATION_REQUEST",
      payload: { id: `vr${Date.now()}`, organizerId: user.id, ...verifyForm, status: "submitted" }
    });
    setVerifyForm({ idProof: "", photos: "" });
  };

  return (
    <div className="stack">
      <h2>Organizer Dashboard</h2>
      {organizer?.status !== "approved" && <p className="badge warning">Pending admin approval</p>}

      <div className="tabbar">
        <button className={`btn ${tab === "grounds" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("grounds")}>My Grounds</button>
        <button className={`btn ${tab === "inventory" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("inventory")}>Inventory</button>
        <button className={`btn ${tab === "tournaments" ? "btn-primary" : "btn-outline"}`} onClick={() => setTab("tournaments")}>My Tournaments</button>
      </div>

      {tab === "grounds" && (
        <section className="card">
          <h3>My Grounds</h3>
          <ul>{myGrounds.map((g) => <li key={g.id}>{g.name} ({g.area})</li>)}</ul>
          <form className="form-grid" onSubmit={addGround}>
            <input placeholder="Ground name" value={groundForm.name} onChange={(e) => setGroundForm({ ...groundForm, name: e.target.value })} required />
            <input placeholder="Area" value={groundForm.area} onChange={(e) => setGroundForm({ ...groundForm, area: e.target.value })} required />
            <input placeholder="Type" value={groundForm.type} onChange={(e) => setGroundForm({ ...groundForm, type: e.target.value })} required />
            <input placeholder="Pitch Type" value={groundForm.pitchType} onChange={(e) => setGroundForm({ ...groundForm, pitchType: e.target.value })} required />
            <input type="number" placeholder="Price per hour" value={groundForm.pricePerHour} onChange={(e) => setGroundForm({ ...groundForm, pricePerHour: e.target.value })} required />
            <button className="btn btn-primary">Add New Ground</button>
          </form>
        </section>
      )}

      {tab === "inventory" && (
        <section className="card">
          <h3>Inventory</h3>
          <ul>{inventoryRows.map((r) => <li key={r.key}>{r.ground}: {r.date} {r.start}-{r.end}</li>)}</ul>
        </section>
      )}

      {tab === "tournaments" && (
        <section className="card">
          <h3>My Tournaments</h3>
          <ul>{myTournaments.map((t) => <li key={t.id}>{t.name} ({t.startDate} to {t.endDate})</li>)}</ul>
          <form className="form-grid" onSubmit={addTournament}>
            <input placeholder="Tournament name" value={tourForm.name} onChange={(e) => setTourForm({ ...tourForm, name: e.target.value })} required />
            <input placeholder="Season" value={tourForm.season} onChange={(e) => setTourForm({ ...tourForm, season: e.target.value })} />
            <input placeholder="Area" value={tourForm.locationArea} onChange={(e) => setTourForm({ ...tourForm, locationArea: e.target.value })} required />
            <input placeholder="Ball Type" value={tourForm.ballType} onChange={(e) => setTourForm({ ...tourForm, ballType: e.target.value })} required />
            <input type="date" value={tourForm.startDate} onChange={(e) => setTourForm({ ...tourForm, startDate: e.target.value })} required />
            <input type="date" value={tourForm.endDate} onChange={(e) => setTourForm({ ...tourForm, endDate: e.target.value })} required />
            <button className="btn btn-primary">Create Tournament</button>
          </form>
        </section>
      )}

      <section className="card">
        <h3>Verification Upload</h3>
        <form className="form-grid" onSubmit={requestVerification}>
          <input placeholder="ID proof file name" value={verifyForm.idProof} onChange={(e) => setVerifyForm({ ...verifyForm, idProof: e.target.value })} required />
          <input placeholder="Ground photo file name(s)" value={verifyForm.photos} onChange={(e) => setVerifyForm({ ...verifyForm, photos: e.target.value })} required />
          <button className="btn btn-outline">Request Verification</button>
        </form>
      </section>
    </div>
  );
}