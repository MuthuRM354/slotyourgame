import { motion } from "framer-motion";
import { X } from "lucide-react";

export default function VerificationModal({ organizer, onApprove, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        className="bg-white rounded-xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Verify Organizer</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-black">
            <X size={24} />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <p><strong>Name:</strong> {organizer.name}</p>
          <p><strong>User ID:</strong> {organizer.userId}</p>
          <p><strong>Grounds:</strong> {organizer.grounds.length}</p>
          <p><strong>Docs:</strong> {organizer.verificationDocs.join(", ")}</p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => { onApprove(); onClose(); }}
          className="w-full btn-primary"
        >
          Approve Verification
        </motion.button>
      </motion.div>
    </motion.div>
  );
}