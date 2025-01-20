import { db } from "@/app/_layout";
import locations from "@/db/schema/locations";
import { useQuery } from "@tanstack/react-query";

const useLocations = () => {
  const query = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await db.select().from(locations);
      return res;
    }
  })

  return query;
};

export default useLocations;