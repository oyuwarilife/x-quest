"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { getStreakColor, getStreakScale } from "@/lib/streak";

interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  const color = getStreakColor(streak);
  const scale = getStreakScale(streak);

  if (streak === 0) {
    return (
      <div className="flex items-center gap-1.5 text-locked">
        <Flame size={20} />
        <span className="text-sm">ストリーク: 0日</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5">
      <motion.div
        animate={{
          scale: [scale, scale * 1.15, scale],
          rotate: [-3, 3, -3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Flame size={20} style={{ color }} fill={color} />
      </motion.div>
      <span className="text-sm font-bold" style={{ color }}>
        {streak}日連続
      </span>
    </div>
  );
}
