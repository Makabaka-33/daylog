CREATE TABLE `bank_accounts` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`name` text NOT NULL,
	`account_type` text NOT NULL,
	`balance` real DEFAULT 0 NOT NULL,
	`currency` text DEFAULT 'CNY' NOT NULL,
	`last_updated` text DEFAULT (datetime('now')),
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `expenses` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`amount` real NOT NULL,
	`category` text NOT NULL,
	`date` text NOT NULL,
	`note` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `packages` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`tracking_number` text NOT NULL,
	`carrier` text,
	`direction` text NOT NULL,
	`description` text,
	`status` text DEFAULT 'pending' NOT NULL,
	`status_history` text,
	`estimated_delivery` text,
	`image_url` text,
	`ocr_result` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `plan_cards` (
	`id` text PRIMARY KEY NOT NULL,
	`column_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`color` text,
	`completed` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`column_id`) REFERENCES `plan_columns`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `plan_columns` (
	`id` text PRIMARY KEY NOT NULL,
	`plan_id` text NOT NULL,
	`title` text NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`start_date` text,
	`end_date` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`plan_id`) REFERENCES `plans`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`period` text NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `resume_items` (
	`id` text PRIMARY KEY NOT NULL,
	`profile_id` text NOT NULL,
	`category` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`level` text,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`profile_id`) REFERENCES `resume_profiles`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `resume_profiles` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`desired_job` text,
	`desired_industry` text,
	`desired_salary` text,
	`desired_location` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `resume_profiles_user_id_unique` ON `resume_profiles` (`user_id`);--> statement-breakpoint
CREATE TABLE `savings_goals` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`target_amount` real NOT NULL,
	`current_amount` real DEFAULT 0 NOT NULL,
	`color` text,
	`deadline` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`task_type` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`sort_order` integer DEFAULT 0 NOT NULL,
	`due_date` text,
	`near_term_range` text,
	`completed_at` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `users` (
	`id` text PRIMARY KEY NOT NULL,
	`username` text NOT NULL,
	`password_hash` text NOT NULL,
	`display_name` text,
	`created_at` text DEFAULT (datetime('now')),
	`updated_at` text DEFAULT (datetime('now'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_username_unique` ON `users` (`username`);