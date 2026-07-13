"use client";

import { useState } from "react";
import { toggleTaskComplete, deleteTask } from "@/actions/tasks";
import { Check, ChevronDown, ChevronRight, Trash2 } from "lucide-react";
import type { Task } from "./types";

interface Props {
  tasks: Task[];
}

export function CompletedTaskSection({ tasks: initialTasks }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [taskList, setTaskList] = useState(initialTasks);

  if (taskList.length === 0) return null;

  async function handleToggle(taskId: string) {
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? { ...t, status: "pending" as const }
          : t
      )
    );
    await toggleTaskComplete(taskId);
  }

  async function handleDelete(taskId: string) {
    setTaskList((prev) => prev.filter((t) => t.id !== taskId));
    await deleteTask(taskId);
  }

  return (
    <div className="space-y-3">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1.5 text-sm font-medium text-gray-400 uppercase tracking-wide hover:text-gray-600"
      >
        {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        今日完成 ({taskList.length})
      </button>

      {expanded && (
        <div className="space-y-1">
          {taskList.map((task) => (
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
