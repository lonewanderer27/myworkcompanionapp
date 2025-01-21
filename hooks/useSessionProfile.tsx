import { db } from "@/app/_layout";
import profileSessions from "@/db/schema/profileSessions";
import SessionProfileDataType from "@/types/SessionProfileType";
import { useQuery } from "@tanstack/react-query"
import { eq } from "drizzle-orm";

const useSessionProfile = (fetchAll: boolean = false, completed: boolean = false) => {
  const query = useQuery({
    queryKey: ['profile_session'],
    queryFn: async () => {
      if (fetchAll) {
        const rows = await db.select()
                .from(profileSessions)
                .where(eq(profileSessions.completed, completed))
        const parsedRows = rows.map((row) => ({
          ...row,
          data: JSON.parse(row.data) as SessionProfileDataType,
        }));
        return parsedRows;
      }

      const rows = await db
        .select()
        .from(profileSessions)
        .where(eq(profileSessions.completed, completed))
        .limit(1);
      const parsedRows = rows.map((row) => ({
        ...row,
        data: JSON.parse(row.data) as SessionProfileDataType,
      }));
      return parsedRows;
    }
  })

  return query;
}

export default useSessionProfile;