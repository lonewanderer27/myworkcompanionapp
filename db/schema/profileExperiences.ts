import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import { sql } from "drizzle-orm";
import companies from "./companies";
import profiles from "./profiles";

const profileExperiences = sqliteTable("profile_experiences", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  role: t.text().notNull(),
  fullRole: t.text("full_role"),
  startDate: t.text("start_date").notNull(),
  endDate: t.text("end_date"),
  companyId: t
    .integer("company_id")
    .references(() => companies.id)
    .notNull(),
  freelance: t.integer({ mode: "boolean" }),
  details: t
    .text({ mode: "json" })
    .notNull()
    .$type<string[]>()
    .default(sql`(json_array())`),
  profileId: t
    .integer("profile_id")
    .references(() => profiles.id)
    .notNull(),
});

export default profileExperiences;
