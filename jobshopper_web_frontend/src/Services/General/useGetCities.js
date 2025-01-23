import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getCities = async (cities) => {
  const API = `${BASE_URL}api/cities/${cities}`;

  const res = await axios.get(API);
  return res.data;
};

export const useGetCities = (cities) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["cities-data"],
    queryFn: () => getCities(cities),
    // onSuccess ;()
  });
  return { data, isLoading, status, isError };
};
