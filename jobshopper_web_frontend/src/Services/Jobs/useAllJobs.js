import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getAllJobs = async () => {
  const API = `${BASE_URL}api/jobs/`;

  const res = await axios.get(API);
  return res;
};

export const useAllJobs = () => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["allJobs"],
    queryFn: getAllJobs,
  });
  return { data, isLoading, status, isError };
};
