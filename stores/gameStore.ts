import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { GameState, TaskCompletion, UserProfile } from "@/types";
import { getLevel, getLevelTitle, TASK_XP, PHASE_BONUS_XP } from "@/lib/xp";
import { calculateStreak, today } from "@/lib/streak";
import { PHASES, getPhaseForTask } from "@/lib/roadmap-data";

const initialProfile: UserProfile = {
  id: "",
  displayName: "ゲスト",
  avatarUrl: null,
  totalXp: 0,
  currentLevel: 1,
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: null,
  createdAt: new Date().toISOString(),
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      profile: null,
      completedTaskIds: new Set<string>(),
      taskCompletions: [],

      showLevelUpModal: false,
      levelUpTo: null,
      newTitle: null,
      pendingXp: null,
      showPhaseClearModal: false,
      clearedPhaseId: null,

      setProfile: (profile: UserProfile) => set({ profile }),

      completeTask: (taskId: string, phase: number) => {
        const state = get();
        if (!state.profile) return;
        if (state.completedTaskIds.has(taskId)) return;

        const xpEarned = TASK_XP;
        const newCompletedIds = new Set(state.completedTaskIds);
        newCompletedIds.add(taskId);

        // フェーズ完了ボーナスチェック
        const phaseData = PHASES.find((p) => p.id === phase);
        let bonusXp = 0;
        if (phaseData) {
          const allDone = phaseData.tasks.every((t) =>
            newCompletedIds.has(t.id)
          );
          if (allDone) bonusXp = PHASE_BONUS_XP;
        }

        const totalXpGained = xpEarned + bonusXp;
        const newTotalXp = state.profile.totalXp + totalXpGained;
        const oldLevel = state.profile.currentLevel;
        const newLevel = getLevel(newTotalXp);

        // ストリーク計算
        const newStreak = calculateStreak(
          state.profile.lastActivityDate,
          state.profile.currentStreak
        );
        const longestStreak = Math.max(state.profile.longestStreak, newStreak);

        // レベルアップ判定
        const leveledUp = newLevel > oldLevel;
        const newTitleInfo = leveledUp ? getLevelTitle(newLevel) : null;

        const completion: TaskCompletion = {
          id: crypto.randomUUID(),
          userId: state.profile.id,
          taskId,
          phase,
          xpEarned: totalXpGained,
          completedAt: new Date().toISOString(),
        };

        set({
          profile: {
            ...state.profile,
            totalXp: newTotalXp,
            currentLevel: newLevel,
            currentStreak: newStreak,
            longestStreak,
            lastActivityDate: today(),
          },
          completedTaskIds: newCompletedIds,
          taskCompletions: [...state.taskCompletions, completion],
          pendingXp: totalXpGained,
          ...(leveledUp
            ? {
                showLevelUpModal: true,
                levelUpTo: newLevel,
                newTitle: newTitleInfo?.title ?? null,
              }
            : {}),
          ...(bonusXp > 0
            ? {
                showPhaseClearModal: !leveledUp,
                clearedPhaseId: phase,
              }
            : {}),
        });
      },

      uncompleteTask: (taskId: string) => {
        const state = get();
        if (!state.profile) return;
        if (!state.completedTaskIds.has(taskId)) return;

        const newCompletedIds = new Set(state.completedTaskIds);
        newCompletedIds.delete(taskId);

        // 該当タスクの完了記録を探してXPを戻す
        const completion = state.taskCompletions.find(
          (c) => c.taskId === taskId
        );
        const xpToRemove = completion?.xpEarned ?? TASK_XP;
        const newTotalXp = Math.max(0, state.profile.totalXp - xpToRemove);
        const newLevel = getLevel(newTotalXp);

        set({
          profile: {
            ...state.profile,
            totalXp: newTotalXp,
            currentLevel: newLevel,
          },
          completedTaskIds: newCompletedIds,
          taskCompletions: state.taskCompletions.filter(
            (c) => c.taskId !== taskId
          ),
        });
      },

      dismissLevelUp: () =>
        set({ showLevelUpModal: false, levelUpTo: null, newTitle: null }),

      dismissPhaseClear: () =>
        set({ showPhaseClearModal: false, clearedPhaseId: null }),

      clearPendingXp: () => set({ pendingXp: null }),

      loadFromCompletions: (completions: TaskCompletion[]) => {
        const ids = new Set(completions.map((c) => c.taskId));
        const totalXp = completions.reduce((sum, c) => sum + c.xpEarned, 0);
        const level = getLevel(totalXp);

        set((state) => ({
          completedTaskIds: ids,
          taskCompletions: completions,
          profile: state.profile
            ? { ...state.profile, totalXp: totalXp, currentLevel: level }
            : null,
        }));
      },

      reset: () =>
        set({
          profile: null,
          completedTaskIds: new Set(),
          taskCompletions: [],
          showLevelUpModal: false,
          levelUpTo: null,
          newTitle: null,
          pendingXp: null,
          showPhaseClearModal: false,
          clearedPhaseId: null,
        }),
    }),
    {
      name: "x-quest-data",
      version: 1,
      // Setをシリアライズ可能にする
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          if (parsed?.state?.completedTaskIds) {
            parsed.state.completedTaskIds = new Set(
              parsed.state.completedTaskIds
            );
          }
          return parsed;
        },
        setItem: (name, value) => {
          const serializable = {
            ...value,
            state: {
              ...value.state,
              completedTaskIds: Array.from(
                value.state.completedTaskIds || []
              ),
            },
          };
          localStorage.setItem(name, JSON.stringify(serializable));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
