import { db } from "./index";
import { users } from "./schema";
import bcrypt from "bcryptjs";

async function seed() {
  const hash = await bcrypt.hash(
    process.env.AUTH_PASSWORD || "admin123",
    12
  );

  await db
    .insert(users)
    .values({
      id: crypto.randomUUID(),
      username: process.env.AUTH_USERNAME || "admin",
      passwordHash: hash,
      displayName: "管理员",
    })
    .onConflictDoNothing()
    .run();

  console.log("Seed completed: default user created");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
