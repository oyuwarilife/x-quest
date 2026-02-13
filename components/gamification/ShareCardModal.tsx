"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Download, X as XIcon, Share2 } from "lucide-react";
import { useGameStore } from "@/stores/gameStore";
import { getLevelTitle } from "@/lib/xp";
import { PHASES } from "@/lib/roadmap-data";

export default function ShareCardModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const profile = useGameStore((s) => s.profile);
  const completedTaskIds = useGameStore((s) => s.completedTaskIds);
  const [downloading, setDownloading] = useState(false);

  if (!profile) return null;

  const titleInfo = getLevelTitle(profile.currentLevel);
  const totalTasks = PHASES.reduce((sum, p) => sum + p.tasks.length, 0);
  const completedTotal = completedTaskIds.size;

  const cardUrl = `/api/share-card?level=${profile.currentLevel}&title=${encodeURIComponent(titleInfo.title)}&color=${encodeURIComponent(titleInfo.color)}&completed=${completedTotal}&total=${totalTasks}&streak=${profile.currentStreak}&name=${encodeURIComponent(profile.displayName)}`;

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch(cardUrl);
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `x-quest-lv${profile.currentLevel}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } finally {
      setDownloading(false);
    }
  };

  const handleShareX = () => {
    const text = `【X Quest】Lv.${profile.currentLevel}「${titleInfo.title}」\n${completedTotal}/${totalTasks}クエスト達成中！⚔️\n\nX運用マスターへの冒険、一緒にやろう👇\n@oyuwari_life`;
    window.open(
      `https://x.com/intent/tweet?text=${encodeURIComponent(text)}`,
      "_blank"
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-surface rounded-2xl mx-4 shadow-2xl max-w-sm w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* プレビュー */}
            <div className="relative">
              <img
                src={cardUrl}
                alt="シェアカード"
                className="w-full aspect-[1200/630] object-cover"
              />
              <button
                onClick={onClose}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white"
              >
                <XIcon size={16} />
              </button>
            </div>

            {/* ボタン */}
            <div className="p-4 space-y-2">
              <button
                onClick={handleDownload}
                disabled={downloading}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm text-white transition-transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <Download size={16} />
                {downloading ? "ダウンロード中..." : "画像を保存"}
              </button>
              <button
                onClick={handleShareX}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-transform hover:scale-[1.02] active:scale-[0.98] border-2 border-border text-text-sub"
              >
                <Share2 size={16} />
                Xでシェア
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
