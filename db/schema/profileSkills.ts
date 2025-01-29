import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import skills from "./skills";
import profiles from "./profiles";

const profileSkills = sqliteTable("profile_skills", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  skillId: t
    .integer("skill_id")
    .references(() => skills.id)
    .notNull(),
  profileId: t
    .integer("profile_id")
    .references(() => profiles.id)
    .notNull(),
});

export default profileSkills;
