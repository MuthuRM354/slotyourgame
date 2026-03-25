import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="brand">Chennai Cricket Hub</Link>

        <nav className="nav-links">
          <NavLink to="/">Home</NavLink>
          <NavLink to="/grounds">Grounds</NavLink>
          <NavLink to="/matches">Matches</NavLink>
          <NavLink to="/tournaments">Tournaments</NavLink>
          {!user && <NavLink to="/login">Login</NavLink>}
          {user?.role === "admin" && <NavLink to="/admin/dashboard">Admin</NavLink>}
          {user?.role === "organizer" && <NavLink to="/organizer/dashboard">Organizer</NavLink>}
          {user?.role === "captain" && <NavLink to="/captain/dashboard">Captain</NavLink>}
        </nav>

        <div className="nav-actions">
          {user?.role === "captain" && <Link className="btn btn-primary" to="/captain/dashboard">Post Match</Link>}
          {user ? (
            <button className="btn btn-outline" onClick={logout}>Logout</button>
          ) : (
            <Link className="btn btn-primary" to="/login">Login</Link>
          )}
        </div>
      </div>
    </header>
  );
}