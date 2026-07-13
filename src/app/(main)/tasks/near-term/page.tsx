import { auth } from "@/auth";
import { db } from "@/db";
import { tasks } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { NearTermTaskSection } from "@/components/tasks/NearTermTaskSection";

export default async function NearTermTasksPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const nearTermTasks = await db
    .select()
    .from(tasks)
    .where(
      and(
        eq(tasks.userId, userId),
        eq(tasks.taskType, "near_term"),
        eq(tasks.status, "pending")
      )
    )
    .orderBy(tasks.dueDate, tasks.sortOrder)
    .all();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">近期任务</h1>
      <NearTermTaskSection tasks={nearTermTasks} />
    </div>
  );
}
