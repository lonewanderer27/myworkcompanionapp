import { sqliteTable } from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import * as t from "drizzle-orm/sqlite-core";
import profiles from "./profiles";
import companies from "./companies";

const profileCertificates = sqliteTable("profile_certificates", {
  id: t.integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  name: t.text().notNull(),
  link: t.text().notNull(),
  dateIssued: t.text("date_issued").notNull(),
  profileId: t
    .integer("profile_id")
    .references(() => profiles.id)
    .notNull(),
  companyId: t
    .integer("company_id")
    .references(() => companies.id)
    .notNull(),
});

export default profileCertificates;
