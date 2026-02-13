import { createClient } from "./client";
import type { UserProfile, TaskCompletion } from "@/types";

/** Supabase が利用可能かチェック */
export function isSupabaseEnabled() {
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/** 現在のログインユーザーを取得 */
export async function getCurrentUser() {
  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/** プロフィールを取得 */
export async function fetchProfile(
  userId: string
): Promise<UserProfile | null> {
  const supabase = createClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) return null;

  return {
    id: data.id,
    displayName: data.display_name ?? "冒険者",
    avatarUrl: data.avatar_url,
    totalXp: data.total_xp ?? 0,
    currentLevel: data.current_level ?? 1,
    currentStreak: data.current_streak ?? 0,
    longestStreak: data.longest_streak ?? 0,
    lastActivityDate: data.last_activity_date,
    createdAt: data.created_at,
  };
}

/** プロフィールを更新 */
export async function updateProfile(profile: UserProfile) {
  const supabase = createClient();
  if (!supabase) return;

  await supabase
    .from("profiles")
    .update({
      display_name: profile.displayName,
      total_xp: profile.totalXp,
      current_level: profile.currentLevel,
      current_streak: profile.currentStreak,
      longest_streak: profile.longestStreak,
      last_activity_date: profile.lastActivityDate,
    })
    .eq("id", profile.id);
}

/** タスク完了記録を全件取得 */
export async function fetchCompletions(
  userId: string
): Promise<TaskCompletion[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("task_completions")
    .select("*")
    .eq("user_id", userId)
    .order("completed_at", { ascending: true });

  if (error || !data) return [];

  return data.map((row) => ({
    id: row.id,
    userId: row.user_id,
    taskId: row.task_id,
    phase: row.phase,
    xpEarned: row.xp_earned,
    completedAt: row.completed_at,
  }));
}

/** タスク完了を保存 */
export async function saveCompletion(completion: TaskCompletion) {
  const supabase = createClient();
  if (!supabase) return;

  await supabase.from("task_completions").upsert({
    id: completion.id,
    user_id: completion.userId,
    task_id: completion.taskId,
    phase: completion.phase,
    xp_earned: completion.xpEarned,
    completed_at: completion.completedAt,
  });
}

/** タスク完了を削除 */
export async function deleteCompletion(userId: string, taskId: string) {
  const supabase = createClient();
  if (!supabase) return;

  await supabase
    .from("task_completions")
    .delete()
    .eq("user_id", userId)
    .eq("task_id", taskId);
}

/** ログアウト */
export async function signOut() {
  const supabase = createClient();
  if (!supabase) return;
  await supabase.auth.signOut();
}
