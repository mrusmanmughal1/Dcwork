import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getCandidates = async () => {
  const API = `${BASE_URL}api/view-applications/`;

  const token = localStorage.getItem("Token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useAppliedCandidatesCv = () => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["employerCandidate"],
    queryFn: () => getCandidates(),
  });
  return { data, isLoading, status, isError };
};
