"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { plans, planColumns, planCards } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const planSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  period: z.enum(["week", "10days", "month", "year"]),
  startDate: z.string(),
  endDate: z.string(),
});

export async function createPlan(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = planSchema.parse({
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    period: formData.get("period"),
    startDate: formData.get("startDate"),
    endDate: formData.get("endDate"),
  });

  await db.insert(plans).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    title: parsed.title,
    description: parsed.description || null,
    period: parsed.period,
    startDate: parsed.startDate,
    endDate: parsed.endDate,
  });

  revalidatePath("/plans");
}

export async function deletePlan(planId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(plans)
    .where(and(eq(plans.id, planId), eq(plans.userId, session.user.id)));

  revalidatePath("/plans");
}

export async function createColumn(planId: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db
    .select({ max: planColumns.sortOrder })
    .from(planColumns)
    .where(eq(planColumns.planId, planId))
    .all();

  const maxOrder = existing.reduce((max, c) => Math.max(max, c.max), -1);

  await db.insert(planColumns).values({
    id: crypto.randomUUID(),
    planId,
    title,
    sortOrder: maxOrder + 1,
  });

  revalidatePath(`/plans/${planId}`);
}

export async function createCard(columnId: string, title: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const existing = await db
    .select({ max: planCards.sortOrder })
    .from(planCards)
    .where(eq(planCards.columnId, columnId))
    .all();

  const maxOrder = existing.reduce((max, c) => Math.max(max, c.max), -1);

  await db.insert(planCards).values({
    id: crypto.randomUUID(),
    columnId,
    title,
    sortOrder: maxOrder + 1,
  });

  revalidatePath(`/plans/${columnId.split("/")[0]}`);
}

export async function toggleCardComplete(cardId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const card = await db
    .select()
    .from(planCards)
    .where(eq(planCards.id, cardId))
    .get();

  if (!card) throw new Error("Card not found");

  await db
    .update(planCards)
    .set({
      completed: !card.completed,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(planCards.id, cardId));

  revalidatePath("/plans");
}

export async function deleteCard(cardId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(planCards).where(eq(planCards.id, cardId));
  revalidatePath("/plans");
}

export async function removeColumn(columnId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(planColumns).where(eq(planColumns.id, columnId));
  revalidatePath("/plans");
}
