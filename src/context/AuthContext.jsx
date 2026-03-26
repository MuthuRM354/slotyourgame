import { createContext, useContext, useState } from "react";
import mockData from "../data/mockData.json";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const login = (email, password) => {
    const found = mockData.users.find((u) => u.email === email && u.password === password);
    if (!found) return false;
    setUser(found);
    localStorage.setItem("user", JSON.stringify(found));
    return true;
  };

  const register = (email, password, role) => {
    const exists = mockData.users.some((u) => u.email === email);
    if (exists) return false;

    const newUser = {
      id: Date.now(),
      role,
      name: email.split("@")[0],
      email,
      password,
      phone: ""
    };

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be inside AuthProvider");
  return context;
};