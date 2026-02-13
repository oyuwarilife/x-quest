"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Calendar, Zap, Flame, Swords } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import Header from "@/components/layout/Header";
import BottomNav from "@/components/layout/BottomNav";
import LevelUpModal from "@/components/gamification/LevelUpModal";
import { getTask } from "@/lib/roadmap-data";

export default function LogPage() {
  const router = useRouter();
  const profile = useGameStore((s) => s.profile);
  const taskCompletions = useGameStore((s) => s.taskCompletions);

  useEffect(() => {
    if (!profile) router.replace("/");
  }, [profile, router]);

  if (!profile) return null;

  // 日付ごとにグルーピング（新しい順）
  const grouped = [...taskCompletions]
    .sort(
      (a, b) =>
        new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime()
    )
    .reduce<Record<string, typeof taskCompletions>>((acc, c) => {
      const date = new Date(c.completedAt).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
      if (!acc[date]) acc[date] = [];
      acc[date].push(c);
      return acc;
    }, {});

  const dates = Object.keys(grouped);

  // 統計
  const totalXpEarned = taskCompletions.reduce((sum, c) => sum + c.xpEarned, 0);
  const activeDays = new Set(
    taskCompletions.map((c) =>
      new Date(c.completedAt).toLocaleDateString("ja-JP")
    )
  ).size;

  return (
    <div className="min-h-screen bg-bg pb-nav">
      <Header />
      <LevelUpModal />

      <main className="max-w-lg mx-auto px-4 py-6">
        <motion.h1
          className="text-xl font-black mb-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          冒険ログ
        </motion.h1>
        <motion.p
          className="text-sm text-text-sub mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          これまでの冒険記録
        </motion.p>

        {/* 統計サマリー */}
        {taskCompletions.length > 0 && (
          <motion.div
            className="grid grid-cols-3 gap-2 mb-5"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className="text-center p-3 rounded-xl bg-surface border border-border">
              <Swords size={16} className="mx-auto mb-1 text-primary" />
              <p className="text-lg font-black">{taskCompletions.length}</p>
              <p className="text-[10px] text-text-sub">クエスト達成</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-surface border border-border">
              <Zap size={16} className="mx-auto mb-1 text-accent" />
              <p className="text-lg font-black">{totalXpEarned}</p>
              <p className="text-[10px] text-text-sub">獲得XP</p>
            </div>
            <div className="text-center p-3 rounded-xl bg-surface border border-border">
              <Flame size={16} className="mx-auto mb-1 text-streak" />
              <p className="text-lg font-black">{activeDays}</p>
              <p className="text-[10px] text-text-sub">冒険日数</p>
            </div>
          </motion.div>
        )}

        {dates.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Calendar
              size={48}
              className="mx-auto mb-3"
              style={{ color: "var(--color-locked)" }}
            />
            <p className="text-sm text-text-sub">
              まだ冒険が始まっていません。
              <br />
              冒険マップからクエストに挑戦しよう！
            </p>
          </motion.div>
        ) : (
          <div className="space-y-6">
            {dates.map((date, di) => (
              <motion.div
                key={date}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: di * 0.05 }}
              >
                <h2 className="text-xs font-bold text-text-sub mb-2 flex items-center gap-1.5">
                  <Calendar size={14} />
                  {date}
                </h2>
                <div className="space-y-1.5">
                  {grouped[date].map((completion) => {
                    const info = getTask(completion.taskId);
                    return (
                      <div
                        key={completion.id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border"
                      >
                        <CheckCircle2
                          size={18}
                          style={{ color: "var(--color-secondary)" }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">
                            {info?.task.label ?? completion.taskId}
                          </p>
                          {info && (
                            <p className="text-xs text-text-sub">
                              Stage {info.phase.id}: {info.phase.title}
                            </p>
                          )}
                        </div>
                        <span
                          className="text-xs font-bold shrink-0"
                          style={{ color: "var(--color-secondary)" }}
                        >
                          +{completion.xpEarned}XP
                        </span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
