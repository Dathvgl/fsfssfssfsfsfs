import { useQuery } from "@tanstack/react-query";
import UserAPI from "~/apis/UserAPI";

export function useUserPerson(userId?: string) {
  if (!userId) return;

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user", "person", "alt", userId],
    queryFn: async () => {
      const res = await UserAPI.userPerson(userId);
      if (!res || res.status != 200) throw new Error();
      return res.data;
    },
  });

  if (isLoading || isError) return;
  return data;
}
