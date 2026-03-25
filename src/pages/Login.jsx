import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import RoleBadge from "../components/RoleBadge";

const credentials = [
  { email: "admin@cricketplatform.in", password: "admin123", role: "admin" },
  { email: "abdul@omrgrounds.com", password: "abdul123", role: "organizer" },
  { email: "muthu@kuwy.com", password: "muthu123", role: "captain" },
];

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (login(email, password)) {
      navigate("/");
    } else {
      setError("Invalid credentials");
    }
  };

  const quickLogin = (cred) => {
    setEmail(cred.email);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen bg-stadium-gradient flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
      >
        <h1 className="text-4xl font-bold text-center text-cricket-green mb-8">🏏 Login</h1>

        <form onSubmit={handleLogin} className="space-y-4 mb-8">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-cricket-green outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border-2 border-gray-300 rounded-lg px-4 py-2 focus:border-cricket-green outline-none"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full btn-primary"
          >
            Login
          </motion.button>
        </form>

        <div className="space-y-3">
          <p className="text-center text-gray-600 font-semibold">Quick Login Demo</p>
          {credentials.map((cred, i) => (
            <motion.button
              key={i}
              whileHover={{ scale: 1.03 }}
              onClick={() => quickLogin(cred)}
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-left hover:bg-gray-50 transition"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-semibold text-sm">{cred.email}</p>
                  <p className="text-xs text-gray-500">{cred.password}</p>
                </div>
                <RoleBadge role={cred.role} />
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}