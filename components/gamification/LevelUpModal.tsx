"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import { getLevelTitle } from "@/lib/xp";
import { useGameStore } from "@/stores/gameStore";
import { PHASES } from "@/lib/roadmap-data";

export default function LevelUpModal() {
  const { showLevelUpModal, levelUpTo, newTitle, unlockedPhaseId, dismissLevelUp } =
    useGameStore();

  const unlockedPhase = PHASES.find((p) => p.id === unlockedPhaseId);

  useEffect(() => {
    if (showLevelUpModal) {
      // 紙吹雪演出
      const duration = 2000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#6C5CE7", "#00B894", "#FDCB6E", "#E17055"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#6C5CE7", "#00B894", "#FDCB6E", "#E17055"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [showLevelUpModal]);

  const titleInfo = levelUpTo ? getLevelTitle(levelUpTo) : null;

  return (
    <AnimatePresence>
      {showLevelUpModal && levelUpTo && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={dismissLevelUp}
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
              className="text-5xl mb-4"
              animate={{ scale: [1, 1.3, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              &#x2694;&#xFE0F;
            </motion.div>

            <h2 className="text-lg text-text-sub mb-2">RANK UP!</h2>

            <motion.div
              className="text-6xl font-black mb-3"
              style={{ color: titleInfo?.color ?? "var(--color-primary)" }}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
            >
              Lv.{levelUpTo}
            </motion.div>

            {newTitle && (
              <motion.div
                className="text-xl font-bold mb-4"
                style={{ color: titleInfo?.color }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                称号「{newTitle}」を獲得！
              </motion.div>
            )}

            {unlockedPhase && (
              <motion.div
                className="mb-6 p-3 rounded-xl border-2 border-dashed border-secondary/50 bg-secondary/10"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  className="text-xs text-secondary font-bold mb-1"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  NEW STAGE UNLOCKED!
                </motion.div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-lg">{unlockedPhase.icon}</span>
                  <span className="text-sm font-bold">
                    Stage {unlockedPhase.id}: {unlockedPhase.title}
                  </span>
                </div>
              </motion.div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => {
                  const text = newTitle
                    ? `【X Quest】Lv.${levelUpTo} 称号「${newTitle}」を獲得しました！⚔️\n\nX運用マスターへの冒険を続けます💪\n\n@oyuwari_life`
                    : `【X Quest】Lv.${levelUpTo} にランクアップしました！⚔️\n\n@oyuwari_life`;
                  window.open(
                    `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`,
                    "_blank"
                  );
                }}
                className="w-full px-6 py-2.5 rounded-full font-bold text-sm text-white transition-transform hover:scale-105 active:scale-95"
                style={{ backgroundColor: "#1DA1F2" }}
              >
                Xでシェアする
              </button>
              <button
                onClick={dismissLevelUp}
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
