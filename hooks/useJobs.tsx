
import { db } from "@/app/_layout";
import jobApplications from "@/db/schema/jobApplications";
import { useQuery } from "@tanstack/react-query";

const useJobs = () => {
  const query = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await db.select().from(jobApplications);
      return res
    }
  })

  return query;
};

export default useJobs;