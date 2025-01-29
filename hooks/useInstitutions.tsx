
import { db } from "@/app/_layout";
import institutions from "@/db/schema/institutions";
import { useQuery } from "@tanstack/react-query";

const useInstitutions = () => {
  const query = useQuery({
    queryKey: ['institutions'],
    queryFn: async () => {
      const res = await db.select().from(institutions);
      return res
    }
  })

  return query;
};

export default useInstitutions;