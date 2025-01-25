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
  contactPersonId: t.integer("contact_person_id").references(() => contactPeople.id),
  email: t.text(),
  contactNo: t.text("contact_no"),
  locationId: t.integer("location_id").references(() => locations.id).notNull(),
  hoursPerWeek: t.integer("hours_per_week"),
  payPerMonth: t.real("per_per_month"),
  allowancePerDay: t.real("allowance_per_day"),
  description: t.text().notNull(),
  applicationUrl: t.text("application_url"),
  workMode: t.text("work_mode"),
  intern: t.integer({ mode: "boolean" }).default(false),
  deadline: t.text("deadline")
})

export type JobApplicationType = typeof jobApplications.$inferSelect;

export default jobApplications;