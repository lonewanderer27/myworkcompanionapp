import { sqliteTable } from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import * as t from "drizzle-orm/sqlite-core";
import profiles from "./profiles";
import skills from "./skills";

const profileExperienceTechnologies = sqliteTable(
  "profile_experience_technologies",
  {
    id: t.integer().primaryKey({ autoIncrement: true }),
    ...timestamps,
    profileId: t.integer("profile_id").references(()=>profiles.id).notNull(),
    skillId: t.integer("skill_id").references(()=>skills.id).notNull()
  }
);

export default profileExperienceTechnologies;
