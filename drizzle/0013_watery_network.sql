ALTER TABLE `companies` ADD `avatar_url` text;--> statement-breakpoint
ALTER TABLE `profile_education` ADD `profile_id` integer NOT NULL REFERENCES profiles(id);--> statement-breakpoint
ALTER TABLE `profile_experiences` ADD `profile_id` integer NOT NULL REFERENCES profiles(id);--> statement-breakpoint
ALTER TABLE `profile_skills` ADD `profile_id` integer NOT NULL REFERENCES profiles(id);--> statement-breakpoint
ALTER TABLE `profile_volunteerings` ADD `profile_id` integer NOT NULL REFERENCES profiles(id);--> statement-breakpoint
CREATE UNIQUE INDEX `skill_categories_name_unique` ON `skill_categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `skills_name_unique` ON `skills` (`name`);