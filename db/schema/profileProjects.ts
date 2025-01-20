import { sqliteTable } from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import * as t from "drizzle-orm/sqlite-core";
import profiles from "./profiles";
import { sql } from "drizzle-orm";

const profileProjects = sqliteTable("profile_projects", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  profileId: t
    .integer("profile_id")
    .references(() => profiles.id)
    .notNull(),
  name: t.text().notNull(),
  link: t.text(),
  details: t
    .text({ mode: "json" })
    .notNull()
    .$type<string[]>()
    .default(sql`(json_array())`),
});

export default profileProjects;
