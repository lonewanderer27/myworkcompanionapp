PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profile_sessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`data` text DEFAULT '{"careerGoal":"","careerProfile":"","name":"","fullName":"","contactNo":"","github":"","gitlab":"","linkedin":"","email":"","twitter":"","website":""}' NOT NULL,
	`completed` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_profile_sessions`("id", "created_at", "updated_at", "deleted_at", "data", "completed") SELECT "id", "created_at", "updated_at", "deleted_at", "data", "completed" FROM `profile_sessions`;--> statement-breakpoint
DROP TABLE `profile_sessions`;--> statement-breakpoint
ALTER TABLE `__new_profile_sessions` RENAME TO `profile_sessions`;--> statement-breakpoint
PRAGMA foreign_keys=ON;