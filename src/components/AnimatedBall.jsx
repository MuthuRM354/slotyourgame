import { motion } from "framer-motion";

export default function AnimatedBall() {
  return (
    <motion.div
      animate={{ y: [0, -20, 0] }}
      transition={{ duration: 0.6, repeat: Infinity, ease: "easeInOut" }}
      className="text-6xl"
    >
      🏏
    </motion.div>
  );
}