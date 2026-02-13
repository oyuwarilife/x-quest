"use client";

import { getLevelTitle } from "@/lib/xp";

interface LevelBadgeProps {
  level: number;
  size?: "sm" | "md" | "lg";
}

export default function LevelBadge({ level, size = "md" }: LevelBadgeProps) {
  const title = getLevelTitle(level);

  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold text-white ${sizeClasses[size]}`}
      style={{ backgroundColor: title.color }}
    >
      <span>Lv.{level}</span>
      <span className="opacity-90">{title.title}</span>
    </span>
  );
}
