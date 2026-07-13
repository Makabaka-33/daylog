"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { expenses } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const expenseSchema = z.object({
  amount: z.coerce.number().positive(),
  category: z.enum(["breakfast", "lunch", "dinner", "snack", "other"]),
  date: z.string(),
  note: z.string().optional(),
});

export async function createExpense(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = expenseSchema.parse({
    amount: formData.get("amount"),
    category: formData.get("category"),
    date: formData.get("date"),
    note: formData.get("note") || undefined,
  });

  await db.insert(expenses).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    amount: parsed.amount,
    category: parsed.category,
    date: parsed.date,
    note: parsed.note || null,
  });

  revalidatePath("/expenses");
}

export async function deleteExpense(expenseId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(expenses)
    .where(
      and(eq(expenses.id, expenseId), eq(expenses.userId, session.user.id))
    );

  revalidatePath("/expenses");
}
