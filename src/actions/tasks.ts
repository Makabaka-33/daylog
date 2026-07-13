"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  taskType: z.enum(["daily", "near_term"]),
  dueDate: z.string().optional(),
});

export async function createTask(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = createTaskSchema.parse({
    title: formData.get("title"),
    taskType: formData.get("taskType"),
    dueDate: formData.get("dueDate") || undefined,
  });

  const existing = await db
    .select({ max: tasks.sortOrder })
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, session.user.id),
        eq(tasks.taskType, parsed.taskType),
        eq(tasks.status, "pending")
      )
    )
    .all();

  const maxOrder = existing.reduce((max, t) => Math.max(max, t.max), 0);

  await db.insert(tasks).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    title: parsed.title,
    taskType: parsed.taskType,
    dueDate: parsed.dueDate || null,
    sortOrder: maxOrder + 1,
  });

  revalidatePath("/tasks");
  if (parsed.taskType === "near_term") revalidatePath("/tasks/near-term");
}

export async function toggleTaskComplete(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const task = await db
    .select()
    .from(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)))
    .get();

  if (!task) throw new Error("Task not found");

  const newStatus = task.status === "completed" ? "pending" : "completed";

  await db
    .update(tasks)
    .set({
      status: newStatus,
      completedAt: newStatus === "completed" ? new Date().toISOString() : null,
      updatedAt: new Date().toISOString(),
    })
    .where(eq(tasks.id, taskId));

  revalidatePath("/tasks");
  revalidatePath("/tasks/near-term");
}

export async function deleteTask(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(tasks)
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));

  revalidatePath("/tasks");
  revalidatePath("/tasks/near-term");
}

export async function reorderTasks(orderedIds: string[]) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  for (let i = 0; i < orderedIds.length; i++) {
    await db
      .update(tasks)
      .set({ sortOrder: i, updatedAt: new Date().toISOString() })
      .where(
        and(eq(tasks.id, orderedIds[i]), eq(tasks.userId, session.user.id))
      );
  }

  revalidatePath("/tasks");
}

export async function convertToDaily(taskId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .update(tasks)
    .set({
      taskType: "daily",
      nearTermRange: null,
      dueDate: null,
      updatedAt: new Date().toISOString(),
    })
    .where(and(eq(tasks.id, taskId), eq(tasks.userId, session.user.id)));

  revalidatePath("/tasks");
  revalidatePath("/tasks/near-term");
}
