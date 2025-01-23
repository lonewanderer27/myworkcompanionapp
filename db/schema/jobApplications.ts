import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import companies from "./companies";
import contactPeople from "./contactPeople";
import locations from "./locations";

const jobApplications = sqliteTable('job_applications', {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  name: t.text().notNull(),
  companyId: t.integer("company_id").references(() => companies.id).notNull(),
  contactPersonId: t.integer("contact_person_id").references(() => contactPeople.id).notNull(),
  locationId: t.integer("location_id").references(() => locations.id).notNull(),
  hoursPerWeek: t.integer("hours_per_week"),
  allowancePerMonth: t.real("allowance_per_month"),
  description: t.text().notNull(),
  applicationUrl: t.text("application_url"),
  workMode: t.text("work_mode")
})

export type JobApplicationType = typeof jobApplications.$inferSelect;

export default jobApplications;