import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const adminJobApprove = async ({ id, payload }) => {
  const API = `${BASE_URL}api/jobs/${id}/approval/`;

  const token = localStorage.getItem("Token");

  const res = await axios.patch(
    API,
    { action: payload },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return res;
};

export const useAdminJobApprove = () => {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: ({ id, payload }) => adminJobApprove({ id, payload }),
    onSuccess: (res) => {
      toast.success(res.data.detail);
      queryClient.invalidateQueries(["admin-ARP"]);
    },
    onError: (err) => {
      toast.error(err.message , {id:"error-id"});
    },
  });

  return { mutate, isPending };
};
