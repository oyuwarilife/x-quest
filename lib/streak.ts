/** 今日の日付をYYYY-MM-DD形式で取得 */
export function today(): string {
  return new Date().toISOString().split("T")[0];
}

/** 昨日の日付をYYYY-MM-DD形式で取得 */
export function yesterday(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
}

/**
 * ストリークを計算する
 * @param lastActivityDate 最終活動日（YYYY-MM-DD）
 * @param currentStreak 現在のストリーク数
 * @returns 新しいストリーク数
 */
export function calculateStreak(
  lastActivityDate: string | null,
  currentStreak: number
): number {
  if (!lastActivityDate) return 1;

  const todayStr = today();
  const yesterdayStr = yesterday();

  if (lastActivityDate === todayStr) {
    // 今日すでに活動済み → 変更なし
    return currentStreak;
  } else if (lastActivityDate === yesterdayStr) {
    // 昨日が最終活動日 → ストリーク継続
    return currentStreak + 1;
  } else {
    // それ以前 → リセット
    return 1;
  }
}

/** ストリーク日数に応じた炎の色 */
export function getStreakColor(streak: number): string {
  if (streak >= 100) return "#F1C40F"; // 金
  if (streak >= 30) return "#3498DB"; // 青
  if (streak >= 7) return "#E74C3C"; // 赤
  return "#E17055"; // オレンジ
}

/** ストリーク日数に応じた炎のサイズ倍率 */
export function getStreakScale(streak: number): number {
  if (streak >= 100) return 1.5;
  if (streak >= 30) return 1.3;
  if (streak >= 7) return 1.15;
  return 1;
}
