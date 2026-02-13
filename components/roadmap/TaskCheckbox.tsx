"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import type { Task } from "@/types";

interface TaskCheckboxProps {
  task: Task;
  completed: boolean;
  disabled: boolean;
  onToggle: (taskId: string) => void;
}

export default function TaskCheckbox({
  task,
  completed,
  disabled,
  onToggle,
}: TaskCheckboxProps) {
  return (
    <button
      onClick={() => !disabled && onToggle(task.id)}
      disabled={disabled}
      className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all ${
        disabled
          ? "opacity-40 cursor-not-allowed"
          : completed
          ? "bg-secondary/10"
          : "bg-surface hover:bg-primary/5 active:scale-[0.98]"
      }`}
    >
      <motion.div
        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center shrink-0 ${
          completed
            ? "border-secondary bg-secondary"
            : disabled
            ? "border-locked"
            : "border-border"
        }`}
        animate={completed ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.3 }}
      >
        {completed && <Check size={14} className="text-white" strokeWidth={3} />}
      </motion.div>

      <span
        className={`text-sm flex-1 ${
          completed ? "line-through text-text-sub" : disabled ? "text-locked" : ""
        }`}
      >
        {task.label}
      </span>

      <span
        className={`text-xs font-bold shrink-0 ${
          completed ? "text-secondary" : disabled ? "text-locked" : "text-primary"
        }`}
      >
        +{task.xp}XP
      </span>
    </button>
  );
}
