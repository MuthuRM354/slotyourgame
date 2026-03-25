import { motion } from "framer-motion";

export default function SportyCard({ children, delay = 0 }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ scale: 1.05, rotateX: 5 }}
      className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-cricket-green card-hover"
    >
      {children}
    </motion.div>
  );
}