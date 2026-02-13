// ========================================
// X運用マスター 型定義
// ========================================

/** 補足リソース（Notionシート等） */
export interface Resource {
  label: string;
  url: string;
}

/** ロードマップのフェーズ */
export interface Phase {
  id: number;
  title: string;
  description: string;
  icon: string;
  requiredLevel: number;
  tasks: Task[];
  tips?: string[];
  resources?: Resource[];
}

/** フェーズ内の個別タスク */
export interface Task {
  id: string;
  label: string;
  xp: number;
}

/** タスク完了記録 */
export interface TaskCompletion {
  id: string;
  userId: string;
  taskId: string;
  phase: number;
  xpEarned: number;
  completedAt: string;
}

/** ユーザープロフィール */
export interface UserProfile {
  id: string;
  displayName: string;
  avatarUrl: string | null;
  totalXp: number;
  currentLevel: number;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  createdAt: string;
}

/** レベル称号 */
export interface LevelTitle {
  minLevel: number;
  maxLevel: number;
  title: string;
  color: string;
}

/** ゲーム状態（Zustandストア） */
export interface GameState {
  profile: UserProfile | null;
  completedTaskIds: Set<string>;
  taskCompletions: TaskCompletion[];

  // UI状態
  showLevelUpModal: boolean;
  levelUpTo: number | null;
  newTitle: string | null;
  pendingXp: number | null;
  showPhaseClearModal: boolean;
  clearedPhaseId: number | null;
  unlockedPhaseId: number | null;

  // アクション
  setProfile: (profile: UserProfile) => void;
  completeTask: (taskId: string, phase: number) => void;
  uncompleteTask: (taskId: string) => void;
  dismissLevelUp: () => void;
  dismissPhaseClear: () => void;
  clearPendingXp: () => void;
  loadFromCompletions: (completions: TaskCompletion[]) => void;
  reset: () => void;
}
