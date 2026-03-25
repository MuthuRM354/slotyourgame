import { Link } from "react-router-dom";

export default function TournamentCard({ tournament }) {
  return (
    <article className="card">
      <h3>{tournament.name}</h3>
      <p>Area: {tournament.locationArea}</p>
      <p>
        Dates: {tournament.startDate} to {tournament.endDate}
      </p>
      <p>Ball Type: {tournament.ballType}</p>
      <p>Prize Pool: {tournament.prizePool}</p>
      {tournament.usesCricHeroes && <span className="badge">CricHeroes</span>}
      <div className="card-actions">
        <Link className="btn btn-outline" to={`/tournaments/${tournament.id}`}>
          View Tournament
        </Link>
      </div>
    </article>
  );
}