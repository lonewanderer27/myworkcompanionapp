
import { db } from "@/app/_layout";
import companies from "@/db/schema/companies";
import { useQuery } from "@tanstack/react-query";

const useCompanies = () => {
  const query = useQuery({
    queryKey: ['companies'],
    queryFn: async () => {
      const res = await db.select().from(companies);
      return res
    }
  })

  return query;
};

export default useCompanies;