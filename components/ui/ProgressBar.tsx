"use client";

import { motion } from "framer-motion";

interface ProgressBarProps {
  value: number; // 0〜1
  color?: string;
  height?: number;
  showLabel?: boolean;
}

export default function ProgressBar({
  value,
  color = "var(--color-primary)",
  height = 12,
  showLabel = false,
}: ProgressBarProps) {
  const clamped = Math.max(0, Math.min(1, value));

  return (
    <div className="w-full relative">
      <div
        className="w-full rounded-full overflow-hidden"
        style={{ height, backgroundColor: "var(--color-border)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${clamped * 100}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>
      {showLabel && (
        <span className="text-xs text-text-sub mt-1 block text-right">
          {Math.round(clamped * 100)}%
        </span>
      )}
    </div>
  );
}
