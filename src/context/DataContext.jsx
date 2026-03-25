import { createContext, useContext, useState } from "react";
import mockData from "../data/mockData.json";

const DataContext = createContext();

export function DataProvider({ children }) {
  const [data, setData] = useState(mockData);

  const updateData = (key, items) => {
    setData((prev) => ({ ...prev, [key]: items }));
  };

  const addTeam = (team) => {
    const newTeam = { ...team, id: Math.max(...data.teams.map((t) => t.id), 0) + 1 };
    updateData("teams", [...data.teams, newTeam]);
    return newTeam;
  };

  const addMatch = (match) => {
    const newMatch = { ...match, id: Math.max(...data.matches.map((m) => m.id), 0) + 1 };
    updateData("matches", [...data.matches, newMatch]);
    return newMatch;
  };

  const approveOrganizer = (userId) => {
    const updated = data.organizers.map((o) =>
      o.userId === userId ? { ...o, isVerified: true, pendingVerification: false } : o
    );
    updateData("organizers", updated);
  };

  return (
    <DataContext.Provider value={{ data, updateData, addTeam, addMatch, approveOrganizer }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("useData must be inside DataProvider");
  return context;
};