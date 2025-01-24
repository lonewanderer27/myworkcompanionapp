import { db } from "@/app/_layout"
import companies from "@/db/schema/companies"
import jobApplications from "@/db/schema/jobApplications"
import locations from "@/db/schema/locations"
import { useQuery } from "@tanstack/react-query"
import { eq } from "drizzle-orm"

const useJob = (jobId?: number) => {
  const query = useQuery({
    queryKey: ['job', jobId],
    queryFn: async () => {
      const res = await db
        .select()
        .from(jobApplications)
        .innerJoin(companies, eq(jobApplications.companyId, companies.id))
        .innerJoin(locations, eq(jobApplications.locationId, locations.id))
        .where(eq(jobApplications.id, jobId!))

      return res;
    },
    enabled: !!jobId
  })

  return query;
}

export default useJob;