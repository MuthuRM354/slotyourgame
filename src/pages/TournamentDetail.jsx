import { useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import CricHeroesStatsPlaceholder from "../components/CricHeroesStatsPlaceholder";

export default function TournamentDetail() {
  const { id } = useParams();
  const { state } = useAppContext();

  const tournament = state.tournaments.find((t) => t.id === id);
  if (!tournament) return <p>Tournament not found.</p>;

  return (
    <div className="stack">
      <h2>{tournament.name}</h2>
      <p>Season: {tournament.season}</p>
      <p>Dates: {tournament.startDate} to {tournament.endDate}</p>
      <p>Teams: {tournament.numberOfTeams}</p>
      <p>Level: {tournament.level || "corporate"}</p>
      <p>Status: {tournament.status}</p>

      {tournament.cricHeroesLink ? (
        <a
          className="btn btn-primary"
          href={tournament.cricHeroesLink}
          target="_blank"
          rel="noreferrer"
        >
          View on CricHeroes
        </a>
      ) : null}

      <CricHeroesStatsPlaceholder />
    </div>
  );
}