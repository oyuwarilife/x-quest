"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Map, ChevronRight, Swords, Share2, Crown } from "lucide-react";
import Link from "next/link";
import { useGameStore } from "@/stores/gameStore";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import XPBar from "@/components/gamification/XPBar";
import StreakCounter from "@/components/gamification/StreakCounter";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import PhaseClearModal from "@/components/gamification/PhaseClearModal";
import XPFloat from "@/components/gamification/XPFloat";
import ProgressBar from "@/components/ui/ProgressBar";
import { PHASES } from "@/lib/roadmap-data";
import { getLevelTitle } from "@/lib/xp";

export default function DashboardPage() {
  const router = useRouter();
  const profile = useGameStore((s) => s.profile);
  const completedTaskIds = useGameStore((s) => s.completedTaskIds);

  useEffect(() => {
    if (!profile) router.replace("/");
  }, [profile, router]);

  if (!profile) return null;

  const titleInfo = getLevelTitle(profile.currentLevel);

  // 現在のフェーズ（最初の未完了フェーズ）
  const currentPhase = PHASES.find((p) => {
    const allDone = p.tasks.every((t) => completedTaskIds.has(t.id));
    return !allDone && profile.currentLevel >= p.requiredLevel;
  });

  // 次にやるべきタスク
  const nextTask = currentPhase?.tasks.find(
    (t) => !completedTaskIds.has(t.id)
  );

  // 全体進捗
  const totalTasks = PHASES.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTotal = completedTaskIds.size;
  const isAllCleared = completedTotal >= totalTasks;

  return (
    <div className="min-h-screen bg-bg pb-nav">
      <Header />
      <LevelUpModal />
      <PhaseClearModal />
      <XPFloat />

      <main className="max-w-lg mx-auto px-4 py-6 space-y-5">
        {/* レベル・称号・ヒーロー */}
        <motion.div
          className="text-center p-6 rounded-2xl bg-surface border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <motion.div
            className="text-5xl font-black mb-1"
            style={{ color: titleInfo.color }}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Lv.{profile.currentLevel}
          </motion.div>
          <div
            className="text-sm font-bold mb-4"
            style={{ color: titleInfo.color }}
          >
            {titleInfo.title}
          </div>
          <XPBar totalXp={profile.totalXp} level={profile.currentLevel} />
        </motion.div>

        {/* ストリーク + 統計 */}
        <motion.div
          className="flex items-center justify-between p-4 rounded-2xl bg-surface border border-border"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StreakCounter streak={profile.currentStreak} />
          <div className="text-right">
            <p className="text-xs text-text-sub">冒険の進捗</p>
            <p className="text-sm font-bold">
              {completedTotal}/{totalTasks} クエスト
            </p>
          </div>
        </motion.div>

        {/* 全クリア */}
        {isAllCleared ? (
          <motion.div
            className="text-center p-6 rounded-2xl border-2 border-accent/40 bg-gradient-to-b from-accent/10 to-accent/5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <motion.div
              className="text-5xl mb-3"
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              🏆
            </motion.div>
            <h2 className="text-lg font-black mb-1" style={{ color: "var(--color-accent)" }}>
              ALL STAGES CLEAR!
            </h2>
            <p className="text-sm text-text-sub mb-1">
              全{totalTasks}クエストを達成しました！
            </p>
            <p className="text-xs text-text-sub">
              あなたはX運用マスターです。これからも冒険を続けていきましょう！
            </p>
          </motion.div>
        ) : (
          <>
            {/* 現在のフェーズ */}
            {currentPhase && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link href="/map">
                  <div className="p-4 rounded-2xl bg-surface border border-border hover:border-primary/30 transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{currentPhase.icon}</span>
                        <h3 className="font-bold text-sm">
                          Stage {currentPhase.id}: {currentPhase.title}
                        </h3>
                      </div>
                      <ChevronRight size={18} className="text-text-sub" />
                    </div>
                    <ProgressBar
                      value={
                        currentPhase.tasks.filter((t) =>
                          completedTaskIds.has(t.id)
                        ).length / currentPhase.tasks.length
                      }
                      height={8}
                    />
                  </div>
                </Link>
              </motion.div>
            )}

            {/* 次のクエスト */}
            {nextTask && (
              <motion.div
                className="p-4 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-xs text-primary font-bold mb-1 flex items-center gap-1">
                  <Swords size={12} />
                  次のクエスト
                </p>
                <p className="text-sm font-medium">{nextTask.label}</p>
                <p className="text-xs text-text-sub mt-1">
                  達成で +{nextTask.xp}XP ・ スキップもOK
                </p>
              </motion.div>
            )}
          </>
        )}

        {/* ボタン群 */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/map"
            className="flex items-center justify-center gap-2 p-3 rounded-2xl font-bold text-sm text-white transition-transform hover:scale-[1.02] active:scale-[0.98]"
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            <Map size={18} />
            冒険マップへ
          </Link>
          <button
            onClick={() => {
              const text = `【X Quest】Lv.${profile.currentLevel}「${titleInfo.title}」\n${completedTotal}/${totalTasks}クエスト達成中！⚔️\n\nX運用マスターへの冒険、一緒にやろう👇\n@oyuwari_life`;
              window.open(
                `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`,
                "_blank"
              );
            }}
            className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] border-2 border-border text-text-sub"
          >
            <Share2 size={16} />
            進捗をXでシェア
          </button>
        </motion.div>
      </main>

      <BottomNav />
    </div>
  );
}
