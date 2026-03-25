import { motion } from "framer-motion";
import { useData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext";
import SportyCard from "../components/SportyCard";

export default function Matches() {
  const { data } = useData();
  const { user } = useAuth();

  const groundMap = Object.fromEntries(data.grounds.map((g) => [g.id, g]));

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-cricket-green mb-8"
      >
        ⚾ Match Listings
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {data.matches.map((match, i) => {
          const ground = groundMap[match.groundId];
          return (
            <SportyCard key={match.id} delay={i * 0.05}>
              <h3 className="text-xl font-bold text-cricket-green mb-2">{ground?.name}</h3>
              <div className="space-y-2 text-gray-700 text-sm mb-4">
                <p><strong>Date:</strong> {match.date}</p>
                <p><strong>Time:</strong> {match.startTime} - {match.endTime}</p>
                <p><strong>Ball:</strong> {match.ballType.toUpperCase()}</p>
                <p><strong>Team:</strong> {match.organizerTeamName}</p>
                <p><strong>Level:</strong> {match.level}</p>
                {match.lookingForOpponent && (
                  <span className="inline-block bg-icc-gold text-black px-2 py-1 rounded text-xs font-bold mt-2">
                    🔍 Looking for Opponent
                  </span>
                )}
              </div>
              {user?.role === "captain" && (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="w-full btn-primary"
                >
                  Book This →
                </motion.button>
              )}
            </SportyCard>
          );
        })}
      </motion.div>
    </div>
  );
}