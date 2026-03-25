import { motion } from "framer-motion";
import AnimatedBall from "./AnimatedBall";

export default function StadiumHero() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-stadium-gradient text-white py-20 rounded-2xl mb-12 relative overflow-hidden"
    >
      <div className="container mx-auto px-4 text-center">
        <motion.h1
          initial={{ y: -30 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-bold mb-4"
        >
          Chennai Cricket Platform
        </motion.h1>
        <motion.p
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg opacity-90 mb-8"
        >
          Open-ground leather • Corporate tennis • Zero convenience fees
        </motion.p>
        <div className="flex justify-center gap-4 flex-wrap">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-icc-gold text-black px-6 py-3 rounded-lg font-bold"
          >
            Find Grounds
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-cricket-green px-6 py-3 rounded-lg font-bold"
          >
            Post Match
          </motion.button>
        </div>
      </div>
      <motion.div
        className="absolute top-8 right-8"
        animate={{ rotate: 360 }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      >
        <AnimatedBall />
      </motion.div>
    </motion.section>
  );
}