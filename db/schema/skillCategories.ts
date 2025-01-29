import { sqliteTable } from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import * as t from "drizzle-orm/sqlite-core";

const skillCategories = sqliteTable('skill_categories', {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  name: t.text().notNull().unique()
});

export type SkillCategoryType = typeof skillCategories.$inferSelect;

export default skillCategories;