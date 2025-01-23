import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";

const CandidateJObHistory = async (page) => {
  const params = new URLSearchParams({ page });
  const API = `${BASE_URL}api/candidate/applications/?${params.toString()}`;

  const token = localStorage.getItem("Token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useCandidateHistory = (page) => {
  const { user_type } = useUserinfo();
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["Candidate-history", page],
    queryFn: () => CandidateJObHistory(page),
    enabled: user_type === "candidate",
  });
  return { data, isLoading, status, isError };
};
