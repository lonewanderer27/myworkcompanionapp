import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import skillCategories from "./skillCategories";

const skills = sqliteTable('skills', {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  name: t.text().notNull(),
  categoryId: t.integer("category_id").references(()=>skillCategories.id)
});

export default skills;