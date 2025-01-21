CREATE TABLE `profileSessions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`data` text DEFAULT '{"careerGoal":"","careerProfile":"","name":"","fullName":"","contactNo":"","github":"","gitlab":"","linkedin":"","email":"","twitter":"","website":""}' NOT NULL,
	`completed` integer GENERATED ALWAYS AS (false) VIRTUAL NOT NULL
);
