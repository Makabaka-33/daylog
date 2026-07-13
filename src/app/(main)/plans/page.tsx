import { auth } from "@/auth";
import { db } from "@/db";
import { plans } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PlansOverview } from "@/components/plans/PlansOverview";

export default async function PlansPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const allPlans = await db
    .select()
    .from(plans)
    .where(eq(plans.userId, userId))
    .orderBy(plans.createdAt)
    .all();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">短期计划</h1>
      <PlansOverview plans={allPlans} />
    </div>
  );
}
