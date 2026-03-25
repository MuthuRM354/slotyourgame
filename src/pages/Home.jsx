import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="stack">
      <section className="hero">
        <h1>Chennai's Open-Ground & Corporate Cricket Hub</h1>
        <p>Not a generic turf app — built for open-ground leather and corporate tennis cricket.</p>
        <div className="hero-cta">
          <Link className="btn btn-primary" to="/grounds">Find a ground</Link>
          <Link className="btn btn-outline" to="/matches">Find opponents</Link>
          <Link className="btn btn-outline" to="/tournaments">Post a corporate league</Link>
        </div>
      </section>
    </div>
  );
}