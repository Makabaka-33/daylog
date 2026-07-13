"use client";

import { useState } from "react";
import { createExpense } from "@/actions/expenses";
import { expenseCategories } from "@/lib/constants";
import { today } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Plus } from "lucide-react";

export function AddExpenseForm() {
  const [open, setOpen] = useState(false);
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("lunch");
  const [date, setDate] = useState(today());
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!amount || loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("amount", amount);
    formData.set("category", category);
    formData.set("date", date);
    formData.set("note", note);
    await createExpense(formData);

    setAmount("");
    setNote("");
    setLoading(false);
    setOpen(false);
  }

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus size={14} className="mr-1" />
        记录花费
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="记录花费">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              金额 (元)
            </label>
            <input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="0.00"
              required
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              类别
            </label>
            <div className="flex flex-wrap gap-2">
              {expenseCategories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setCategory(cat.value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                    category === cat.value
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              日期
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              备注
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              placeholder="可选"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "保存中..." : "保存"}
          </Button>
        </form>
      </Modal>
    </>
  );
}
