import { relations, sql } from "drizzle-orm";
import { sqliteTable, text, integer, index } from "drizzle-orm/sqlite-core";

export * from "./auth.schema";

import { user } from "./auth.schema";

export const profile = sqliteTable(
	"profile",
	{
		id: text("id").primaryKey(),
		userId: text("user_id").references(() => user.id, { onDelete: "set null" }),
		syncedAt: integer("synced_at", { mode: "timestamp_ms" })
			.default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
			.notNull(),
		// Student details
		studentId: text("student_id").notNull().unique(),
		avatar: text("avatar"),
		enrollmentNumber: text("enrollment_number").notNull(),
		rollNumber: text("roll_number").notNull(),
		name: text("name").notNull(),
		college: text("college"),
		university: text("university").notNull(),
		course: text("course").notNull(),
		specialization: text("specialization"),
		dob: text("dob").notNull(),
		yearSem: integer("year_sem").notNull(),
		gender: text("gender").notNull(),
		courseType: text("course_type").notNull(),
		branch: text("branch"),
		officialEmail: text("official_email").notNull(),
		personalEmail: text("personal_email").notNull(),
		mobile: text("mobile").notNull(),
		batch: integer("batch").notNull(),
		abcAccount: text("abc_account"),
		address: text("address").notNull(),
		section: text("section"),
	},
	(table) => [
		index("profile_studentId_idx").on(table.studentId),
		index("profile_userId_idx").on(table.userId),
	],
);

export const profileRelations = relations(profile, ({ one }) => ({
	user: one(user, {
		fields: [profile.userId],
		references: [user.id],
	}),
}));
