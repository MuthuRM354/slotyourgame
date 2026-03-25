export default function MatchCard({ match, groundName, area }) {
  return (
    <article className="card">
      <h3>{groundName || "Other Ground"}</h3>
      <p>{area || "Chennai"}</p>
      <p>
        {match.date} | {match.startTime} - {match.endTime}
      </p>
      <p>Ball: {match.ballType}</p>
      <p>Organizer Team: {match.organizerTeamName}</p>
      <p>Level: {match.level}</p>
      <p>Status: {match.status}</p>
      {match.lookingForOpponent && <span className="badge">Looking for Opponent</span>}
      <div className="card-actions">
        <a className="btn btn-outline" href={`tel:${match.contactPhone || ""}`}>
          Contact captain
        </a>
      </div>
    </article>
  );
}