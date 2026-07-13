"use client";

import { useOptimistic, useState } from "react";
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

export function DailyTaskSection({ tasks: initialTasks }: Props) {
  const [taskList, setTaskList] = useState(initialTasks);
  const [optimisticTasks, setOptimistic] = useOptimistic(
    taskList,
    (state, toggledId: string) =>
      state.map((t) =>
        t.id === toggledId
          ? { ...t, status: t.status === "completed" ? "pending" : "completed" as const }
          : t
      )
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  async function handleToggle(taskId: string) {
    setOptimistic(taskId);
    await toggleTaskComplete(taskId);
    setTaskList((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              status:
                t.status === "completed"
                  ? ("pending" as const)
                  : ("completed" as const),
            }
          : t
      )
    );
  }

  async function handleDelete(taskId: string) {
    setTaskList((prev) => prev.filter((t) => t.id !== taskId));
    await deleteTask(taskId);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = taskList.findIndex((t) => t.id === active.id);
    const newIndex = taskList.findIndex((t) => t.id === over.id);

    const reordered = arrayMove(taskList, oldIndex, newIndex);
    setTaskList(reordered);
    await reorderTasks(reordered.map((t) => t.id));
  }

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
          items={optimisticTasks.filter((t) => t.status === "pending").map((t) => t.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-1">
            {optimisticTasks
              .filter((t) => t.status === "pending")
              .map((task) => (
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
