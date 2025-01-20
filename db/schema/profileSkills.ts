import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import skills from "./skills";

const profileSkills = sqliteTable('profile_skills', {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  skillId: t.integer("skill_id").references(()=>skills.id).notNull()
});

export default profileSkills;