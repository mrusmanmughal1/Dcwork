import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getWorkAuthorization = async () => {
  const API = `${BASE_URL}api/work-authorizations`;

  const res = await axios.get(API);
  return res;
};

export const useWorkAuthorization = () => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["workAuthorization"],
    queryFn: getWorkAuthorization,
  });
  return { data, isLoading, status, isError };
};
