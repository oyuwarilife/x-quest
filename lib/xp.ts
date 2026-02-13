import type { LevelTitle } from "@/types";

/** タスク完了時の基本XP */
export const TASK_XP = 25;

/** フェーズ完了ボーナスXP */
export const PHASE_BONUS_XP = 100;

/** レベルNに到達するための累計XP */
export function xpForLevel(level: number): number {
  if (level <= 1) return 0;
  let total = 0;
  for (let i = 2; i <= level; i++) {
    total += Math.floor(100 * Math.pow(i, 1.2));
  }
  return total;
}

/** 現在のXPからレベルを算出 */
export function getLevel(totalXp: number): number {
  let level = 1;
  let cumulative = 0;
  while (true) {
    const next = Math.floor(100 * Math.pow(level + 1, 1.2));
    if (cumulative + next > totalXp) break;
    cumulative += next;
    level++;
  }
  return level;
}

/** 次のレベルまでの進捗（0〜1） */
export function getLevelProgress(totalXp: number): number {
  const level = getLevel(totalXp);
  const currentLevelXp = xpForLevel(level);
  const nextLevelXp = xpForLevel(level + 1);
  const range = nextLevelXp - currentLevelXp;
  if (range <= 0) return 1;
  return (totalXp - currentLevelXp) / range;
}

/** 次のレベルまでに必要な残りXP */
export function xpToNextLevel(totalXp: number): number {
  const level = getLevel(totalXp);
  const nextLevelXp = xpForLevel(level + 1);
  return nextLevelXp - totalXp;
}

/** レベル称号一覧 */
export const LEVEL_TITLES: LevelTitle[] = [
  { minLevel: 1, maxLevel: 2, title: "見習い冒険者", color: "#95A5A6" },
  { minLevel: 3, maxLevel: 4, title: "駆け出し冒険者", color: "#3498DB" },
  { minLevel: 5, maxLevel: 7, title: "一人前の冒険者", color: "#2ECC71" },
  { minLevel: 8, maxLevel: 11, title: "熟練の冒険者", color: "#9B59B6" },
  { minLevel: 12, maxLevel: 14, title: "伝説の冒険者", color: "#E67E22" },
  { minLevel: 15, maxLevel: 99, title: "X運用マスター", color: "#F1C40F" },
];

/** レベルに対応する称号を取得 */
export function getLevelTitle(level: number): LevelTitle {
  return (
    LEVEL_TITLES.find((t) => level >= t.minLevel && level <= t.maxLevel) ??
    LEVEL_TITLES[0]
  );
}
