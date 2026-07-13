"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGoal, deleteGoal } from "@/actions/money";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Target, Trash2 } from "lucide-react";

interface Goal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string | null;
}

interface Props {
  goals: Goal[];
}

export function SavingsGoalsSection({ goals }: Props) {
  const router = useRouter();
  const [showAdd, setShowAdd] = useState(false);

  async function handleDelete(id: string) {
    await deleteGoal(id);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          攒钱目标
        </h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} className="mr-1" />
          添加目标
        </Button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          title="暂无目标"
          description="设定攒钱目标，追踪进度"
          icon={<Target size={32} />}
        />
      ) : (
        <div className="space-y-3">
          {goals.map((goal) => {
            const pct = Math.round((goal.currentAmount / goal.targetAmount) * 100);
            return (
              <Card key={goal.id} className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium">{goal.title}</p>
                    {goal.deadline && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        截止: {goal.deadline}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(goal.id)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <ProgressBar value={pct} className="mb-2" />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{formatCurrency(goal.currentAmount)}</span>
                  <span>{pct}%</span>
                  <span>{formatCurrency(goal.targetAmount)}</span>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AddGoalModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={() => {
          setShowAdd(false);
          router.refresh();
        }}
      />
    </div>
  );
}

function AddGoalModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [deadline, setDeadline] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !targetAmount || loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("targetAmount", targetAmount);
    formData.set("currentAmount", currentAmount || "0");
    formData.set("deadline", deadline);
    await createGoal(formData);

    setLoading(false);
    setTitle("");
    setTargetAmount("");
    setCurrentAmount("");
    setDeadline("");
    onCreated();
  }

  return (
    <Modal open={open} onClose={onClose} title="添加攒钱目标">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            目标名称
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="买房首付 / 旅行基金"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            目标金额 (元)
          </label>
          <input
            type="number"
            step="0.01"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="0.00"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            当前金额 (元)
          </label>
          <input
            type="number"
            step="0.01"
            value={currentAmount}
            onChange={(e) => setCurrentAmount(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="0.00"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            截止日期
          </label>
          <input
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "保存中..." : "保存"}
        </Button>
      </form>
    </Modal>
  );
}
