//   useAutoSuggestion
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const AutoSuggestion = async (value) => {
  const Post = `${BASE_URL}api/jobs/job-suggestions/?query=${value}&field=job`;
  const res = await axios.get(Post);
  return res;
};

export const useAutoSuggestion = (val) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["suggestion", val],
    queryFn: () => AutoSuggestion(val),
    enabled: val?.length > 2,
  });

  return { data, isLoading };
};

const AutoCountry = async (country) => {
  const Post = `${BASE_URL}api/jobs/job-suggestions/?query=${country}&field=location`;
  const res = await axios.get(Post);
  return res;
};
export const useAutoCountry = (country) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["autoCountry", country],
    queryFn: () => AutoCountry(country),
    enabled: country?.length > 2,
  });

  return { data, isLoading };
};
