import { motion } from "framer-motion";

const roleColors = {
  admin: "bg-purple-500",
  organizer: "bg-blue-500",
  captain: "bg-cricket-green",
};

export default function RoleBadge({ role }) {
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      className={`${roleColors[role]} text-white text-xs font-bold px-3 py-1 rounded-full`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </motion.span>
  );
}