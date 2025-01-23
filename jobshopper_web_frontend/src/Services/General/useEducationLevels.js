import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getEducationlevel = async () => {
  const API = `${BASE_URL}api/grouped-education-levels/`;

  const res = await axios.get(API);
  return res.data;
};

export const useEducationLevels = (cities) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["education-level-data"],
    queryFn: () => getEducationlevel(cities),
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    staleTime: 1000 * 60 * 60 * 24, // 24 hours
  });
  return { data, isLoading, status, isError };
};
