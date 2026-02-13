"use client";

import LevelBadge from "@/components/gamification/LevelBadge";
import StreakCounter from "@/components/gamification/StreakCounter";
import { useGameStore } from "@/stores/gameStore";

export default function Header() {
  const profile = useGameStore((s) => s.profile);

  if (!profile) return null;

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-black text-lg text-primary">X Quest</span>
        </div>
        <div className="flex items-center gap-3">
          <StreakCounter streak={profile.currentStreak} />
          <LevelBadge level={profile.currentLevel} size="sm" />
        </div>
      </div>
    </header>
  );
}
