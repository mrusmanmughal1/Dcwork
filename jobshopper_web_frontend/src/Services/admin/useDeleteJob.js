// api/ jobs/<int:pk>/delete/

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const deletejob = async (id) => {
  const API = `${BASE_URL}api/delete-profile/${id}/delete`;

  const Token = localStorage.getItem("Token");
  const config = {
    headers: {
      Authorization: `Token ${Token}`,
    },
  };
  const res = await axios.delete(API, config);
  return res.data;
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: (id) => deletejob(id),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(["admin-all-jobs", "allCandidates"]);
    },
    onError: (err) => {
      toast.error(err.message , {id:"error-id"});
    },
  });

  return { mutate, isPending };
};
