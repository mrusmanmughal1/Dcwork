import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";

const JobBasket = async () => {
  const API = `${BASE_URL}api/job-basket/`;
  const token = localStorage.getItem("Token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useGetBasket = () => {
  const { user_type } = useUserinfo();
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["basket"],

    queryFn: () => JobBasket(),
    enabled: user_type === "candidate",
  });
  return { data, isLoading, status, isError };
};
