import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { DailyTaskSection } from "@/components/tasks/DailyTaskSection";
import { CompletedTaskSection } from "@/components/tasks/CompletedTaskSection";
import { today } from "@/lib/utils";

export default async function TasksPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const todayDate = today();

  const pendingTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.taskType, "daily"),
        eq(tasks.status, "pending")
      )
    )
    .orderBy(tasks.sortOrder)
    .all();

  const completedTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.taskType, "daily"),
        eq(tasks.status, "completed")
      )
    )
    .orderBy(tasks.completedAt)
    .all();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">每日任务</h1>
      <p className="text-sm text-gray-500">{todayDate}</p>

      <DailyTaskSection tasks={pendingTasks} />
      <CompletedTaskSection tasks={completedTasks} />
    </div>
  );
}
