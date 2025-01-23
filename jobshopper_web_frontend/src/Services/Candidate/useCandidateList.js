import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const GetAllCandidateList = async (page = 1) => {
  const API = `${BASE_URL}api/candidates-profiles-list/?page=${page}`;

  const token = localStorage.getItem("Token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useAllCandidates = (page) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["allCandidates" , page],
    queryFn: () => GetAllCandidateList(page),
  });
  return { data, isLoading, status, isError };
};
