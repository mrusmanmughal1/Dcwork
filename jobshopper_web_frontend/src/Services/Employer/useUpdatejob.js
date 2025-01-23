import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const updateJob = async (Credndials, id) => {
  const API = `${BASE_URL}api/jobs/${id}/update/`;

  const token = localStorage.getItem("Token");
  const res = await axios.patch(API, Credndials, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};


export const useUpdatejob = (id) => {
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (credentials) => updateJob(credentials, id),
    onSuccess: (res) => {
      toast.success("Job Updated");
      queryClient.invalidateQueries(["Employer-history"]);
    },
    onError: (err) => {
      toast.error(err.response.data.message , { id: "error-toast" });
    },
  });

  return { mutate, isPending, isError };
};
