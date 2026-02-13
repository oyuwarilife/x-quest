"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/stores/gameStore";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import PhaseCard from "@/components/roadmap/PhaseCard";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import PhaseClearModal from "@/components/gamification/PhaseClearModal";
import XPFloat from "@/components/gamification/XPFloat";
import { PHASES } from "@/lib/roadmap-data";
import { syncTaskComplete, syncTaskUncomplete } from "@/hooks/useAuth";

export default function RoadmapPage() {
  const router = useRouter();
  const profile = useGameStore((s) => s.profile);
  const completedTaskIds = useGameStore((s) => s.completedTaskIds);
  const completeTask = useGameStore((s) => s.completeTask);
  const uncompleteTask = useGameStore((s) => s.uncompleteTask);
  const unlockedPhaseId = useGameStore((s) => s.unlockedPhaseId);

  useEffect(() => {
    if (!profile) router.replace("/");
  }, [profile, router]);

  if (!profile) return null;

  const handleToggleTask = (taskId: string, phase: number) => {
    if (completedTaskIds.has(taskId)) {
      uncompleteTask(taskId);
      syncTaskUncomplete(taskId);
    } else {
      completeTask(taskId, phase);
      syncTaskComplete(taskId, phase);
    }
  };

  // 現在のフェーズ（最初の未完了かつアンロック済み）
  const currentPhaseId = PHASES.find((p) => {
    const allDone = p.tasks.every((t) => completedTaskIds.has(t.id));
    return !allDone && profile.currentLevel >= p.requiredLevel;
  })?.id;

  return (
    <div className="min-h-screen bg-bg pb-nav">
      <Header />
      <LevelUpModal />
      <PhaseClearModal />
      <XPFloat />

      <main className="max-w-lg mx-auto px-4 py-6">
        <motion.h1
          className="text-xl font-black mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          冒険マップ
        </motion.h1>
        <motion.p
          className="text-sm text-text-sub mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          クエストを達成して、X運用マスターを目指そう
        </motion.p>

        <div className="space-y-3">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
            >
              <PhaseCard
                phase={phase}
                completedTaskIds={completedTaskIds}
                isUnlocked={profile.currentLevel >= phase.requiredLevel}
                isCurrentPhase={phase.id === currentPhaseId}
                isJustUnlocked={phase.id === unlockedPhaseId}
                onToggleTask={handleToggleTask}
              />
            </motion.div>
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
