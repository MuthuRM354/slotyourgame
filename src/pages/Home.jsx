import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import StadiumHero from "../components/StadiumHero";
import SportyCard from "../components/SportyCard";

export default function Home() {
  const features = [
    { title: "🏏 Open Grounds", desc: "Leather ball matches on natural pitches" },
    { title: "🎾 Corporate Leagues", desc: "Tennis ball tournaments for companies" },
    { title: "💰 Zero Fees", desc: "No convenience charges for teams" },
    { title: "🔗 CricHeroes", desc: "Integrated with CricHeroes stats" },
  ];

  return (
    <div>
      <StadiumHero />

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
      >
        {features.map((f, i) => (
          <SportyCard key={i} delay={i * 0.1}>
            <h3 className="text-xl font-bold text-cricket-green mb-2">{f.title}</h3>
            <p className="text-gray-700">{f.desc}</p>
          </SportyCard>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
      >
        <Link to="/grounds">
          <SportyCard>
            <h3 className="text-2xl font-bold text-cricket-green mb-2">🌍 Find Grounds</h3>
            <p className="text-gray-700 mb-4">Browse verified open grounds and corporate turfs across Chennai</p>
            <motion.button whileHover={{ scale: 1.05 }} className="btn-primary">
              View Grounds →
            </motion.button>
          </SportyCard>
        </Link>

        <Link to="/matches">
          <SportyCard>
            <h3 className="text-2xl font-bold text-cricket-green mb-2">⚾ Find Opponents</h3>
            <p className="text-gray-700 mb-4">Connect with teams looking for matches</p>
            <motion.button whileHover={{ scale: 1.05 }} className="btn-primary">
              View Matches →
            </motion.button>
          </SportyCard>
        </Link>

        <Link to="/tournaments">
          <SportyCard>
            <h3 className="text-2xl font-bold text-cricket-green mb-2">🏆 Tournaments</h3>
            <p className="text-gray-700 mb-4">Register for corporate and amateur leagues</p>
            <motion.button whileHover={{ scale: 1.05 }} className="btn-primary">
              View Tournaments →
            </motion.button>
          </SportyCard>
        </Link>
      </motion.div>
    </div>
  );
}