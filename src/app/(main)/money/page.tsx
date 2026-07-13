import { auth } from "@/auth";
import { db } from "@/db";
import { bankAccounts, savingsGoals } from "@/db/schema";
import { eq } from "drizzle-orm";
import { AccountsOverview } from "@/components/money/AccountsOverview";
import { SavingsGoalsSection } from "@/components/money/SavingsGoalsSection";

export default async function MoneyPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const accounts = await db
    .select()
    .from(bankAccounts)
    .where(eq(bankAccounts.userId, userId))
    .orderBy(bankAccounts.createdAt)
    .all();

  const goals = await db
    .select()
    .from(savingsGoals)
    .where(eq(savingsGoals.userId, userId))
    .orderBy(savingsGoals.createdAt)
    .all();

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">资金汇总</h1>
      <AccountsOverview accounts={accounts} totalBalance={totalBalance} />
      <SavingsGoalsSection goals={goals} />
    </div>
  );
}
