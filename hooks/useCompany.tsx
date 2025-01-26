
import { db } from "@/app/_layout";
import companies from "@/db/schema/companies";
import locations from "@/db/schema/locations";
import { useQuery } from "@tanstack/react-query";
import { eq } from "drizzle-orm";

const useCompany = (companyId?: number) => {
  const query = useQuery({
    queryKey: ['company', companyId],
    queryFn: async () => {
      const res = await db
        .select()
        .from(companies)
        .innerJoin(locations, eq(companies.locationId, locations.id))
        .where(eq(companies.id, companyId!));
      return res
    },
    enabled: !!companyId
  })

  return query;
};

export default useCompany;