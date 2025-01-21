import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import timestamps from "./timestamps";
import DEFAULT_SESSION_PROFILE from "@/constants/SessionProfile";

const profileSessions = sqliteTable("profile_sessions", {
  id: integer().primaryKey({ autoIncrement: true }),
  ...timestamps,
  data: text()
    .notNull()
    .default(JSON.stringify(DEFAULT_SESSION_PROFILE)),
  completed: integer({ mode: "boolean" }).notNull().default(false),
});

export default profileSessions;
