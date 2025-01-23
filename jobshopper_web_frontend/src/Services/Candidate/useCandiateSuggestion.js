import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const AutoSuggestion = async (value) => {
  const Post = `${BASE_URL}api/candidate-filter-autosuggestion/?query=H`;
  const res = await axios.get(Post);
  return res;
};

export const useAutoSuggestionCandiaite = (val) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["AutoCandiate", val],
    queryFn: () => AutoSuggestion(val),
  });

  return { data, isLoading };
};

const AutoCountry = async (country) => {
  const Post = `${BASE_URL}api/candidate-filter-autosuggestion/?query=${country}&field=location`;
  const res = await axios.get(Post);
  return res;
};
export const useAutoSuggestionLocation = (country) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["AutoCandidateLocation", country],
    queryFn: () => AutoCountry(country),
  });

  return { data, isLoading };
};
