import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";

const EmployerJobHistory = async (page) => {
  const token = localStorage.getItem("Token");
  const API = `${BASE_URL}api/employer/dashboard/?page=${page}`;

  const res = await axios.get(API, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useJobHistoryEMp = (page) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["Employer-history", page],
    queryFn: () => EmployerJobHistory(page),
  });
  return { data, isLoading, status, isError };
};
