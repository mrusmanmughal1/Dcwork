import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getStates = async (country) => {
  const API = `${BASE_URL}api/states/${country}`;

  const res = await axios.get(API);
  return res.data;
};

export const useGetStates = (country) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["states-data"],
    queryFn: () => getStates(country),
  });
  return { data, isLoading, status, isError };
};
