"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { bankAccounts, savingsGoals } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const accountSchema = z.object({
  name: z.string().min(1),
  accountType: z.enum(["bank", "alipay", "wechat", "cash", "investment", "other"]),
  balance: z.coerce.number(),
});

export async function createAccount(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = accountSchema.parse({
    name: formData.get("name"),
    accountType: formData.get("accountType"),
    balance: formData.get("balance"),
  });

  await db.insert(bankAccounts).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    name: parsed.name,
    accountType: parsed.accountType,
    balance: parsed.balance,
  });

  revalidatePath("/money");
}

export async function updateAccountBalance(accountId: string, balance: number) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(bankAccounts)
    .set({ balance, lastUpdated: new Date().toISOString(), updatedAt: new Date().toISOString() })
    .where(
      and(eq(bankAccounts.id, accountId), eq(bankAccounts.userId, session.user.id))
    );

  revalidatePath("/money");
}

export async function deleteAccount(accountId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(bankAccounts)
    .where(
      and(eq(bankAccounts.id, accountId), eq(bankAccounts.userId, session.user.id))
    );

  revalidatePath("/money");
}

const goalSchema = z.object({
  title: z.string().min(1),
  targetAmount: z.coerce.number().positive(),
  currentAmount: z.coerce.number().optional(),
  deadline: z.string().optional(),
});

export async function createGoal(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = goalSchema.parse({
    title: formData.get("title"),
    targetAmount: formData.get("targetAmount"),
    currentAmount: formData.get("currentAmount") || 0,
    deadline: formData.get("deadline") || undefined,
  });

  await db.insert(savingsGoals).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    title: parsed.title,
    targetAmount: parsed.targetAmount,
    currentAmount: parsed.currentAmount || 0,
    deadline: parsed.deadline || null,
  });

  revalidatePath("/money");
}

export async function deleteGoal(goalId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(savingsGoals)
    .where(
      and(eq(savingsGoals.id, goalId), eq(savingsGoals.userId, session.user.id))
    );

  revalidatePath("/money");
}
