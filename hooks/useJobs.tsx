
import { db } from "@/app/_layout";
import companies from "@/db/schema/companies";
import jobApplications from "@/db/schema/jobApplications";
import locations from "@/db/schema/locations";
import { useQuery } from "@tanstack/react-query";
import { asc, eq, like, or } from "drizzle-orm";

const useJobs = (input?: string) => {
  const query = useQuery({
    queryKey: ['jobs', input],
    queryFn: async () => {
      const res = await db
        .select()
        .from(jobApplications)
        .innerJoin(companies, eq(jobApplications.companyId, companies.id))
        .innerJoin(locations, eq(jobApplications.locationId, locations.id))
        .where(or(
          like(jobApplications.name, `%${input}%`).if(input),
          like(jobApplications.description, `%${input}%`).if(input),
          like(companies.fullName, `%${input}%`).if(input),
          like(locations.city, `%${input}%`).if(input)
        ))
        .orderBy(asc(jobApplications.updatedAt))
      return res
    }
  })

  return query;
};

export default useJobs;