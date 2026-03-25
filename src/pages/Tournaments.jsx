import { motion } from "framer-motion";
import { useData } from "../context/DataContext";
import { ExternalLink } from "lucide-react";
import SportyCard from "../components/SportyCard";

export default function Tournaments() {
  const { data } = useData();

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-cricket-green mb-8"
      >
        🏆 Tournaments
      </motion.h2>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {data.tournaments.map((tour, i) => (
          <SportyCard key={tour.id} delay={i * 0.05}>
            <h3 className="text-xl font-bold text-cricket-green mb-2">{tour.name}</h3>
            <div className="space-y-2 text-gray-700 text-sm mb-4">
              <p><strong>Season:</strong> {tour.season}</p>
              <p><strong>Location:</strong> {tour.locationArea}</p>
              <p><strong>Dates:</strong> {tour.startDate} to {tour.endDate}</p>
              <p><strong>Ball:</strong> {tour.ballType.toUpperCase()}</p>
              <p><strong>Teams:</strong> {tour.numberOfTeams}</p>
              <p><strong>Prize Pool:</strong> ₹{tour.prizePool}</p>
            </div>
            {tour.usesCricHeroes && (
              <motion.a
                whileHover={{ scale: 1.05 }}
                href={tour.cricHeroesLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 btn-secondary"
              >
                View on CricHeroes <ExternalLink size={16} />
              </motion.a>
            )}
          </SportyCard>
        ))}
      </motion.div>
    </div>
  );
}