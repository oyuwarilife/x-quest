"use client";

import ProgressBar from "@/components/ui/ProgressBar";
import { getLevelProgress, xpToNextLevel } from "@/lib/xp";

interface XPBarProps {
  totalXp: number;
  level: number;
}

export default function XPBar({ totalXp, level }: XPBarProps) {
  const progress = getLevelProgress(totalXp);
  const remaining = xpToNextLevel(totalXp);

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center text-sm">
        <span className="font-bold" style={{ color: "var(--color-primary)" }}>
          {totalXp} XP
        </span>
        <span className="text-text-sub">次のレベルまで {remaining} XP</span>
      </div>
      <ProgressBar value={progress} />
    </div>
  );
}
