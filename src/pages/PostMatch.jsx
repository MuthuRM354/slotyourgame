import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function PostMatch() {
  const { user } = useAuth();
  if (user) return <Navigate to="/captain/dashboard" replace />;
  return <Navigate to="/login" replace />;
}