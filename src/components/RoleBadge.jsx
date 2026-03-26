import { motion } from "framer-motion";

const roleColors = {
  admin: "bg-purple-500",
  organizer: "bg-blue-500",
  captain: "bg-cricket-green",
};

export default function RoleBadge({ role, selected = false, onClick }) {
  const clickable = typeof onClick === "function";

  const handleKeyDown = (e) => {
    if (!clickable) return;
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <motion.span
      whileHover={clickable ? { scale: 1.06 } : undefined}
      whileTap={clickable ? { scale: 0.96 } : undefined}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role={clickable ? "button" : undefined}
      tabIndex={clickable ? 0 : undefined}
      className={`${roleColors[role]} text-white text-xs font-bold px-3 py-1 rounded-full ${
        selected ? "ring-2 ring-icc-gold" : "opacity-90"
      } ${clickable ? "cursor-pointer" : ""}`}
    >
      {role.charAt(0).toUpperCase() + role.slice(1)}
    </motion.span>
  );
}