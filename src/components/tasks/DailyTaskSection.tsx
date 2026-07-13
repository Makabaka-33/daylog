"use client";

import { useOptimistic } from "react";
import { useRouter } from "next/navigation";
import { TaskItem } from "./TaskItem";
import { AddTaskForm } from "./AddTaskForm";
import { toggleTaskComplete, deleteTask, reorderTasks } from "@/actions/tasks";
import {
  DndContext,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import type { Task } from "./types";

interface Props {
  tasks: Task[];
}

export function DailyTaskSection({ tasks }: Props) {
  const router = useRouter();
  const [optimisticTasks, setOptimistic] = useOptimistic(
    tasks,
    (state, toggledId: string) =>
      state.map((t) =>
        t.id === toggledId
          ? { ...t, status: t.status === "completed" ? "pending" as const : "completed" as const }
          : t
      )
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  async function handleToggle(taskId: string) {
    setOptimistic(taskId);
    await toggleTaskComplete(taskId);
  }

  async function handleDelete(taskId: string) {
    const toggled = optimisticTasks.find((t) => t.id === taskId);
    if (toggled) {
      setOptimistic(taskId); // optimistically toggle to trigger re-render, then refresh
    }
    await deleteTask(taskId);
    router.refresh();
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const pending = optimisticTasks.filter((t) => t.status === "pending");
    const oldIndex = pending.findIndex((t) => t.id === active.id);
    const newIndex = pending.findIndex((t) => t.id === over.id);

    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(pending, oldIndex, newIndex);
    await reorderTasks(reordered.map((t) => t.id));
    router.refresh();
  }

  const pendingTasks = optimisticTasks.filter((t) => t.status === "pending");

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
        待完成
      </h2>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={pendingTasks.map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {pendingTasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onToggle={handleToggle}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <AddTaskForm taskType="daily" />
    </div>
  );
}
