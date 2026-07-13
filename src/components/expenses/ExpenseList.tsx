"use client";

import { useRouter } from "next/navigation";
import { deleteExpense } from "@/actions/expenses";
import { expenseCategories } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { EmptyState } from "@/components/ui/EmptyState";
import { Wallet } from "lucide-react";

interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  note: string | null;
}

interface Props {
  expenses: Expense[];
}

export function ExpenseList({ expenses }: Props) {
  const router = useRouter();

  async function handleDelete(id: string) {
    await deleteExpense(id);
    router.refresh();
  }

  if (expenses.length === 0) {
    return (
      <EmptyState
        title="暂无花费记录"
        description="点击上方按钮添加"
        icon={<Wallet size={32} />}
      />
    );
  }

  const grouped = expenses.reduce<Record<string, Expense[]>>((acc, expense) => {
    if (!acc[expense.date]) acc[expense.date] = [];
    acc[expense.date].push(expense);
    return acc;
  }, {});

  const sortedDates = Object.keys(grouped).sort().reverse();

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-medium text-gray-400 uppercase tracking-wide">
        记录
      </h2>
      {sortedDates.map((date) => (
        <div key={date} className="space-y-2">
          <p className="text-xs text-gray-400">{date}</p>
          {grouped[date].map((expense) => {
            const cat = expenseCategories.find((c) => c.value === expense.category);
            return (
              <div
                key={expense.id}
                className="group flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-gray-50"
              >
                <span className="w-12 text-xs font-medium text-gray-500">
                  {cat?.label}
                </span>
                <span className="flex-1 text-gray-700">
                  {expense.note || "-"}
                </span>
                <span className="font-medium text-gray-900">
                  {formatCurrency(expense.amount)}
                </span>
                <button
                  onClick={() => handleDelete(expense.id)}
                  className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
