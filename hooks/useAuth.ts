"use client";

import { useEffect, useRef } from "react";
import { useGameStore } from "@/stores/gameStore";
import { createClient } from "@/lib/supabase/client";
import {
  fetchProfile,
  fetchCompletions,
  updateProfile,
  saveCompletion,
  deleteCompletion,
  isSupabaseEnabled,
} from "@/lib/supabase/db";

/**
 * Supabase認証とDB同期を管理するフック
 * - ログイン時: DBからプロフィール＋完了記録を読み込み
 * - タスク完了/取消時: DBに同期
 * - ログアウト時: ストアをリセット
 */
export function useAuth() {
  const initialized = useRef(false);

  useEffect(() => {
    if (!isSupabaseEnabled() || initialized.current) return;
    initialized.current = true;

    const supabase = createClient();
    if (!supabase) return;

    // 初回: 現在のセッションを確認
    const initAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await loadUserData(user.id);
      }
    };

    // 認証状態の変更を監視
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await loadUserData(session.user.id);
      } else if (event === "SIGNED_OUT") {
        useGameStore.getState().reset();
      }
    });

    initAuth();

    return () => {
      subscription.unsubscribe();
    };
  }, []);
}

/** DBからユーザーデータを読み込んでストアにセット */
async function loadUserData(userId: string) {
  const store = useGameStore.getState();

  // すでにログイン済みの同一ユーザーならスキップ
  if (store.profile?.id === userId) return;

  // ゲストデータの引き継ぎ: ローカルに進捗があり、DBが空なら移行
  const guestCompletions = store.taskCompletions;
  const hasGuestData = store.profile && store.profile.id !== userId && guestCompletions.length > 0;

  const profile = await fetchProfile(userId);
  if (!profile) return;

  const dbCompletions = await fetchCompletions(userId);

  if (hasGuestData && dbCompletions.length === 0) {
    // ゲストデータをDBに移行
    for (const c of guestCompletions) {
      await saveCompletion({ ...c, userId });
    }
    // プロフィールも更新
    await updateProfile({
      ...profile,
      totalXp: store.profile!.totalXp,
      currentLevel: store.profile!.currentLevel,
      currentStreak: store.profile!.currentStreak,
      longestStreak: store.profile!.longestStreak,
      lastActivityDate: store.profile!.lastActivityDate,
    });
    // 移行後のデータを再取得
    const migratedCompletions = await fetchCompletions(userId);
    const migratedProfile = await fetchProfile(userId);
    store.setProfile(migratedProfile ?? profile);
    store.loadFromCompletions(migratedCompletions);
  } else {
    store.setProfile(profile);
    store.loadFromCompletions(dbCompletions);
  }
}

/**
 * タスク完了時にDBに同期する関数
 * gameStore の completeTask 後に呼ぶ
 */
export async function syncTaskComplete(taskId: string, phase: number) {
  const store = useGameStore.getState();
  const profile = store.profile;
  if (!profile || !isSupabaseEnabled()) return;

  // ゲストユーザー（UUIDv4形式でDB未登録）はスキップ
  // Supabaseユーザーは auth.users にいるのでDBに書き込める
  const supabase = createClient();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  // 完了記録を保存
  const completion = store.taskCompletions.find((c) => c.taskId === taskId);
  if (completion) {
    await saveCompletion(completion);
  }

  // プロフィールを更新
  await updateProfile(profile);
}

/**
 * タスク取消時にDBに同期する関数
 */
export async function syncTaskUncomplete(taskId: string) {
  const store = useGameStore.getState();
  const profile = store.profile;
  if (!profile || !isSupabaseEnabled()) return;

  const supabase = createClient();
  if (!supabase) return;
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await deleteCompletion(user.id, taskId);
  await updateProfile(profile);
}
