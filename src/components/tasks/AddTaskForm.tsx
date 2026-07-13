"use client";

import { useState, useRef } from "react";
import { Plus } from "lucide-react";
import { createTask } from "@/actions/tasks";

interface Props {
  taskType: "daily" | "near_term";
}

export function AddTaskForm({ taskType }: Props) {
  const [title, setTitle] = useState("");
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || loading) return;

    setLoading(true);
    const formData = new FormData();
    formData.set("title", title.trim());
    formData.set("taskType", taskType);
    await createTask(formData);
    setTitle("");
    setLoading(false);
    inputRef.current?.focus();
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 pt-1">
      <div className="flex h-5 w-5 items-center justify-center text-gray-300">
        <Plus size={16} />
      </div>
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="添加任务..."
        className="flex-1 bg-transparent py-2 text-sm text-gray-600 placeholder:text-gray-400 outline-none"
      />
    </form>
  );
}
