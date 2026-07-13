import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// ---- User ----
export const users = sqliteTable("users", {
  id: text("id").primaryKey(),
  username: text("username").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  displayName: text("display_name"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ---- Tasks (daily + near_term) ----
export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  taskType: text("task_type", { enum: ["daily", "near_term"] }).notNull(),
  status: text("status", { enum: ["pending", "completed"] }).notNull().default("pending"),
  sortOrder: integer("sort_order").notNull().default(0),
  dueDate: text("due_date"),
  nearTermRange: text("near_term_range"),
  completedAt: text("completed_at"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ---- Short-term Plans ----
export const plans = sqliteTable("plans", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  period: text("period", { enum: ["week", "10days", "month", "year"] }).notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ---- Plan Columns ----
export const planColumns = sqliteTable("plan_columns", {
  id: text("id").primaryKey(),
  planId: text("plan_id").notNull().references(() => plans.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  startDate: text("start_date"),
  endDate: text("end_date"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ---- Plan Cards ----
export const planCards = sqliteTable("plan_cards", {
  id: text("id").primaryKey(),
  columnId: text("column_id").notNull().references(() => planColumns.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  color: text("color"),
  completed: integer("completed", { mode: "boolean" }).notNull().default(false),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ---- Packages ----
export const packages = sqliteTable("packages", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  trackingNumber: text("tracking_number").notNull(),
  carrier: text("carrier"),
  direction: text("direction", { enum: ["send", "receive"] }).notNull(),
  description: text("description"),
  status: text("status", {
    enum: ["pending", "in_transit", "out_for_delivery", "delivered", "received", "sent", "returned"],
  }).notNull().default("pending"),
  statusHistory: text("status_history"),
  estimatedDelivery: text("estimated_delivery"),
  imageUrl: text("image_url"),
  ocrResult: text("ocr_result"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ---- Expenses ----
export const expenses = sqliteTable("expenses", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  amount: real("amount").notNull(),
  category: text("category", { enum: ["breakfast", "lunch", "dinner", "snack", "other"] }).notNull(),
  date: text("date").notNull(),
  note: text("note"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ---- Bank Accounts ----
export const bankAccounts = sqliteTable("bank_accounts", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  accountType: text("account_type", {
    enum: ["bank", "alipay", "wechat", "cash", "investment", "other"],
  }).notNull(),
  balance: real("balance").notNull().default(0),
  currency: text("currency").notNull().default("CNY"),
  lastUpdated: text("last_updated").default(sql`(datetime('now'))`),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ---- Savings Goals ----
export const savingsGoals = sqliteTable("savings_goals", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  targetAmount: real("target_amount").notNull(),
  currentAmount: real("current_amount").notNull().default(0),
  color: text("color"),
  deadline: text("deadline"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ---- Resume Profile ----
export const resumeProfiles = sqliteTable("resume_profiles", {
  id: text("id").primaryKey(),
  userId: text("user_id").notNull().unique().references(() => users.id, { onDelete: "cascade" }),
  desiredJob: text("desired_job"),
  desiredIndustry: text("desired_industry"),
  desiredSalary: text("desired_salary"),
  desiredLocation: text("desired_location"),
  notes: text("notes"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});

// ---- Resume Items ----
export const resumeItems = sqliteTable("resume_items", {
  id: text("id").primaryKey(),
  profileId: text("profile_id").notNull().references(() => resumeProfiles.id, { onDelete: "cascade" }),
  category: text("category", {
    enum: ["skill", "experience", "education", "certification", "language"],
  }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  level: text("level"),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  updatedAt: text("updated_at").default(sql`(datetime('now'))`),
});
