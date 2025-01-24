
import { db } from "@/app/_layout";
import companies from "@/db/schema/companies";
import jobApplications from "@/db/schema/jobApplications";
import locations from "@/db/schema/locations";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

const useJobs = () => {
  const query = useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const res = await db
        .select()
        .from(jobApplications)
        .innerJoin(companies, eq(jobApplications.companyId, companies.id))
        .innerJoin(locations, eq(jobApplications.locationId, locations.id))
      return res
    }
  })

  return query;
};

export default useJobs;