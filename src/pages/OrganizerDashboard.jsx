import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../context/AuthContext";
import { useData } from "../context/DataContext";
import SportyCard from "../components/SportyCard";

export default function OrganizerDashboard() {
  const { user } = useAuth();
  const { data } = useData();
  const [tab, setTab] = useState("grounds");

  const organizer = data.organizers.find((o) => o.userId === user.id);
  const myGrounds = data.grounds.filter((g) => organizer?.grounds.includes(g.id));

  const tabs = [
    { id: "grounds", label: "🏟 My Grounds", count: myGrounds.length },
    { id: "tournaments", label: "🏆 Tournaments", count: 0 },
    { id: "verification", label: "✓ Verification", count: 0 },
  ];

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-cricket-green mb-8"
      >
        Organizer Dashboard
      </motion.h1>

      {!organizer?.isVerified && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded"
        >
          <p className="font-semibold text-yellow-800">⏳ Your organization is pending admin verification</p>
        </motion.div>
      )}

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
            {t.count > 0 && <span className="bg-icc-gold text-black px-2 rounded-full text-sm">{t.count}</span>}
          </motion.button>
        ))}
      </motion.div>

      {tab === "grounds" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {myGrounds.map((ground, i) => (
            <SportyCard key={ground.id} delay={i * 0.05}>
              <h3 className="text-xl font-bold text-cricket-green mb-2">{ground.name}</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Area:</strong> {ground.area}</p>
                <p><strong>Type:</strong> {ground.ballType}</p>
                <p><strong>Price:</strong> ₹{ground.pricePerHour}/hr</p>
                <p><strong>Slots:</strong> {ground.availableSlots.length} available</p>
              </div>
              <motion.button whileHover={{ scale: 1.05 }} className="w-full mt-4 btn-primary">
                Edit Ground
              </motion.button>
            </SportyCard>
          ))}
          <SportyCard>
            <h3 className="text-xl font-bold text-cricket-green mb-4">➕ Add New Ground</h3>
            <form className="space-y-3">
              <input placeholder="Ground Name" className="w-full border rounded px-3 py-2" />
              <input placeholder="Area" className="w-full border rounded px-3 py-2" />
              <select className="w-full border rounded px-3 py-2">
                <option>Leather</option>
                <option>Tennis</option>
              </select>
              <input type="number" placeholder="Price/hr" className="w-full border rounded px-3 py-2" />
              <motion.button whileHover={{ scale: 1.05 }} className="w-full btn-primary">
                Add Ground
              </motion.button>
            </form>
          </SportyCard>
        </motion.div>
      )}

      {tab === "verification" && (
        <SportyCard>
          <h3 className="text-xl font-bold text-cricket-green mb-4">Upload Verification Documents</h3>
          <form className="space-y-4">
            <div>
              <label className="block font-semibold mb-2">ID Proof</label>
              <input type="file" className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block font-semibold mb-2">Ground Photos</label>
              <input type="file" multiple className="w-full border rounded px-3 py-2" />
            </div>
            <motion.button whileHover={{ scale: 1.05 }} className="w-full btn-primary">
              Submit for Verification
            </motion.button>
          </form>
        </SportyCard>
      )}
    </div>
  );
}