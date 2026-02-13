import type { Phase } from "@/types";
import { TASK_XP } from "./xp";

export const PHASES: Phase[] = [
  {
    id: 1,
    title: "アカウント設計",
    description: "まずは土台作り。プロフィールを整えてXの第一印象を決めよう。",
    icon: "👤",
    requiredLevel: 1,
    tasks: [
      { id: "p1_account_name", label: "アカウント名を決めた", xp: TASK_XP },
      { id: "p1_profile_image", label: "プロフィール画像を設定した", xp: TASK_XP },
      { id: "p1_header_image", label: "ヘッダー画像を設定した", xp: TASK_XP },
      { id: "p1_bio", label: "「何者か」がわかるプロフィール文を書いた", xp: TASK_XP },
      { id: "p1_link", label: "リンク（ポートフォリオ/LP等）を設定した", xp: TASK_XP },
    ],
  },
  {
    id: 2,
    title: "固定ポスト＆初期投稿",
    description: "最初の発信を始めよう。固定ポストと投稿の型を作る。",
    icon: "📝",
    requiredLevel: 3,
    tasks: [
      { id: "p2_pinned_post", label: "自己紹介の固定ポストを作成した", xp: TASK_XP },
      { id: "p2_first_10", label: "最初の10投稿を完了した", xp: TASK_XP },
      { id: "p2_template", label: "投稿テンプレートを1つ作った", xp: TASK_XP },
    ],
  },
  {
    id: 3,
    title: "投稿習慣化",
    description: "継続は力なり。投稿を習慣にしてフォロワーを増やそう。",
    icon: "🔥",
    requiredLevel: 5,
    tasks: [
      { id: "p3_7day_streak", label: "7日連続で投稿した", xp: TASK_XP },
      { id: "p3_3genres", label: "投稿ジャンルを3つ決めた", xp: TASK_XP },
      { id: "p3_5likes", label: "1投稿あたりいいね5以上もらえた", xp: TASK_XP },
      { id: "p3_reply_habit", label: "リプライを1日3件以上した（7日間）", xp: TASK_XP },
      { id: "p3_100followers", label: "フォロワー100人達成", xp: TASK_XP },
    ],
  },
  {
    id: 4,
    title: "コンテンツ強化",
    description: "投稿の質を上げて存在感を高めよう。",
    icon: "🎨",
    requiredLevel: 8,
    tasks: [
      { id: "p4_illustration", label: "図解投稿を1つ作成した", xp: TASK_XP },
      { id: "p4_thread", label: "スレッド投稿（3ツイート以上）を作成した", xp: TASK_XP },
      { id: "p4_analytics", label: "投稿のインプレッション分析を1回行った", xp: TASK_XP },
      { id: "p4_pattern", label: "反応が良かった投稿パターンを言語化した", xp: TASK_XP },
      { id: "p4_300followers", label: "フォロワー300人達成", xp: TASK_XP },
    ],
  },
  {
    id: 5,
    title: "導線設計",
    description: "フォロワーをお客様に変える仕組みを作ろう。",
    icon: "🔗",
    requiredLevel: 12,
    tasks: [
      { id: "p5_cta", label: "プロフィール→CTAの導線を作った", xp: TASK_XP },
      { id: "p5_freebie", label: "無料特典（PDF/Notion等）を用意した", xp: TASK_XP },
      { id: "p5_pinned_cta", label: "固定ポストにCTAを含めた", xp: TASK_XP },
      { id: "p5_dm", label: "DMでの問い合わせに対応した", xp: TASK_XP },
      { id: "p5_500followers", label: "フォロワー500人達成", xp: TASK_XP },
    ],
  },
  {
    id: 6,
    title: "案件獲得",
    description: "ついにX経由で仕事を獲得！マスターへの道。",
    icon: "🏆",
    requiredLevel: 15,
    tasks: [
      { id: "p6_first_inquiry", label: "X経由で初の問い合わせを受けた", xp: TASK_XP },
      { id: "p6_first_deal", label: "X経由で初案件を獲得した", xp: TASK_XP },
      { id: "p6_testimonial", label: "クライアントの声・実績をポストした", xp: TASK_XP },
      { id: "p6_1000followers", label: "フォロワー1,000人達成", xp: TASK_XP },
    ],
  },
];

/** タスクIDからPhaseを取得 */
export function getPhaseForTask(taskId: string): Phase | undefined {
  return PHASES.find((p) => p.tasks.some((t) => t.id === taskId));
}

/** タスクIDからタスクを取得 */
export function getTask(taskId: string) {
  for (const phase of PHASES) {
    const task = phase.tasks.find((t) => t.id === taskId);
    if (task) return { task, phase };
  }
  return undefined;
}

/** フェーズの全タスク数 */
export function getTotalTasks(): number {
  return PHASES.reduce((sum, p) => sum + p.tasks.length, 0);
}
