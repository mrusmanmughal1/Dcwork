import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

import toast from "react-hot-toast";

const JobBasket = async (id) => {
  const API = `${BASE_URL}api/job-basket/`;
  const token = localStorage.getItem("Token");
  const body = {
    job: id,
  };

  const res = await axios.post(API, body, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useJobBasket = () => {
  const queryClient = useQueryClient();

  const { mutate, isLoading, isError, isPending } = useMutation({
    mutationFn: (credentials) => JobBasket(credentials),
    onSuccess: (res) => {
      toast.success("Job added to your basket successfully!");
      queryClient.invalidateQueries(["basket"]);
    },
    onError: (err) => {
      toast.error(
        "There was an error adding the job to your basket. Please try again",
        { id: "error-toast" }
      );
    },
  });

  return { mutate, isLoading, isError, isPending };
};
