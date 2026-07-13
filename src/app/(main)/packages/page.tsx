import { auth } from "@/auth";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq } from "drizzle-orm";
import { PackageTabs } from "@/components/packages/PackageTabs";

export default async function PackagesPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const allPackages = await db
    .select()
    .from(packages)
    .where(eq(packages.userId, userId))
    .orderBy(packages.createdAt)
    .all();

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">快递追踪</h1>
      <PackageTabs packages={allPackages} />
    </div>
  );
}
