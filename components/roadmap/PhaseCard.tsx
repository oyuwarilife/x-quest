"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Lock, Lightbulb, ExternalLink, Scroll } from "lucide-react";
import type { Phase } from "@/types";
import TaskCheckbox from "./TaskCheckbox";
import ProgressBar from "@/components/ui/ProgressBar";

interface PhaseCardProps {
  phase: Phase;
  completedTaskIds: Set<string>;
  isUnlocked: boolean;
  isCurrentPhase?: boolean;
  isJustUnlocked?: boolean;
  onToggleTask: (taskId: string, phase: number) => void;
}

export default function PhaseCard({
  phase,
  completedTaskIds,
  isUnlocked,
  isCurrentPhase = false,
  isJustUnlocked = false,
  onToggleTask,
}: PhaseCardProps) {
  const [isOpen, setIsOpen] = useState(isCurrentPhase);
  const completedCount = phase.tasks.filter((t) =>
    completedTaskIds.has(t.id)
  ).length;
  const totalCount = phase.tasks.length;
  const isComplete = completedCount === totalCount;
  const progress = totalCount > 0 ? completedCount / totalCount : 0;

  return (
    <motion.div
      className={`rounded-2xl border-2 overflow-hidden transition-colors ${
        !isUnlocked
          ? "border-locked/30 bg-locked/5"
          : isComplete
          ? "border-secondary/40 bg-secondary/5"
          : isJustUnlocked
          ? "border-secondary/60 bg-secondary/10"
          : "border-border bg-surface"
      }`}
      {...(isJustUnlocked
        ? {
            animate: {
              boxShadow: [
                "0 0 0px rgba(0,184,148,0)",
                "0 0 20px rgba(0,184,148,0.4)",
                "0 0 0px rgba(0,184,148,0)",
              ],
            },
            transition: { duration: 2, repeat: 2 },
          }
        : {})}
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
              Stage {phase.id}: {phase.title}
            </h3>
            {isComplete ? (
              <span className="text-xs bg-secondary text-white px-2 py-0.5 rounded-full">
                CLEAR
              </span>
            ) : isJustUnlocked ? (
              <motion.span
                className="text-xs bg-secondary text-white px-2 py-0.5 rounded-full"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.6, repeat: 3 }}
              >
                NEW
              </motion.span>
            ) : isCurrentPhase ? (
              <span className="text-xs bg-primary text-white px-2 py-0.5 rounded-full animate-pulse">
                進行中
              </span>
            ) : null}
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
                {completedCount}/{totalCount} クエスト達成
              </span>
            </div>
          ) : (
            <p className="text-xs text-locked mt-0.5">
              Lv.{phase.requiredLevel} で解放されるステージ
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
              <p className="text-xs text-text-sub mb-1 pl-1">
                {phase.description}
              </p>
              <p className="text-[11px] text-primary/60 mb-2 pl-1">
                ※ 好きな順番で達成OK！スキップして後から戻れます
              </p>
              {phase.tasks.map((task) => {
                const firstUncompletedId = phase.tasks.find(
                  (t) => !completedTaskIds.has(t.id)
                )?.id;
                return (
                  <TaskCheckbox
                    key={task.id}
                    task={task}
                    completed={completedTaskIds.has(task.id)}
                    disabled={false}
                    isRecommended={isCurrentPhase && task.id === firstUncompletedId}
                    onToggle={(id) => onToggleTask(id, phase.id)}
                  />
                );
              })}

              {/* コツ・アドバイス */}
              {phase.tips && phase.tips.length > 0 && (
                <div className="mt-3 p-3 rounded-xl bg-accent/10 border border-accent/20">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Lightbulb size={14} style={{ color: "var(--color-accent)" }} />
                    <span className="text-xs font-bold" style={{ color: "var(--color-accent)" }}>
                      冒険者のヒント
                    </span>
                  </div>
                  <ul className="space-y-1.5">
                    {phase.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-text-sub leading-relaxed pl-4 relative">
                        <span className="absolute left-0">・</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 補足リソース */}
              {phase.resources && phase.resources.length > 0 && (
                <div className="mt-2 p-3 rounded-xl bg-primary/5 border border-primary/15">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Scroll size={14} className="text-primary" />
                    <span className="text-xs font-bold text-primary">
                      冒険者の装備
                    </span>
                  </div>
                  <div className="space-y-1">
                    {phase.resources.map((resource, i) => (
                      <a
                        key={i}
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-xs text-primary hover:underline"
                      >
                        <ExternalLink size={12} />
                        {resource.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
