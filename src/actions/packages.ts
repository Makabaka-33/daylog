"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { packages } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { z } from "zod";

const packageSchema = z.object({
  trackingNumber: z.string().min(1),
  carrier: z.string().optional(),
  direction: z.enum(["send", "receive"]),
  description: z.string().optional(),
  estimatedDelivery: z.string().optional(),
});

export async function createPackage(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = packageSchema.parse({
    trackingNumber: formData.get("trackingNumber"),
    carrier: formData.get("carrier") || undefined,
    direction: formData.get("direction"),
    description: formData.get("description") || undefined,
    estimatedDelivery: formData.get("estimatedDelivery") || undefined,
  });

  await db.insert(packages).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    trackingNumber: parsed.trackingNumber,
    carrier: parsed.carrier || null,
    direction: parsed.direction,
    description: parsed.description || null,
    estimatedDelivery: parsed.estimatedDelivery || null,
  });

  revalidatePath("/packages");
}

export async function updatePackageStatus(packageId: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const pkg = await db
    .select()
    .from(packages)
    .where(and(eq(packages.id, packageId), eq(packages.userId, session.user.id)))
    .get();

  if (!pkg) throw new Error("Package not found");

  const history = pkg.statusHistory ? JSON.parse(pkg.statusHistory) : [];
  history.push({
    status,
    timestamp: new Date().toISOString(),
  });

  await db
    .update(packages)
    .set({
      status: status as typeof packages.$inferSelect.status,
      statusHistory: JSON.stringify(history),
      updatedAt: new Date().toISOString(),
    })
    .where(eq(packages.id, packageId));

  revalidatePath("/packages");
}

export async function deletePackage(packageId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db
    .delete(packages)
    .where(
      and(eq(packages.id, packageId), eq(packages.userId, session.user.id))
    );

  revalidatePath("/packages");
}
