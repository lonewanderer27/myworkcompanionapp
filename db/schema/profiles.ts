import { sqliteTable } from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import * as t from "drizzle-orm/sqlite-core";
import jobApplications from "./jobApplications";

const profiles = sqliteTable("profiles", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  careerProfile: t.text("career_profile").notNull(),
  careerGoal: t.text("career_goal"),
  name: t.text("name").notNull(),
  fullName: t.text("full_name").notNull(),
  contactNo: t.text("contact_no").notNull(),
  github: t.text(),
  gitlab: t.text(),
  linkedin: t.text(),
  email: t.text().notNull(),
  twitter: t.text(),
  website: t.text(),

  // for customized profiles for each job application
  jobApplicationId: t.integer().references(() => jobApplications.id),
});

export default profiles;
