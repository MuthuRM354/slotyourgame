import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardByRole = {
  admin: "/admin/dashboard",
  organizer: "/organizer/dashboard",
  captain: "/captain/dashboard"
};

export default function ProtectedRoute({ allowedRoles, children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to={dashboardByRole[user.role]} replace />;
  }
  return children;
}