
import { db } from "@/app/_layout";
import companies from "@/db/schema/companies";
import jobApplications from "@/db/schema/jobApplications";
import locations from "@/db/schema/locations";
import { useQuery } from "@tanstack/react-query";
import { eq, like } from "drizzle-orm";

const useJobs = (input?: string) => {
  const query = useQuery({
    queryKey: ['jobs', input],
    queryFn: async () => {
      const res = await db
        .select()
        .from(jobApplications)
        .innerJoin(companies, eq(jobApplications.companyId, companies.id))
        .innerJoin(locations, eq(jobApplications.locationId, locations.id))
        .where(like(jobApplications.name, `%${input}%`).if(input));

      return res
    }
  })

  return query;
};

export default useJobs;