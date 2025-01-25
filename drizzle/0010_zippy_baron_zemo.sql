ALTER TABLE `job_applications` ADD `per_per_month` real;--> statement-breakpoint
ALTER TABLE `job_applications` ADD `allowance_per_day` real;--> statement-breakpoint
ALTER TABLE `job_applications` DROP COLUMN `allowance_per_month`;