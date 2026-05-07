PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_profile` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text,
	`synced_at` integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
	`student_id` text NOT NULL,
	`avatar` text,
	`enrollment_number` text NOT NULL,
	`roll_number` text NOT NULL,
	`name` text NOT NULL,
	`college` text,
	`university` text NOT NULL,
	`course` text NOT NULL,
	`specialization` text,
	`dob` text NOT NULL,
	`year_sem` integer NOT NULL,
	`gender` text NOT NULL,
	`course_type` text NOT NULL,
	`branch` text,
	`official_email` text NOT NULL,
	`personal_email` text NOT NULL,
	`mobile` text NOT NULL,
	`batch` integer NOT NULL,
	`abc_account` text,
	`address` text NOT NULL,
	`section` text,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `__new_profile`("id", "user_id", "synced_at", "student_id", "avatar", "enrollment_number", "roll_number", "name", "college", "university", "course", "specialization", "dob", "year_sem", "gender", "course_type", "branch", "official_email", "personal_email", "mobile", "batch", "abc_account", "address", "section") SELECT "id", "user_id", "synced_at", "student_id", "avatar", "enrollment_number", "roll_number", "name", "college", "university", "course", "specialization", "dob", "year_sem", "gender", "course_type", "branch", "official_email", "personal_email", "mobile", "batch", "abc_account", "address", "section" FROM `profile`;--> statement-breakpoint
DROP TABLE `profile`;--> statement-breakpoint
ALTER TABLE `__new_profile` RENAME TO `profile`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE UNIQUE INDEX `profile_student_id_unique` ON `profile` (`student_id`);--> statement-breakpoint
CREATE INDEX `profile_studentId_idx` ON `profile` (`student_id`);--> statement-breakpoint
CREATE INDEX `profile_userId_idx` ON `profile` (`user_id`);--> statement-breakpoint
ALTER TABLE `user` ADD `profile_id` text NOT NULL;