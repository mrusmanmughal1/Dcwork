import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getSpecialization = async () => {
  const API = `${BASE_URL}api/specializations/`;

  const res = await axios.get(API);
  return res;
};

export const useSpecialization = () => {
  const { data, isLoading, isPending, isError, status } = useQuery({
    queryKey: ["specializations"],
    queryFn: getSpecialization,
  });
  return { data, isLoading, status, isError, isPending };
};
