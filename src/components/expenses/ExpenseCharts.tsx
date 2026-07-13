"use client";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { expenseCategories } from "@/lib/constants";

interface Expense {
  amount: number;
  category: string;
  date: string;
}

interface Props {
  expenses: Expense[];
}

const COLORS = ["#3b82f6", "#f59e0b", "#10b981", "#ef4444", "#8b5cf6"];

export function ExpenseCharts({ expenses }: Props) {
  if (expenses.length === 0) return null;

  // Category pie data
  const categoryData = expenseCategories.map((cat) => {
    const total = expenses
      .filter((e) => e.category === cat.value)
      .reduce((sum, e) => sum + e.amount, 0);
    return { name: cat.label, value: Math.round(total * 100) / 100 };
  }).filter((d) => d.value > 0);

  // Trend bar data (last 7 days)
  const last7Days: { date: string; [key: string]: string | number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const dayData: { date: string; [key: string]: string | number } = {
      date: `${d.getMonth() + 1}/${d.getDate()}`,
    };
    expenseCategories.forEach((cat) => {
      dayData[cat.value] = expenses
        .filter((e) => e.date === dateStr && e.category === cat.value)
        .reduce((sum, e) => sum + e.amount, 0);
    });
    last7Days.push(dayData);
  }

  return (
    <div className="space-y-6">
      {categoryData.length > 0 && (
        <div>
          <h3 className="text-sm font-medium text-gray-500 mb-3">分类占比</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                dataKey="value"
                label={({ name, value }) => `${name} ¥${value}`}
                labelLine={false}
              >
                {categoryData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      <div>
        <h3 className="text-sm font-medium text-gray-500 mb-3">近 7 天趋势</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={last7Days}>
            <XAxis dataKey="date" fontSize={12} tickLine={false} />
            <YAxis fontSize={12} tickLine={false} />
            <Tooltip />
            {expenseCategories.map((cat, i) => (
              <Bar
                key={cat.value}
                dataKey={cat.value}
                stackId="a"
                fill={COLORS[i % COLORS.length]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
