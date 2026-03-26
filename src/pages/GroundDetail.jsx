import { useParams, Link } from "react-router-dom";
import { useData } from "../context/DataContext";
import { motion } from "framer-motion";

export default function GroundDetail() {
  const { id } = useParams();
  const { data } = useData();

  const ground = data.grounds.find((g) => String(g.id) === String(id));
  if (!ground) return <p>Ground not found.</p>;

  return (
    <div className="space-y-6">
      <Link to="/grounds" className="text-cricket-green font-semibold">← Back to Grounds</Link>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-cricket-green mb-2">{ground.name}</h1>
        <p className="text-gray-700"><strong>Area:</strong> {ground.area}</p>
        <p className="text-gray-700"><strong>Ball Type:</strong> {ground.ballType}</p>
        <p className="text-gray-700"><strong>Price:</strong> ₹{ground.pricePerHour}/hr</p>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-2xl font-bold text-cricket-green mb-4">Available Slots</h2>
        <ul className="space-y-2">
          {ground.availableSlots.map((slot, idx) => (
            <li key={idx} className="border border-gray-200 rounded-lg px-4 py-2">
              {slot}
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}