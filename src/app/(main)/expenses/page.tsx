import { auth } from "@/auth";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AddExpenseForm } from "@/components/expenses/AddExpenseForm";
import { ExpenseList } from "@/components/expenses/ExpenseList";
import { ExpenseCharts } from "@/components/expenses/ExpenseCharts";

export default async function ExpensesPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const allExpenses = await db
    .select()
    .from(expenses)
    .where(eq(expenses.userId, userId))
    .orderBy(expenses.date)
    .all();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">花费记录</h1>
      <AddExpenseForm />
      <ExpenseCharts expenses={allExpenses} />
      <ExpenseList expenses={allExpenses} />
    </div>
  );
}
