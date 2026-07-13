"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { resumeProfiles, resumeItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

const profileSchema = z.object({
  desiredJob: z.string().optional(),
  desiredIndustry: z.string().optional(),
  desiredSalary: z.string().optional(),
  desiredLocation: z.string().optional(),
  notes: z.string().optional(),
});

export async function upsertProfile(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = profileSchema.parse({
    desiredJob: formData.get("desiredJob") || undefined,
    desiredIndustry: formData.get("desiredIndustry") || undefined,
    desiredSalary: formData.get("desiredSalary") || undefined,
    desiredLocation: formData.get("desiredLocation") || undefined,
    notes: formData.get("notes") || undefined,
  });

  const existing = await db
    .select()
    .from(resumeProfiles)
    .where(eq(resumeProfiles.userId, session.user.id))
    .get();

  if (existing) {
    await db
      .update(resumeProfiles)
      .set({
        ...parsed,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(resumeProfiles.id, existing.id));
  } else {
    await db.insert(resumeProfiles).values({
      id: crypto.randomUUID(),
      userId: session.user.id,
      ...parsed,
    });
  }

  revalidatePath("/resume");
}

const resumeItemSchema = z.object({
  category: z.enum(["skill", "experience", "education", "certification", "language"]),
  title: z.string().min(1),
  description: z.string().optional(),
  level: z.string().optional(),
});

export async function createResumeItem(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const parsed = resumeItemSchema.parse({
    category: formData.get("category"),
    title: formData.get("title"),
    description: formData.get("description") || undefined,
    level: formData.get("level") || undefined,
  });

  // Ensure profile exists
  let profile = await db
    .select()
    .from(resumeProfiles)
    .where(eq(resumeProfiles.userId, session.user.id))
    .get();

  if (!profile) {
    const id = crypto.randomUUID();
    await db.insert(resumeProfiles).values({
      id,
      userId: session.user.id,
    });
    profile = { id } as typeof resumeProfiles.$inferSelect;
  }

  const existing = await db
    .select({ max: resumeItems.sortOrder })
    .from(resumeItems)
    .where(eq(resumeItems.profileId, profile.id))
    .all();

  const maxOrder = existing.reduce((max, i) => Math.max(max, i.max), 0);

  await db.insert(resumeItems).values({
    id: crypto.randomUUID(),
    profileId: profile.id,
    category: parsed.category,
    title: parsed.title,
    description: parsed.description || null,
    level: parsed.level || null,
    sortOrder: maxOrder + 1,
  });

  revalidatePath("/resume");
}

export async function deleteResumeItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  await db.delete(resumeItems).where(eq(resumeItems.id, itemId));
  revalidatePath("/resume");
}
