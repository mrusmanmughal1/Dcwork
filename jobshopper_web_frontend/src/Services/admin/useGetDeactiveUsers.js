import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getAllDeactiveUers = async (usertype) => {
  const API = `${BASE_URL}api/admin/users/deactivate/?user_type=${usertype}`;

  const Token = localStorage.getItem("Token");

  const config = {
    headers: {
      Authorization: `Token ${Token}`,
    },
  };
  const res = await axios.get(API, config);
  return res;
};

export const useGetDeactiveUsers = (type) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["deactive-all-users" , type],
    queryFn: () => getAllDeactiveUers(type),
  });
  return { data, isLoading, status, isError };
};
