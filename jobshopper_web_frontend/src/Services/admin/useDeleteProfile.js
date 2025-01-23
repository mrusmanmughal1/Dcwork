import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const AdminDeleteProfile = async ({ profile, id }) => {
  const API = `${BASE_URL}api/delete-profile/${id}/`;

  const Token = localStorage.getItem("Token");
  const config = {
    headers: {
      Authorization: `Token ${Token}`,
    },
  };
  const res = await axios.delete(API, config);
  return res.data;
};

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ profile, id }) => AdminDeleteProfile({ profile, id }),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries(["admin-Employer-List", "allCandidates"]);
    },
    onError: (err) => {
      toast.error(err.message , {id:"error-id"});
    },
  });

  return { mutate, isPending };
};
