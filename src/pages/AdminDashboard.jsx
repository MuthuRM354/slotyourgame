import { useState } from "react";
import { motion } from "framer-motion";
import { useData } from "../context/DataContext";
import VerificationModal from "../components/VerificationModal";
import SportyCard from "../components/SportyCard";

export default function AdminDashboard() {
  const { data, approveOrganizer } = useData();
  const [selectedOrg, setSelectedOrg] = useState(null);

  const pending = data.organizers.filter((o) => !o.isVerified);
  const verified = data.organizers.filter((o) => o.isVerified);

  return (
    <div>
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold text-cricket-green mb-8"
      >
        👨‍💼 Admin Dashboard
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
      >
        <SportyCard>
          <h3 className="text-gray-600 text-sm font-semibold">Total Grounds</h3>
          <p className="text-4xl font-bold text-cricket-green">{data.grounds.length}</p>
        </SportyCard>
        <SportyCard>
          <h3 className="text-gray-600 text-sm font-semibold">Active Matches</h3>
          <p className="text-4xl font-bold text-cricket-green">{data.matches.length}</p>
        </SportyCard>
        <SportyCard>
          <h3 className="text-gray-600 text-sm font-semibold">Teams</h3>
          <p className="text-4xl font-bold text-cricket-green">{data.teams.length}</p>
        </SportyCard>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="space-y-8"
      >
        <SportyCard>
          <h2 className="text-2xl font-bold text-cricket-green mb-6">⏳ Pending Verification ({pending.length})</h2>
          <div className="space-y-4">
            {pending.map((org) => (
              <motion.div
                key={org.id}
                whileHover={{ scale: 1.02 }}
                className="p-4 border-2 border-yellow-400 rounded-lg"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-lg">{org.name}</h3>
                    <p className="text-sm text-gray-600">Grounds: {org.grounds.length}</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setSelectedOrg(org)}
                    className="btn-primary"
                  >
                    Review
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </SportyCard>

        <SportyCard>
          <h2 className="text-2xl font-bold text-cricket-green mb-6">✅ Verified Organizers ({verified.length})</h2>
          <div className="space-y-3">
            {verified.map((org) => (
              <div key={org.id} className="p-3 bg-green-50 rounded-lg border-2 border-green-300">
                <p className="font-bold">{org.name}</p>
                <p className="text-sm text-gray-600">Grounds: {org.grounds.length}</p>
              </div>
            ))}
          </div>
        </SportyCard>
      </motion.div>

      {selectedOrg && (
        <VerificationModal
          organizer={selectedOrg}
          onApprove={() => approveOrganizer(selectedOrg.userId)}
          onClose={() => setSelectedOrg(null)}
        />
      )}
    </div>
  );
}