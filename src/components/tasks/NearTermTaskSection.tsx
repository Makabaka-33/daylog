"use client";

import { useState, useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { TaskItem } from "./TaskItem";
import { AddTaskForm } from "./AddTaskForm";
import { DateRangeSelector } from "./DateRangeSelector";
import { toggleTaskComplete, deleteTask, convertToDaily } from "@/actions/tasks";
import { ArrowDown } from "lucide-react";
import type { Task } from "./types";

interface Props {
  tasks: Task[];
}

export function NearTermTaskSection({ tasks }: Props) {
  const router = useRouter();
  const [range, setRange] = useState("1w");
  const [optimisticTasks, setOptimistic] = useOptimistic(
    tasks,
    (state, toggledId: string) =>
      state.map((t) =>
        t.id === toggledId
          ? { ...t, status: t.status === "completed" ? "pending" as const : "completed" as const }
          : t
      )
  );

  const filteredTasks = optimisticTasks.filter((t) => {
    if (!t.dueDate) return true;
    const now = new Date();
    const due = new Date(t.dueDate);
    const diffDays = (due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24);

    switch (range) {
      case "3d": return diffDays <= 3;
      case "1w": return diffDays <= 7;
      case "2w": return diffDays <= 14;
      case "1m": return diffDays <= 30;
      default: return true;
    }
  });

  async function handleToggle(taskId: string) {
    setOptimistic(taskId);
    await toggleTaskComplete(taskId);
  }

  async function handleDelete(taskId: string) {
    await deleteTask(taskId);
    router.refresh();
  }

  async function handleConvert(taskId: string) {
    await convertToDaily(taskId);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          近期任务
        </h2>
        <DateRangeSelector value={range} onChange={setRange} />
      </div>

      <div className="space-y-1">
        {filteredTasks.map((task) => (
          <div key={task.id} className="group flex items-center gap-2">
            <div className="flex-1">
              <TaskItem
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            </div>
            <button
              onClick={() => handleConvert(task.id)}
              className="shrink-0 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-blue-500 transition-all"
              title="转为今日任务"
            >
              <ArrowDown size={14} />
            </button>
          </div>
        ))}
      </div>

      {filteredTasks.length === 0 && (
        <p className="text-sm text-gray-400 py-2">暂无近期任务</p>
      )}

      <AddTaskForm taskType="near_term" />
    </div>
  );
}
