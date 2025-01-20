import { sqliteTable } from "drizzle-orm/sqlite-core";
import * as t from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";

const contactPeople = sqliteTable("contact_people", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  name: t.text().notNull(),
  position: t.text().notNull(),
  prefix: t.text().notNull(),
  email: t.text().notNull(),
  contactNo: t.text("contact_no").notNull(),
});

export default contactPeople;
