PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_job_applications` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	`deleted_at` text,
	`name` text NOT NULL,
	`company_id` integer NOT NULL,
	`contact_person_id` integer,
	`email` text,
	`contact_no` text,
	`location_id` integer NOT NULL,
	`hours_per_week` integer,
	`allowance_per_month` real,
	`description` text NOT NULL,
	`application_url` text,
	`work_mode` text,
	FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`contact_person_id`) REFERENCES `contact_people`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`location_id`) REFERENCES `locations`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_job_applications`("id", "created_at", "updated_at", "deleted_at", "name", "company_id", "contact_person_id", "email", "contact_no", "location_id", "hours_per_week", "allowance_per_month", "description", "application_url", "work_mode") SELECT "id", "created_at", "updated_at", "deleted_at", "name", "company_id", "contact_person_id", "email", "contact_no", "location_id", "hours_per_week", "allowance_per_month", "description", "application_url", "work_mode" FROM `job_applications`;--> statement-breakpoint
DROP TABLE `job_applications`;--> statement-breakpoint
ALTER TABLE `__new_job_applications` RENAME TO `job_applications`;--> statement-breakpoint
PRAGMA foreign_keys=ON;