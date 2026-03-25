import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import SportyCard from "../components/SportyCard";

export default function CaptainDashboard() {
  const { user } = useAuth();
  const { data, addTeam, addMatch } = useData();
  const [tab, setTab] = useState("teams");
  const [showTeamForm, setShowTeamForm] = useState(false);
  const [showMatchForm, setShowMatchForm] = useState(false);

  const myTeams = data.teams.filter((t) => t.captainId === user.id);
  const myMatches = data.matches.filter((m) => myTeams.some((t) => t.name === m.organizerTeamName));

  const handleAddTeam = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    addTeam({
      captainId: user.id,
      name: formData.get("name"),
      company: formData.get("company"),
      level: formData.get("level"),
      area: formData.get("area"),
      cricHeroes: formData.get("cricHeroes"),
    });
    e.target.reset();
    setShowTeamForm(false);
  };

  const tabs = [
    { id: "teams", label: "👥 My Teams", count: myTeams.length },
    { id: "matches", label: "⚾ My Matches", count: myMatches.length },
    { id: "bookings", label: "📅 Bookings", count: 0 },
  ];

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-cricket-green mb-8"
      >
        Captain Dashboard
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex gap-4 mb-8 flex-wrap"
      >
        {tabs.map((t) => (
          <motion.button
            key={t.id}
            whileHover={{ scale: 1.05 }}
            onClick={() => setTab(t.id)}
            className={`px-6 py-3 rounded-lg font-bold flex items-center gap-2 ${
              tab === t.id
                ? "btn-primary"
                : "border-2 border-cricket-green text-cricket-green hover:bg-cricket-green hover:text-white"
            }`}
          >
            {t.label}
            <span className="bg-icc-gold text-black px-2 rounded-full text-sm">{t.count}</span>
          </motion.button>
        ))}
      </motion.div>

      {tab === "teams" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {myTeams.map((team, i) => (
            <SportyCard key={team.id} delay={i * 0.05}>
              <h3 className="text-xl font-bold text-cricket-green mb-2">{team.name}</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Company:</strong> {team.company || "Independent"}</p>
                <p><strong>Level:</strong> {team.level}</p>
                <p><strong>Area:</strong> {team.area}</p>
                {team.cricHeroes && (
                  <a href={team.cricHeroes} target="_blank" rel="noreferrer" className="text-cricket-green font-semibold">
                    → CricHeroes Profile
                  </a>
                )}
              </div>
              <motion.button whileHover={{ scale: 1.05 }} className="w-full mt-4 btn-primary">
                Post Match
              </motion.button>
            </SportyCard>
          ))}

          {showTeamForm && (
            <SportyCard>
              <h3 className="text-xl font-bold text-cricket-green mb-4">➕ Add Team</h3>
              <form onSubmit={handleAddTeam} className="space-y-3">
                <input name="name" placeholder="Team Name" required className="w-full border rounded px-3 py-2" />
                <input name="company" placeholder="Company (optional)" className="w-full border rounded px-3 py-2" />
                <select name="level" required className="w-full border rounded px-3 py-2">
                  <option>Corporate</option>
                  <option>Serious Amateur</option>
                </select>
                <input name="area" placeholder="Primary Area" required className="w-full border rounded px-3 py-2" />
                <input name="cricHeroes" placeholder="CricHeroes URL (optional)" className="w-full border rounded px-3 py-2" />
                <motion.button whileHover={{ scale: 1.05 }} className="w-full btn-primary">
                  Create Team
                </motion.button>
              </form>
            </SportyCard>
          )}

          {!showTeamForm && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              onClick={() => setShowTeamForm(true)}
              className="border-4 border-dashed border-cricket-green rounded-xl p-6 text-cricket-green font-bold text-lg hover:bg-cricket-green hover:text-white"
            >
              ➕ Add New Team
            </motion.button>
          )}
        </motion.div>
      )}

      {tab === "matches" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-6"
        >
          {myMatches.length > 0 ? (
            myMatches.map((match, i) => (
              <SportyCard key={match.id} delay={i * 0.05}>
                <h3 className="text-xl font-bold text-cricket-green mb-2">{match.organizerTeamName}</h3>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-700">
                  <p><strong>Date:</strong> {match.date}</p>
                  <p><strong>Time:</strong> {match.startTime}</p>
                  <p><strong>Format:</strong> {match.format}</p>
                  <p><strong>Status:</strong> {match.status}</p>
                </div>
              </SportyCard>
            ))
          ) : (
            <p className="text-gray-600 text-center py-8 text-lg">No matches posted yet</p>
          )}
        </motion.div>
      )}
    </div>
  );
}