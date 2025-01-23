import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const GetSkills = async () => {
  const API = `${BASE_URL}api/skills/`;

  const res = await axios.get(API);
  return res.data;
};

export const useSkills = () => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["skills"],
    queryFn: GetSkills,
  });
  return { data, isLoading, status, isError };
};
