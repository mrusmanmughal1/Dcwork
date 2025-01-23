import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const candidateapproval = async ({ id, status }) => {
  const API = `${BASE_URL}api/employer/dashboard/`;

  const token = localStorage.getItem("Token");

  const res = await axios.patch(
    API,
    {
      application_id: id,
      status: status,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return res;
};

export const useCandidateAppect = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, isPending } = useMutation({
    mutationFn: ({ id, status }) => candidateapproval({ id, status }),
    onSuccess: (res) => {
      toast.success(res.data.detail ,{id:"accept"});
      queryClient.invalidateQueries(["Employer-history"]);
    },
    onError: (err) => {
      toast.error(err.response.data.error ,{ id: "error-toast" });
    },
  });

  return { mutate, isLoading, isError, isPending };
};
