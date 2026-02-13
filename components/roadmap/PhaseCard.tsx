"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lock } from "lucide-react";
import type { Phase } from "@/types";
import TaskCheckbox from "./TaskCheckbox";
import ProgressBar from "@/components/ui/ProgressBar";

interface PhaseCardProps {
  phase: Phase;
  completedTaskIds: Set<string>;
  isUnlocked: boolean;
  onToggleTask: (taskId: string, phase: number) => void;
}

export default function PhaseCard({
  phase,
  completedTaskIds,
  isUnlocked,
  onToggleTask,
}: PhaseCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const completedCount = phase.tasks.filter((t) =>
    completedTaskIds.has(t.id)
  ).length;
  const totalCount = phase.tasks.length;
  const isComplete = completedCount === totalCount;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <div
      className={`rounded-2xl border-2 overflow-hidden transition-colors ${
        !isUnlocked
          ? "border-locked/30 bg-locked/5"
          : isComplete
          ? "border-secondary/40 bg-secondary/5"
          : "border-border bg-surface"
      }`}
    >
      <button
        onClick={() => isUnlocked && setIsOpen(!isOpen)}
        disabled={!isUnlocked}
        className={`w-full flex items-center gap-3 p-4 text-left ${
          isUnlocked ? "cursor-pointer" : "cursor-not-allowed"
        }`}
      >
        <span className="text-2xl">{isUnlocked ? phase.icon : "🔒"}</span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={`font-bold text-sm ${
                !isUnlocked ? "text-locked" : ""
              }`}
            >
              Phase {phase.id}: {phase.title}
            </h3>
            {isComplete && (
              <span className="text-xs bg-secondary text-white px-2 py-0.5 rounded-full">
                完了
              </span>
            )}
          </div>
          {isUnlocked ? (
            <div className="mt-1.5">
              <ProgressBar
                value={progress}
                color={
                  isComplete
                    ? "var(--color-secondary)"
                    : "var(--color-primary)"
                }
                height={6}
              />
              <span className="text-xs text-text-sub mt-1 block">
                {completedCount}/{totalCount} タスク完了
              </span>
            </div>
          ) : (
            <p className="text-xs text-locked mt-0.5">
              Lv.{phase.requiredLevel} で解放
            </p>
          )}
        </div>

        {isUnlocked ? (
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronDown size={20} className="text-text-sub" />
          </motion.div>
        ) : (
          <Lock size={18} className="text-locked" />
        )}
      </button>

      <AnimatePresence>
        {isOpen && isUnlocked && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-1.5">
              <p className="text-xs text-text-sub mb-2 pl-1">
                {phase.description}
              </p>
              {phase.tasks.map((task) => (
                <TaskCheckbox
                  key={task.id}
                  task={task}
                  completed={completedTaskIds.has(task.id)}
                  disabled={false}
                  onToggle={(id) => onToggleTask(id, phase.id)}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
