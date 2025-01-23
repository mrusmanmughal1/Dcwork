import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const gitSimilar = async (id) => {
  const API = `${BASE_URL}api/similar-jobs/${id}/`;

  const res = await axios.get(API);
  return res;
};

export const useGetSimilarJobs = (id) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["similar"],
    queryFn: () => gitSimilar(id),
  });
  return { data, isLoading, status, isError };
};
