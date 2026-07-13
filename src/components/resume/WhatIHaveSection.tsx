"use client";

import { useState } from "react";
import { createResumeItem, deleteResumeItem } from "@/actions/resume";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Trash2, GraduationCap } from "lucide-react";

interface Item {
  id: string;
  category: string;
  title: string;
  description: string | null;
  level: string | null;
}

interface Props {
  items: Item[];
}

const categoryLabels: Record<string, string> = {
  skill: "技能",
  experience: "经验",
  education: "学历",
  certification: "证书",
  language: "语言",
};

export function WhatIHaveSection({ items: initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const [showAdd, setShowAdd] = useState(false);

  async function handleDelete(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
    await deleteResumeItem(id);
  }

  const grouped = items.reduce<Record<string, Item[]>>((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          我拥有
        </h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} className="mr-1" />
          添加
        </Button>
      </div>

      {Object.keys(grouped).length === 0 ? (
        <EmptyState
          title="未填写"
          description="添加你的技能、经验和学历"
          icon={<GraduationCap size={32} />}
        />
      ) : (
        <div className="space-y-4">
          {Object.entries(grouped).map(([category, catItems]) => (
            <div key={category}>
              <h3 className="text-xs font-medium text-gray-400 mb-2 uppercase">
                {categoryLabels[category] || category}
              </h3>
              <div className="space-y-2">
                {catItems.map((item) => (
                  <div
                    key={item.id}
                    className="group flex items-center gap-3 rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <p className="font-medium">{item.title}</p>
                      {item.description && (
                        <p className="text-xs text-gray-400 mt-0.5">
                          {item.description}
                        </p>
                      )}
                    </div>
                    {item.level && (
                      <span className="text-xs text-gray-500 bg-gray-100 rounded px-2 py-0.5">
                        {item.level}
                      </span>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <AddItemModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={(item) => {
          setItems((prev) => [...prev, item]);
          setShowAdd(false);
        }}
      />
    </div>
  );
}

function AddItemModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (item: Item) => void;
}) {
  const [category, setCategory] = useState("skill");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [level, setLevel] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("category", category);
    formData.set("title", title);
    formData.set("description", description);
    formData.set("level", level);
    await createResumeItem(formData);

    onCreated({
      id: crypto.randomUUID(),
      category,
      title,
      description: description || null,
      level: level || null,
    });
    setLoading(false);
  }

  return (
    <Modal open={open} onClose={onClose} title="添加条目">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            类别
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryLabels).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => setCategory(k)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  category === k
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            名称
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="React / 项目管理 / 本科"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            等级/时长
          </label>
          <input
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="精通 / 3年 / CET-6"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            rows={2}
            placeholder="可选"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "保存中..." : "保存"}
        </Button>
      </form>
    </Modal>
  );
}
