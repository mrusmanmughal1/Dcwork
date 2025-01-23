import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getSpecialization = async () => {
  const API = `${BASE_URL}api/specializations/`;

  const res = await axios.get(API);
  return res;
};

export const useSpecializationSkills = () => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["specializations"],
    queryFn: getSpecialization,
    staleTime: 1000 * 60 * 60 * 24, // Cache data for 24 hours (24 * 60 * 60 * 1000)
    cacheTime: 1000 * 60 * 60 * 24, // Keep data in cache for 30 minutes
  });
  return { data, isLoading, status, isError };
};
