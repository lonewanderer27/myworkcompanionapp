
import { db } from "@/app/_layout";
import jobApplicationLogs from "@/db/schema/jobApplicationLogs";
import jobApplications from "@/db/schema/jobApplications";
import jobApplicationStatuses from "@/db/schema/jobApplicationStatuses";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

const useJobLogs = () => {
  const query = useQuery({
    queryKey: ['job_logs'],
    queryFn: async () => {
      const res = await db
        .select()
        .from(jobApplicationLogs)
        .innerJoin(jobApplications, eq(jobApplicationLogs.jobApplicationId, jobApplications.id));
      return res
    }
  })

  return query;
};

export default useJobLogs;