import { auth } from "@/auth";
import { db } from "@/db";
import { plans, planColumns, planCards } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { KanbanBoard } from "@/components/plans/KanbanBoard";

interface Props {
  params: { planId: string };
}

export default async function PlanDetailPage({ params }: Props) {
  const session = await auth();
  const userId = session!.user!.id!;

  const plan = await db
    .select()
    .from(plans)
    .where(and(eq(plans.id, params.planId), eq(plans.userId, userId)))
    .get();

  if (!plan) notFound();

  const columns = await db
    .select()
    .from(planColumns)
    .where(eq(planColumns.planId, plan.id))
    .orderBy(planColumns.sortOrder)
    .all();

  const allCards = [];
  for (const col of columns) {
    const colCards = await db
      .select()
      .from(planCards)
      .where(eq(planCards.columnId, col.id))
      .orderBy(planCards.sortOrder)
      .all();
    allCards.push(...colCards);
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{plan.title}</h1>
        {plan.description && (
          <p className="mt-1 text-sm text-gray-500">{plan.description}</p>
        )}
      </div>
      <KanbanBoard plan={plan} columns={columns} cards={allCards} />
    </div>
  );
}
