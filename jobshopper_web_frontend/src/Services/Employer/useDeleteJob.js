import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const DeleteJob = async (id) => {
  const API = `${BASE_URL}api/jobs/${id}/delete/`;

  const token = localStorage.getItem("Token");

  const res = await axios.delete(
    API,

    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return res;
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, isPending } = useMutation({
    mutationFn: (id) => DeleteJob(id),
    onSuccess: (res) => {
      toast.success("Job deleted successfully!" ,{id:"ok"});
      queryClient.invalidateQueries(["Employer-history"]);
    },
    onError: (err) => {
      toast.error(
        err.response.data.error ||
          "There was an error deleting the job. Please try again",
        { id: "error-toast" }
      );
    },
  });

  return { mutate, isLoading, isError, isPending };
};
