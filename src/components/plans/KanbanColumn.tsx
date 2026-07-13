"use client";

import { useState } from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanCard } from "./KanbanCard";
import { Plus, Trash2 } from "lucide-react";

interface Column {
  id: string;
  title: string;
}

interface Card {
  id: string;
  columnId: string;
  title: string;
  description: string | null;
  sortOrder: number;
  completed: boolean;
  color: string | null;
}

interface Props {
  column: Column;
  cards: Card[];
  onAddCard: (columnId: string, title: string) => void;
  onToggleCard: (cardId: string) => void;
  onDeleteCard: (cardId: string) => void;
  onDeleteColumn: (columnId: string) => void;
}

export function KanbanColumn({
  column,
  cards,
  onAddCard,
  onToggleCard,
  onDeleteCard,
  onDeleteColumn,
}: Props) {
  const [newTitle, setNewTitle] = useState("");
  const { setNodeRef, isOver } = useDroppable({ id: column.id });

  const completedCount = cards.filter((c) => c.completed).length;

  function handleAdd() {
    if (!newTitle.trim()) return;
    onAddCard(column.id, newTitle.trim());
    setNewTitle("");
  }

  return (
    <div className="flex-shrink-0 w-64">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h3 className="text-sm font-medium">{column.title}</h3>
          <p className="text-xs text-gray-400">
            {completedCount}/{cards.length}
          </p>
        </div>
        <button
          onClick={() => onDeleteColumn(column.id)}
          className="text-gray-400 hover:text-red-500"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div
        ref={setNodeRef}
        className={`rounded-lg border min-h-[100px] p-2 space-y-2 transition-colors ${
          isOver ? "border-blue-400 bg-blue-50" : "border-gray-200 bg-gray-50"
        }`}
      >
        <SortableContext
          items={cards.map((c) => c.id)}
          strategy={verticalListSortingStrategy}
        >
          {cards.map((card) => (
            <KanbanCard
              key={card.id}
              card={card}
              onToggle={onToggleCard}
              onDelete={onDeleteCard}
            />
          ))}
        </SortableContext>

        <div className="flex items-center gap-1 pt-1">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="添加卡片..."
            className="flex-1 bg-white rounded border border-gray-200 px-2 py-1.5 text-xs outline-none focus:border-gray-400"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleAdd();
            }}
          />
          <button
            onClick={handleAdd}
            disabled={!newTitle.trim()}
            className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
