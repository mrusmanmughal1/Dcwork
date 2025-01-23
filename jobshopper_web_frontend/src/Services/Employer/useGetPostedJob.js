import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getJob = async (id) => {
  const API = `${BASE_URL}api/jobs/${id}/update/`;

  const token = localStorage.getItem("Token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useGetPostedJob = (id) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["getjob", id],
    queryFn: () => getJob(id),
  });
  return { data, isLoading, status, isError };
};
