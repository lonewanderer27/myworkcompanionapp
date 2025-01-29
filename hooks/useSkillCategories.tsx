
import { db } from "@/app/_layout";
import skillCategories from "@/db/schema/skillCategories";
import { useQuery } from "@tanstack/react-query";

const useSkillCategories = () => {
  const query = useQuery({
    queryKey: ['skill_categories'],
    queryFn: async () => {
      const res = await db.select().from(skillCategories);
      return res
    }
  })

  return query;
};

export default useSkillCategories;