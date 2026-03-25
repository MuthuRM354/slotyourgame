import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const targetByRole = {
  admin: "/admin/dashboard",
  organizer: "/organizer/dashboard",
  captain: "/captain/dashboard"
};

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "", role: "captain" });
  const [error, setError] = useState("");

  const submit = (e) => {
    e.preventDefault();
    const ok = login(form);
    if (!ok) return setError("Mock login failed for selected role");
    navigate(location.state?.from || targetByRole[form.role], { replace: true });
  };

  return (
    <div className="card auth-card">
      <h2>Login</h2>
      <form className="form-grid" onSubmit={submit}>
        <label>Email<input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></label>
        <label>Password<input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></label>
        <label>Role
          <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            <option value="admin">Admin</option>
            <option value="organizer">Organizer</option>
            <option value="captain">Captain</option>
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn btn-primary" type="submit">Login</button>
      </form>
    </div>
  );
}