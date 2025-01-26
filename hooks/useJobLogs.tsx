
import { db } from "@/app/_layout";
import jobApplicationLogs from "@/db/schema/jobApplicationLogs";
import jobApplications from "@/db/schema/jobApplications";
import { useQuery } from "@tanstack/react-query";
import { eq, desc } from "drizzle-orm";

const useJobLogs = (jobId?: number, limit?: number) => {
  const query = useQuery({
    queryKey: ['job_logs', jobId, limit],
    queryFn: async () => {
      let qb = db
        .select()
        .from(jobApplicationLogs)
        .innerJoin(jobApplications, eq(jobApplicationLogs.jobApplicationId, jobApplications.id))
        .where(eq(jobApplicationLogs.jobApplicationId, jobId!).if(jobId))
        .orderBy(desc(jobApplicationLogs.createdAt))
        .$dynamic()
      
      if (limit) {
        qb = qb.limit(limit!)
      }
      
      const res = await qb;
    
      return res;
    },
  })

  return query;
};

export default useJobLogs;