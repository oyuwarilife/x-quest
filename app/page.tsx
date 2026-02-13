"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Target,
  Flame,
  Trophy,
  ChevronRight,
  LogIn,
} from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { PHASES } from "@/lib/roadmap-data";
import { createClient } from "@/lib/supabase/client";

export default function LandingPage() {
  const router = useRouter();
  const profile = useGameStore((s) => s.profile);

  useEffect(() => {
    if (profile) {
      router.replace("/dashboard");
    }
  }, [profile, router]);

  const supabaseEnabled = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  const handleGoogleLogin = async () => {
    const supabase = createClient();
    if (!supabase) return;
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  };

  const handleGuestStart = () => {
    useGameStore.getState().setProfile({
      id: crypto.randomUUID(),
      displayName: "ゲスト",
      avatarUrl: null,
      totalXp: 0,
      currentLevel: 1,
      currentStreak: 0,
      longestStreak: 0,
      lastActivityDate: null,
      createdAt: new Date().toISOString(),
    });
    router.push("/dashboard");
  };

  const features = [
    {
      icon: Target,
      title: "ロードマップ型",
      desc: "6フェーズのステップで迷わず進める",
    },
    {
      icon: Flame,
      title: "ストリーク",
      desc: "毎日の継続がレベルアップにつながる",
    },
    {
      icon: Trophy,
      title: "レベルシステム",
      desc: "タスク完了でXPを獲得してレベルアップ",
    },
  ];

  return (
    <div className="min-h-screen bg-bg">
      <section className="max-w-lg mx-auto px-4 pt-16 pb-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-black mb-3">
            <span style={{ color: "var(--color-x-blue)" }}>X</span>{" "}
            <span style={{ color: "var(--color-primary)" }}>Quest</span>
          </h1>
          <p className="text-lg font-bold text-text mb-2">
            X運用マスターへの道
          </p>
          <p className="text-sm text-text-sub leading-relaxed">
            クライアントワーカーのためのX運用学習アプリ。
            <br />
            ロードマップに沿ってタスクをクリアし、
            <br />
            案件獲得レベルまでレベルアップしよう。
          </p>
        </motion.div>

        <motion.div
          className="mt-8 space-y-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {supabaseEnabled && (
            <button
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-white font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: "var(--color-primary)" }}
            >
              <LogIn size={18} />
              Googleでログインして始める
            </button>
          )}
          <button
            onClick={handleGuestStart}
            className={`w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] ${
              supabaseEnabled
                ? "border-2 border-border text-text-sub"
                : "text-white"
            }`}
            style={supabaseEnabled ? {} : { backgroundColor: "var(--color-primary)" }}
          >
            <Rocket size={18} />
            ゲストで試す
          </button>
          <p className="text-xs text-text-sub">
            ※ ゲストモードはブラウザにデータを保存します
          </p>
        </motion.div>
      </section>

      <section className="max-w-lg mx-auto px-4 pb-12">
        <div className="space-y-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  backgroundColor: "var(--color-primary)",
                  opacity: 0.15,
                }}
              >
                <f.icon size={20} style={{ color: "var(--color-primary)" }} />
              </div>
              <div>
                <h3 className="font-bold text-sm">{f.title}</h3>
                <p className="text-xs text-text-sub">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="max-w-lg mx-auto px-4 pb-16">
        <h2 className="text-center font-bold text-sm text-text-sub mb-4">
          6つのフェーズでX運用をマスター
        </h2>
        <div className="space-y-2">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.6 + i * 0.08 }}
            >
              <span className="text-xl">{phase.icon}</span>
              <div className="flex-1">
                <h3 className="text-xs font-bold">
                  Phase {phase.id}: {phase.title}
                </h3>
                <p className="text-xs text-text-sub">
                  {phase.tasks.length}タスク
                </p>
              </div>
              <ChevronRight size={16} className="text-locked" />
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
