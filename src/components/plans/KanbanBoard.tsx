"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  DragOverlay,
  closestCorners,
  useSensor,
  useSensors,
  PointerSensor,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import { KanbanColumn } from "./KanbanColumn";
import { KanbanCard } from "./KanbanCard";
import { createColumn, createCard, toggleCardComplete, deleteCard, removeColumn } from "@/actions/plans";
import { Plus } from "lucide-react";

interface Plan {
  id: string;
  title: string;
}

interface Column {
  id: string;
  planId: string;
  title: string;
  sortOrder: number;
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
  plan: Plan;
  columns: Column[];
  cards: Card[];
}

export function KanbanBoard({ plan, columns: initialColumns, cards: initialCards }: Props) {
  const router = useRouter();
  const [columns, setColumns] = useState(initialColumns);
  const [cards, setCards] = useState(initialCards);
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const [newColTitle, setNewColTitle] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  function handleDragStart(event: DragStartEvent) {
    const card = cards.find((c) => c.id === event.active.id);
    if (card) setActiveCard(card);
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    setActiveCard(null);
    if (!over) return;

    const cardId = active.id as string;
    const card = cards.find((c) => c.id === cardId);
    if (!card) return;

    const overCard = cards.find((c) => c.id === over.id);
    const overColumn = columns.find((c) => c.id === over.id);

    let targetColumnId: string;
    if (overCard) {
      targetColumnId = overCard.columnId;
    } else if (overColumn) {
      targetColumnId = overColumn.id;
    } else {
      return;
    }

    if (card.columnId === targetColumnId) return;

    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, columnId: targetColumnId } : c))
    );
    router.refresh();
  }

  async function handleAddColumn() {
    if (!newColTitle.trim()) return;
    const id = crypto.randomUUID();
    setColumns((prev) => [...prev, { id, planId: plan.id, title: newColTitle.trim(), sortOrder: prev.length }]);
    await createColumn(plan.id, newColTitle.trim());
    setNewColTitle("");
    router.refresh();
  }

  async function handleAddCard(columnId: string, title: string) {
    const id = crypto.randomUUID();
    setCards((prev) => [
      ...prev,
      { id, columnId, title, description: null, sortOrder: prev.length, completed: false, color: null },
    ]);
    await createCard(columnId, title);
    router.refresh();
  }

  async function handleToggleCard(cardId: string) {
    setCards((prev) =>
      prev.map((c) => (c.id === cardId ? { ...c, completed: !c.completed } : c))
    );
    await toggleCardComplete(cardId);
  }

  async function handleDeleteCard(cardId: string) {
    setCards((prev) => prev.filter((c) => c.id !== cardId));
    await deleteCard(cardId);
    router.refresh();
  }

  async function handleDeleteColumn(columnId: string) {
    setColumns((prev) => prev.filter((c) => c.id !== columnId));
    setCards((prev) => prev.filter((c) => c.columnId !== columnId));
    await removeColumn(columnId);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              cards={cards.filter((c) => c.columnId === column.id)}
              onAddCard={handleAddCard}
              onToggleCard={handleToggleCard}
              onDeleteCard={handleDeleteCard}
              onDeleteColumn={handleDeleteColumn}
            />
          ))}

          <div className="flex-shrink-0 w-64">
            <div className="flex items-center gap-2 rounded-lg border border-dashed border-gray-300 p-3">
              <input
                type="text"
                value={newColTitle}
                onChange={(e) => setNewColTitle(e.target.value)}
                placeholder="添加列..."
                className="flex-1 bg-transparent text-sm outline-none placeholder:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleAddColumn();
                }}
              />
              <button
                onClick={handleAddColumn}
                disabled={!newColTitle.trim()}
                className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
              >
                <Plus size={16} />
              </button>
            </div>
          </div>
        </div>

        <DragOverlay>
          {activeCard && (
            <div className="rotate-2 opacity-90">
              <KanbanCard
                card={activeCard}
                onToggle={() => {}}
                onDelete={() => {}}
                isDragOverlay
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
