import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import RoleBadge from "../components/RoleBadge";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("captain");
  const [error, setError] = useState("");

    const handleRegister = (e) => { 
    e.preventDefault();
    if (register(email, password, role)) {
      navigate("/login");
    } else {
      setError("Registration failed. Please try again.");
    }
    };

    return (
    <div className="min-h-screen bg-stadium-gradient flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full"
        >
        <h1 className="text-4xl font-bold text-center text-cricket-green mb-8">🏏 Register</h1>
        <form onSubmit={handleRegister} className="space-y-4 mb-8">
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
            <div className="flex items-center space-x-4">
            <RoleBadge role="admin" selected={role === "admin"} onClick={() => setRole("admin")} />
            <RoleBadge role="organizer" selected={role === "organizer"} onClick={() => setRole("organizer")} />
            <RoleBadge role="captain" selected={role === "captain"} onClick={() => setRole("captain")} />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <motion.button
            whileHover={{ scale: 1.05 }}
            className="w-full bg-cricket-green text-white py-2 rounded-lg font-semibold"
            type="submit"
            >     Register  
            </motion.button>
        </form>
        <p className="text-center text-gray-600">   
        Already have an account?{" "}
        <span
            className="text-cricket-green font-semibold cursor-pointer" 
            onClick={() => navigate("/login")}
        >
            Login here
        </span>
        </p>  
        </motion.div>
    </div>
    );
}   

