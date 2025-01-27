import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";

const jobApplicationStatuses = sqliteTable("job_application_statuses", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  name: t.text().notNull(),
});

export type JobApplicationStatusType = typeof jobApplicationStatuses.$inferSelect;

export default jobApplicationStatuses;
