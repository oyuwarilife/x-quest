"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/stores/gameStore";

export default function XPFloat() {
  const { pendingXp, clearPendingXp } = useGameStore();

  useEffect(() => {
    if (pendingXp) {
      const timer = setTimeout(clearPendingXp, 1500);
      return () => clearTimeout(timer);
    }
  }, [pendingXp, clearPendingXp]);

  return (
    <AnimatePresence>
      {pendingXp && (
        <motion.div
          className="fixed top-20 right-6 z-40 pointer-events-none"
          initial={{ opacity: 0, y: 20, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -40, scale: 0.9 }}
          transition={{ duration: 0.6 }}
        >
          <span
            className="text-2xl font-black drop-shadow-lg"
            style={{ color: "var(--color-secondary)" }}
          >
            +{pendingXp} XP
          </span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
