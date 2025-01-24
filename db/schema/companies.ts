import * as t from "drizzle-orm/sqlite-core";
import { sqliteTable } from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import locations from "./locations";

const companies = sqliteTable("companies", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  name: t.text().notNull(),
  fullName: t.text("full_name"),
  description: t.text(),
  website: t.text(),
  locationId: t.integer("location_id").references(() => locations.id),
  glassdoorUrl: t.text("glassdoor_url"),
});

export type CompanyType = typeof companies.$inferSelect;

export default companies;
