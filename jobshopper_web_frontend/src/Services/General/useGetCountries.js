import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getCountries = async () => {
  const API = `${BASE_URL}api/country-state-city/`;

  const res = await axios.get(API);
  return res.data;
};

export const useGetCountries = () => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["Countries-Data"],
    queryFn: getCountries,
    cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    staleTime: 2000 * 60 * 60 * 24,
  });
  return { data, isLoading, status, isError };
};
