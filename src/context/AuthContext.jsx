import { createContext, useContext, useMemo, useState } from "react";
import { enhancedMockData } from "../data/enhancedMockData";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = ({ role, email }) => {
    const found =
      enhancedMockData.users.find((u) => u.role === role && (!email || u.email === email)) ||
      enhancedMockData.users.find((u) => u.role === role);

    if (!found) return false;
    setUser(found);
    return true;
  };

  const logout = () => setUser(null);

  const value = useMemo(() => ({ user, login, logout }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);