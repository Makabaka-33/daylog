import { auth } from "@/auth";
import { db } from "@/db";
import { resumeProfiles, resumeItems } from "@/db/schema";
import { eq } from "drizzle-orm";
import { WhatIWantSection } from "@/components/resume/WhatIWantSection";
import { WhatIHaveSection } from "@/components/resume/WhatIHaveSection";

export default async function ResumePage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const profile = await db
    .select()
    .from(resumeProfiles)
    .where(eq(resumeProfiles.userId, userId))
    .get();

  const items = profile
    ? await db
        .select()
        .from(resumeItems)
        .where(eq(resumeItems.profileId, profile.id))
        .orderBy(resumeItems.sortOrder)
        .all()
    : [];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">简历</h1>
      <WhatIWantSection profile={profile} />
      <WhatIHaveSection items={items} />
    </div>
  );
}
