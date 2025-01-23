//   useAutoSuggestion
import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const AutoSuggestion = async (value) => {
  const Post = `${BASE_URL}api/candidate-filter-autosuggestion/?query=${value}&field=keywords`;
  const res = await axios.get(Post);
  return res;
};

export const useAutoSugestionCandidate = (val) => {
  const { data, isLoading } = useQuery({
    queryKey: ["candidate-suggest", val],
    queryFn: () => AutoSuggestion(val),
    enabled: val.length > 2,
  });

  return { data, isLoading };
};

const AutoCountry = async (country) => {
  const Post = `${BASE_URL}api/candidate-filter-autosuggestion/?query=${country}&field=location`;
  const res = await axios.get(Post);
  return res;
};
export const useAutoCountrycandidate = (country) => {
  const { data, isLoading } = useQuery({
    queryKey: ["autoCountry-candidate", country],
    queryFn: () => AutoCountry(country),
    enabled: country.length > 2,
  });

  return { data, isLoading };
};
