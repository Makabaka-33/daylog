"use client";

import { useState } from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { Plus, Kanban, ChevronRight } from "lucide-react";
import { createPlan } from "@/actions/plans";

interface Plan {
  id: string;
  title: string;
  description: string | null;
  period: string;
  startDate: string;
  endDate: string;
}

interface Props {
  plans: Plan[];
}

const periodLabels: Record<string, string> = {
  week: "周",
  "10days": "10天",
  month: "月",
  year: "年",
};

export function PlansOverview({ plans: initialPlans }: Props) {
  const [plans, setPlans] = useState(initialPlans);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
          全部计划
        </h2>
        <Button size="sm" onClick={() => setShowAdd(true)}>
          <Plus size={14} className="mr-1" />
          新建计划
        </Button>
      </div>

      {plans.length === 0 ? (
        <EmptyState
          title="暂无计划"
          description="创建你的第一个计划看板"
          icon={<Kanban size={32} />}
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {plans.map((plan) => (
            <Link key={plan.id} href={`/plans/${plan.id}`}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium text-sm">{plan.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      {periodLabels[plan.period] || plan.period} · {plan.startDate} ~ {plan.endDate}
                    </p>
                  </div>
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <AddPlanModal
        open={showAdd}
        onClose={() => setShowAdd(false)}
        onCreated={(plan) => {
          setPlans((prev) => [...prev, plan]);
          setShowAdd(false);
        }}
      />
    </div>
  );
}

function AddPlanModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: (plan: Plan) => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState("week");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !startDate || !endDate || loading) return;
    setLoading(true);

    const formData = new FormData();
    formData.set("title", title);
    formData.set("description", description);
    formData.set("period", period);
    formData.set("startDate", startDate);
    formData.set("endDate", endDate);
    await createPlan(formData);

    onCreated({
      id: crypto.randomUUID(),
      title,
      description: description || null,
      period,
      startDate,
      endDate,
    });
    setLoading(false);
  }

  return (
    <Modal open={open} onClose={onClose} title="新建计划">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            计划名称
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="Q3 学习计划"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            描述
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
            placeholder="可选"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            周期
          </label>
          <div className="flex gap-2">
            {Object.entries(periodLabels).map(([k, v]) => (
              <button
                key={k}
                type="button"
                onClick={() => setPeriod(k)}
                className={`flex-1 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  period === k
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {v}
              </button>
            ))}
          </div>
        </div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              开始
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              结束
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-gray-400"
              required
            />
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "创建中..." : "创建计划"}
        </Button>
      </form>
    </Modal>
  );
}
