import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, LogOut } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-white border-b-2 border-cricket-green sticky top-0 z-50 shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold sporty-gradient bg-clip-text text-transparent">
          🏏 ChennaiCricket
        </Link>

        <div className="hidden md:flex gap-6 items-center">
          <Link to="/" className="text-gray-700 hover:text-cricket-green font-semibold">Home</Link>
          <Link to="/grounds" className="text-gray-700 hover:text-cricket-green font-semibold">Grounds</Link>
          <Link to="/matches" className="text-gray-700 hover:text-cricket-green font-semibold">Matches</Link>
          <Link to="/tournaments" className="text-gray-700 hover:text-cricket-green font-semibold">Tournaments</Link>

          {user?.role === "admin" && <Link to="/admin/dashboard" className="text-cricket-green font-bold">Admin</Link>}
          {user?.role === "organizer" && <Link to="/organizer/dashboard" className="text-cricket-green font-bold">Organizer</Link>}
          {user?.role === "captain" && <Link to="/captain/dashboard" className="text-cricket-green font-bold">Captain</Link>}

          {user ? (
            <button onClick={handleLogout} className="btn-secondary flex items-center gap-2">
              <LogOut size={18} /> Logout
            </button>
          ) : (
            <Link to="/login" className="btn-primary">Login</Link>
          )}
        </div>

        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>

        {open && (
          <div className="absolute top-16 left-0 right-0 bg-white border-b-2 border-cricket-green p-4 md:hidden">
            <Link to="/" className="block py-2">Home</Link>
            <Link to="/grounds" className="block py-2">Grounds</Link>
            <Link to="/matches" className="block py-2">Matches</Link>
            <Link to="/tournaments" className="block py-2">Tournaments</Link>
            {user ? (
              <button onClick={handleLogout} className="w-full mt-4 btn-secondary">Logout</button>
            ) : (
              <Link to="/login" className="w-full block mt-4 btn-primary text-center">Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}