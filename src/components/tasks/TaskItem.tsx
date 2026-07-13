"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/Checkbox";
import { cn } from "@/lib/utils";
import type { Task } from "./types";

interface Props {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TaskItem({ task, onToggle, onDelete }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors hover:bg-gray-50",
        isDragging && "bg-white shadow-lg ring-1 ring-gray-200 z-10",
        task.status === "completed" && "text-gray-400"
      )}
    >
      <button
        className="text-gray-300 hover:text-gray-500 cursor-grab touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={16} />
      </button>
      <Checkbox
        checked={task.status === "completed"}
        onChange={() => onToggle(task.id)}
      />
      <span
        className={cn(
          "flex-1",
          task.status === "completed" && "line-through text-gray-400"
        )}
      >
        {task.title}
      </span>
      {task.dueDate && (
        <span className="text-xs text-gray-400">
          {task.dueDate}
        </span>
      )}
      <button
        onClick={() => onDelete(task.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all"
      >
        <Trash2 size={14} />
      </button>
    </div>
  );
}
