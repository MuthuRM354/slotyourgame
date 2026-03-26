import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import SportyCard from "../components/SportyCard";

export default function Grounds() {
  const { data } = useData();
  const [ballTypeFilter, setBallTypeFilter] = useState("");
  const [areaFilter, setAreaFilter] = useState("");

  const areas = useMemo(
    () => [...new Set(data.grounds.map((g) => g.area))],
    [data.grounds]
  );

  const filtered = data.grounds.filter(
    (g) => (!ballTypeFilter || g.ballType === ballTypeFilter) && (!areaFilter || g.area === areaFilter)
  );

  return (
    <div>
      <motion.h2
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-cricket-green mb-8"
      >
        🏟 Verified Grounds
      </motion.h2>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4 mb-8 flex-wrap">
        <select
          value={areaFilter}
          onChange={(e) => setAreaFilter(e.target.value)}
          className="border-2 border-cricket-green rounded-lg px-4 py-2 focus:outline-none"
        >
          <option value="">All Areas</option>
          {areas.map((area) => (
            <option key={area} value={area}>{area}</option>
          ))}
        </select>

        <select
          value={ballTypeFilter}
          onChange={(e) => setBallTypeFilter(e.target.value)}
          className="border-2 border-cricket-green rounded-lg px-4 py-2 focus:outline-none"
        >
          <option value="">All Ball Types</option>
          <option value="leather">Leather</option>
          <option value="tennis">Tennis</option>
        </select>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((ground, i) => (
          <SportyCard key={ground.id} delay={i * 0.05}>
            <h3 className="text-xl font-bold text-cricket-green mb-2">{ground.name}</h3>
            <div className="space-y-2 text-gray-700 text-sm">
              <p><strong>Area:</strong> {ground.area}</p>
              <p><strong>Ball Type:</strong> {ground.ballType}</p>
              <p><strong>Price:</strong> ₹{ground.pricePerHour}/hr</p>
              <p><strong>Slots:</strong> {ground.availableSlots.length}</p>
            </div>

            <motion.div whileHover={{ scale: 1.05 }} className="mt-4">
              <Link to={`/grounds/${ground.id}`} className="w-full btn-primary block text-center">
                View Details & Slots
              </Link>
            </motion.div>
          </SportyCard>
        ))}
      </motion.div>
    </div>
  );
}