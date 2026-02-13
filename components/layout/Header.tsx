"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import LevelBadge from "@/components/gamification/LevelBadge";
import StreakCounter from "@/components/gamification/StreakCounter";
import { useGameStore } from "@/stores/gameStore";
import { signOut, isSupabaseEnabled } from "@/lib/supabase/db";

export default function Header() {
  const router = useRouter();
  const profile = useGameStore((s) => s.profile);
  const reset = useGameStore((s) => s.reset);
  const [showMenu, setShowMenu] = useState(false);

  if (!profile) return null;

  const handleLogout = async () => {
    if (isSupabaseEnabled()) {
      await signOut();
    }
    reset();
    router.replace("/");
  };

  return (
    <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-md border-b border-border">
      <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="flex items-center gap-2"
        >
          <span className="font-black text-lg text-primary">X Quest</span>
        </button>
        <div className="flex items-center gap-3">
          <StreakCounter streak={profile.currentStreak} />
          <LevelBadge level={profile.currentLevel} size="sm" />
        </div>
      </div>

      {showMenu && (
        <div className="max-w-lg mx-auto px-4 pb-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-xs text-text-sub hover:text-streak transition-colors"
          >
            <LogOut size={14} />
            ログアウト
          </button>
        </div>
      )}
    </header>
  );
}
