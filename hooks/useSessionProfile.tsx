import { db } from "@/app/_layout";
import profileSessions from "@/db/schema/profileSessions";
import SessionProfileDataType from "@/types/SessionProfileType";
import { useQuery } from "@tanstack/react-query"
import { eq } from "drizzle-orm";

const useSessionProfile = () => {
  const query = useQuery({
    queryKey: ['profile_session'],
    queryFn: async () => {
      try {
        const cr0 = await db
          .select()
          .from(profileSessions)
          .orderBy(profileSessions.updatedAt)
          .where(eq(profileSessions.completed, true))
          .limit(1);
        const completedRows = cr0.map((row) => ({ ...row, data: JSON.parse(row.data) as SessionProfileDataType }));
        console.log("cr0: ", completedRows);

        const cr1 = await db
          .select()
          .from(profileSessions)
          .orderBy(profileSessions.updatedAt)
          .where(eq(profileSessions.completed, false))
          .limit(1);
        const currentRows = cr1.map((row) => ({ ...row, data: JSON.parse(row.data) as SessionProfileDataType }));
        console.log("cr1: ", currentRows);
        
        return { completedRows, currentRows };
      } catch (error) {
        console.error("Error fetching profile sessions:", error);
        throw error;
      }
    }
  });

  const hasExistingSession = query.data && query.data?.currentRows.length > 0;
  const existingSession = query.data && query.data?.currentRows[0];
  
  const hasPreviousSession = query.data && query.data?.completedRows.length > 0;
  const previousSession = query.data && query.data?.completedRows[0];

  console.log("Profile Sessions:\n", JSON.stringify(query.data, null, 2));
  console.log("has existing session: ", hasExistingSession);
  console.log("existing session:\n", existingSession);
  console.log("has previous session: ", hasPreviousSession);
  console.log("previous session:\n", previousSession);

  return {
    hasExistingSession,
    existingSession,
    hasPreviousSession,
    previousSession,
    ...query
  };
}

export default useSessionProfile;