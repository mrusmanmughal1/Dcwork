import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getALLFeaturedJObs = async () => {
  const API = `${BASE_URL}api/jobs/?featured=true`;
  const res = await axios.get(API);
  return res;
};

export const useGetFeaturedJobs = () => {
  const { data, isPending, isError, status } = useQuery({
    queryKey: ["all-featured-jobs"],
    queryFn: getALLFeaturedJObs,
  });
  return { data, isPending, status, isError };
};
 
 
