import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useParams } from "react-router-dom";

const getJobDetails = async (id) => {
  const API = `${BASE_URL}api/jobs/${id}/`;

  const res = await axios.get(API);
  return res;
};

export const useJobDetails = () => {
  const { id } = useParams();

  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["single-jobDetails", id],
    queryFn: () => getJobDetails(id),
  });
  return { data, isLoading, status, isError };
};
