import { db } from "@/app/_layout";
import jobApplicationStatuses from "@/db/schema/jobApplicationStatuses";
import { useQuery } from "@tanstack/react-query";

export default function useJobStatus() {
  const query = useQuery({
    queryKey: ['jobStatuses'],
    queryFn: async () => {
      const res = await db.select().from(jobApplicationStatuses)
      return res;
    }
  })

  return query;
}