import * as t from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

const timestamps = {
  createdAt: t
    .text("created_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  updatedAt: t
    .text("updated_at")
    .notNull()
    .default(sql`(current_timestamp)`),
  deletedAt: t.text("deleted_at")
};

export default timestamps