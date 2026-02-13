"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import LevelBadge from "@/components/gamification/LevelBadge";
import StreakCounter from "@/components/gamification/StreakCounter";
import { useGameStore } from "@/stores/gameStore";
import { signOut, isSupabaseEnabled } from "@/lib/supabase/db";

export default function Header() {
  const router = useRouter();
  const profile = useGameStore((s) => s.profile);
  const reset = useGameStore((s) => s.reset);
  const [showMenu, setShowMenu] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
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
                  onClick={() => {
                    setShowMenu(false);
                    setShowLogoutConfirm(true);
                  }}
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

      {/* ログアウト確認ダイアログ */}
      <AnimatePresence>
        {showLogoutConfirm && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowLogoutConfirm(false)}
          >
            <motion.div
              className="bg-surface rounded-2xl p-6 mx-4 shadow-2xl max-w-sm w-full"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle size={20} className="text-streak" />
                <h3 className="font-bold">ログアウトしますか？</h3>
              </div>
              {!isSupabaseEnabled() || !profile.avatarUrl ? (
                <p className="text-xs text-text-sub mb-4">
                  ゲストモードのデータはこのブラウザにのみ保存されています。
                  ログアウトすると進捗データが失われます。
                </p>
              ) : (
                <p className="text-xs text-text-sub mb-4">
                  Googleアカウントにデータが保存されているので、再ログインで復元できます。
                </p>
              )}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm border-2 border-border text-text-sub transition-colors hover:bg-bg"
                >
                  キャンセル
                </button>
                <button
                  onClick={() => {
                    setShowLogoutConfirm(false);
                    handleLogout();
                  }}
                  className="flex-1 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-colors"
                  style={{ backgroundColor: "var(--color-streak)" }}
                >
                  ログアウト
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
