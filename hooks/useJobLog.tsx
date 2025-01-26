
import { db } from "@/app/_layout";
import jobApplicationLogs from "@/db/schema/jobApplicationLogs";
import jobApplications from "@/db/schema/jobApplications";
import jobApplicationStatuses from "@/db/schema/jobApplicationStatuses";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

const useJobLog = (jobLogId?: number) => {
  const query = useQuery({
    queryKey: ['jobLog', jobLogId],
    queryFn: async () => {
      let qb = db
        .select()
        .from(jobApplicationLogs)
        .innerJoin(jobApplications, eq(jobApplicationLogs.jobApplicationId, jobApplications.id))
        .innerJoin(jobApplicationStatuses, eq(jobApplicationLogs.jobApplicationStatusId, jobApplicationStatuses.id))
        .where(eq(jobApplicationLogs.id, jobLogId!))
      
      const res = await qb;
    
      return res;
    },
    enabled: !!jobLogId
  })

  return query;
};

export default useJobLog;