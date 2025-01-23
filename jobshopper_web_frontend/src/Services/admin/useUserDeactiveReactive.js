// api/ admin/deactivate-reactivate/<int:pk>/user/</int:pk>
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const userActiveDeactive = async ({ id, is_deactivated }) => {
  const API = `${BASE_URL}api/admin/deactivate-reactivate/${id}/user/`;

  const Token = localStorage.getItem("Token");
  const config = {
    headers: {
      Authorization: `Token ${Token}`,
    },
  };
  const body = {
    is_deactivated: is_deactivated,
  };
  const res = await axios.patch(API, body, config);
  return res.data;
};

export const useUserDeactiveReactive = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, is_deactivated }) =>
      userActiveDeactive({ id, is_deactivated }),
    onSuccess: (res) => {
      toast.success(res.message);
      queryClient.invalidateQueries([
        "admin-Employer-List",
        "allCandidates",
        "deactive-all-users",
      ]);
    },
    onError: (err) => {
       toast.error(err.message , {id:"error-id"});
    },
  });

  return { mutate, isPending };
};
