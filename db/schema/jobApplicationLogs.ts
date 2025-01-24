import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import jobApplicationStatuses from "./jobApplicationStatuses";
import jobApplications from "./jobApplications";
import { relations } from "drizzle-orm";

const jobApplicationLogs = sqliteTable('job_application_logs', {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  jobApplicationStatusId: t.integer("job_application_status_id").references(() => jobApplicationStatuses.id).notNull(),
  jobApplicationId: t.integer("job_application_id").references(() => jobApplications.id).notNull(),
  summary: t.text().notNull(),
  description: t.text().notNull(),
  me: t.integer({ mode: "boolean" }).default(false)
});

export type JobApplicationLogType = typeof jobApplicationLogs.$inferSelect;

// define relationships
export const jobApplicationLogsRelationship = relations(jobApplicationLogs, ({ one }) => ({
  jobApplicationStatus: one(jobApplicationStatuses, {
    fields: [jobApplicationLogs.jobApplicationStatusId],
    references: [jobApplicationStatuses.id]
  }),
  jobApplicationId: one(jobApplications, {
    fields: [jobApplicationLogs.jobApplicationId],
    references: [jobApplications.id]
  })
}))

export default jobApplicationLogs;