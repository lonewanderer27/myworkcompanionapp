
import { db } from "@/app/_layout";
import jobApplicationLogs from "@/db/schema/jobApplicationLogs";
import jobApplications from "@/db/schema/jobApplications";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

const useJobLogs = (jobId?: number) => {
  const query = useQuery({
    queryKey: ['job_logs', jobId],
    queryFn: async () => {
      const res = await db
        .select()
        .from(jobApplicationLogs)
        .innerJoin(jobApplications, eq(jobApplicationLogs.jobApplicationId, jobApplications.id))
        .where(eq(jobApplicationLogs.jobApplicationId, jobId!).if(jobId));
      return res
    },
  })

  return query;
};

export default useJobLogs;