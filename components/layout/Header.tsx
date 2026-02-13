"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User } from "lucide-react";
import LevelBadge from "@/components/gamification/LevelBadge";
import StreakCounter from "@/components/gamification/StreakCounter";
import { useGameStore } from "@/stores/gameStore";
import { signOut, isSupabaseEnabled } from "@/lib/supabase/db";

export default function Header() {
  const router = useRouter();
  const profile = useGameStore((s) => s.profile);
  const reset = useGameStore((s) => s.reset);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMenu]);

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
        <span className="font-black text-lg text-primary">X Quest</span>
        <div className="flex items-center gap-3">
          <StreakCounter streak={profile.currentStreak} />
          <LevelBadge level={profile.currentLevel} size="sm" />
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center transition-colors hover:bg-primary/20"
            >
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <User size={16} className="text-primary" />
              )}
            </button>
            {showMenu && (
              <div className="absolute right-0 top-10 bg-surface border border-border rounded-xl shadow-lg py-1 min-w-[140px] z-30">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-bold truncate">
                    {profile.displayName}
                  </p>
                  <p className="text-[10px] text-text-sub">
                    Lv.{profile.currentLevel}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-text-sub hover:bg-streak/10 hover:text-streak transition-colors"
                >
                  <LogOut size={14} />
                  ログアウト
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
