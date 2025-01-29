import { sqliteTable } from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import * as t from "drizzle-orm/sqlite-core";
import institutions from "./institutions";
import profiles from "./profiles";

const profileEducation = sqliteTable("profile_education", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  degree: t.text().notNull(),
  institution: t
    .integer()
    .references(() => institutions.id)
    .notNull(),
  date: t.text().notNull(),
  profileId: t
    .integer("profile_id")
    .references(() => profiles.id)
    .notNull(),
});

export default profileEducation;
