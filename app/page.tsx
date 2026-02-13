"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import {
  Rocket,
  Swords,
  Flame,
  Crown,
  ChevronRight,
  LogIn,
  Scroll,
  ExternalLink,
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
      displayName: "冒険者",
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
      icon: Swords,
      title: "6つのステージ",
      desc: "段階的にクエストを攻略して成長しよう",
    },
    {
      icon: Flame,
      title: "連続冒険ボーナス",
      desc: "毎日の継続で冒険者ランクが上がる",
    },
    {
      icon: Crown,
      title: "冒険者ランク",
      desc: "クエスト達成でXPを獲得してランクアップ",
    },
  ];

  const stageNames = [
    "調査と戦略",
    "プロフィール構築",
    "発信と信頼",
    "関係構築",
    "導線設計",
    "案件獲得",
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* ヒーローセクション */}
      <section className="max-w-lg mx-auto px-4 pt-16 pb-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-5xl mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            &#x2694;&#xFE0F;
          </motion.div>
          <h1 className="text-4xl font-black mb-3">
            <span style={{ color: "var(--color-x-blue)" }}>X</span>{" "}
            <span style={{ color: "var(--color-primary)" }}>Quest</span>
          </h1>
          <p className="text-lg font-bold text-text mb-2">
            X運用マスターへの冒険
          </p>
          <p className="text-sm text-text-sub leading-relaxed">
            案件獲得という名のラスボスを倒すために、
            <br />
            6つのステージをクリアしよう。
            <br />
            <span className="font-medium text-text">
              クエスト達成でXPを獲得し、冒険者ランクを上げていけ。
            </span>
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
              Googleでログインして冒険を始める
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
            冒険を始める
          </button>
          <p className="text-xs text-text-sub">
            ※ ゲストモード：ブラウザにデータを保存します
          </p>
        </motion.div>
      </section>

      {/* 冒険者の装備（Notionシート） */}
      <section className="max-w-lg mx-auto px-4 pb-10">
        <motion.a
          href="https://oyuwari.notion.site/X-Quest-Notion-306206dfc7ee80349025f5d5e460ec98"
          target="_blank"
          rel="noopener noreferrer"
          className="block p-4 rounded-2xl border-2 border-accent/40 bg-accent/10 hover:bg-accent/15 transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <Scroll size={20} style={{ color: "var(--color-accent)" }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-sm flex items-center gap-1">
                冒険者の装備を受け取る
                <ExternalLink size={12} className="text-text-sub" />
              </h3>
              <p className="text-xs text-text-sub mt-0.5">
                分析シート・テンプレート集など9種のNotionワークシート
              </p>
            </div>
          </div>
        </motion.a>
      </section>

      {/* 特徴 */}
      <section className="max-w-lg mx-auto px-4 pb-10">
        <div className="space-y-3">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-border"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.1 }}
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

      {/* ステージ一覧 */}
      <section className="max-w-lg mx-auto px-4 pb-16">
        <h2 className="text-center font-bold text-sm text-text-sub mb-4">
          6つのステージで案件獲得を目指す冒険
        </h2>
        <div className="space-y-2">
          {PHASES.map((phase, i) => (
            <motion.div
              key={phase.id}
              className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-border"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.7 + i * 0.08 }}
            >
              <span className="text-xl">{phase.icon}</span>
              <div className="flex-1">
                <h3 className="text-xs font-bold">
                  Stage {phase.id}: {phase.title}
                </h3>
                <p className="text-xs text-text-sub">
                  {phase.tasks.length}クエスト
                </p>
              </div>
              <ChevronRight size={16} className="text-locked" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* フッター */}
      <footer className="border-t border-border bg-surface">
        <div className="max-w-lg mx-auto px-4 py-6 text-center space-y-2">
          <p className="font-black text-sm text-primary">X Quest</p>
          <p className="text-xs text-text-sub">
            X運用スキルをRPG感覚で習得する無料ツール
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-text-sub">
            <a
              href="https://x.com/oyuwarilife"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              運営者のX
            </a>
            <span className="text-border">|</span>
            <a
              href="https://oyuwari.notion.site/X-Quest-Notion-306206dfc7ee80349025f5d5e460ec98"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary transition-colors"
            >
              Notionワークシート
            </a>
          </div>
          <p className="text-[10px] text-locked mt-2">
            &copy; {new Date().getFullYear()} oyuwari life
          </p>
        </div>
      </footer>
    </div>
  );
}
