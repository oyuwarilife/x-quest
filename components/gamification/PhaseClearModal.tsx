"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { useGameStore } from "@/stores/gameStore";
import { PHASES } from "@/lib/roadmap-data";

export default function PhaseClearModal() {
  const { showPhaseClearModal, clearedPhaseId, dismissPhaseClear } =
    useGameStore();

  const phase = PHASES.find((p) => p.id === clearedPhaseId);

  useEffect(() => {
    if (showPhaseClearModal) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#00B894", "#6C5CE7", "#FDCB6E"],
      });
    }
  }, [showPhaseClearModal]);

  const handleShare = () => {
    if (!phase) return;
    const text = `【X Quest】Stage ${phase.id}「${phase.title}」をクリアしました！🎉\n\nX運用マスターへの冒険を続けます⚔️\n\n@oyuwari_life`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <AnimatePresence>
      {showPhaseClearModal && phase && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissPhaseClear}
        >
          <motion.div
            className="bg-surface rounded-2xl p-8 mx-4 text-center shadow-2xl max-w-sm w-full"
            initial={{ scale: 0.3, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              className="text-5xl mb-3"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {phase.icon}
            </motion.div>

            <h2 className="text-lg font-bold text-secondary mb-1">
              STAGE CLEAR!
            </h2>

            <motion.p
              className="text-xl font-black mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              Stage {phase.id}: {phase.title}
            </motion.p>

            <motion.p
              className="text-sm text-text-sub mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ボーナス +100XP 獲得！
            </motion.p>

            <div className="space-y-2">
              <button
                onClick={handleShare}
                className="w-full px-6 py-2.5 rounded-full font-bold text-sm text-white transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: "#1DA1F2" }}
              >
                Xでシェアする
              </button>
              <button
                onClick={dismissPhaseClear}
                className="w-full px-6 py-2.5 rounded-full font-bold text-sm transition-transform hover:scale-105 active:scale-95 border-2 border-border text-text-sub"
              >
                冒険を続ける
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
