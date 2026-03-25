import { useAppContext } from "../context/AppContext";

export default function Tournaments() {
  const { state } = useAppContext();

  return (
    <div className="stack">
      <h2>Tournaments</h2>
      <section className="grid-3">
        {state.tournaments.map((t) => (
          <article className="card" key={t.id}>
            <h3>{t.name}</h3>
            <p>{t.locationArea}</p>
            <p>{t.startDate} to {t.endDate}</p>
            <p>{t.ballType}</p>
            <p>{t.prizePool}</p>
            {t.cricHeroesLink && <a className="btn btn-outline" href={t.cricHeroesLink} target="_blank" rel="noreferrer">View on CricHeroes</a>}
          </article>
        ))}
      </section>
    </div>
  );
}