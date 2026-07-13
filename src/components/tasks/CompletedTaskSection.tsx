"use client";

import { useState, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { toggleTaskComplete, deleteTask } from "@/actions/tasks";
import { Check, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import type { Task } from "./types";

interface Props {
  tasks: Task[];
}

export function CompletedTaskSection({ tasks }: Props) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const [optimisticTasks, setOptimistic] = useOptimistic(
    tasks,
    (state, toggledId: string) =>
      state.map((t) =>
        t.id === toggledId
          ? { ...t, status: "pending" as const }
          : t
      )
  );

  if (optimisticTasks.length === 0) return null;

  async function handleToggle(taskId: string) {
    setOptimistic(taskId);
    await toggleTaskComplete(taskId);
  }

  async function handleDelete(taskId: string) {
    await deleteTask(taskId);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-400 uppercase tracking-wide hover:text-gray-600"
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        今日完成 ({optimisticTasks.length})
      </button>

      {expanded && (
        <div className="space-y-1">
          {optimisticTasks.map((task) => (
            <div
              key={task.id}
              className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-gray-400"
            >
              <button
                onClick={() => handleToggle(task.id)}
                className="flex h-5 w-5 items-center justify-center rounded border border-gray-300 bg-gray-100"
              >
                <Check size={12} strokeWidth={3} className="text-gray-400" />
              </button>
              <span className="flex-1 line-through">{task.title}</span>
              <button
                onClick={() => handleDelete(task.id)}
                className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
