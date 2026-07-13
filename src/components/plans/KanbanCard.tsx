"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/Checkbox";
import { GripVertical, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface Card {
  id: string;
  title: string;
  completed: boolean;
  color: string | null;
}

interface Props {
  card: Card;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  isDragOverlay?: boolean;
}

export function KanbanCard({ card, onToggle, onDelete, isDragOverlay }: Props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms ease",
  };

  return (
    <div
      ref={setNodeRef}
      style={isDragOverlay ? undefined : style}
      className={cn(
        "group flex items-center gap-2 rounded-lg bg-white border p-2.5 shadow-sm",
        isDragging && "opacity-50",
        isDragOverlay && "shadow-lg"
      )}
    >
      <button
        className="text-gray-300 hover:text-gray-500 cursor-grab touch-none"
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} />
      </button>
      <Checkbox
        checked={card.completed}
        onChange={() => onToggle(card.id)}
      />
      <span
        className={cn(
          "flex-1 text-sm",
          card.completed && "line-through text-gray-400"
        )}
      >
        {card.title}
      </span>
      {card.color && (
        <div
          className="h-3 w-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: card.color }}
        />
      )}
      <button
        onClick={() => onDelete(card.id)}
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
      >
        <Trash2 size={12} />
      </button>
    </div>
  );
}
