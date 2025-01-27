import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";

const locations = sqliteTable('locations', {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  city: t.text().notNull().unique()
});

export type LocationType = typeof locations.$inferSelect;

export default locations;