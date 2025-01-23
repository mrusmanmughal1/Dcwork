import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

import toast from "react-hot-toast";

const ClearJobBasket = async (id) => {
  const API = `${BASE_URL}api/job-basket-clear/${id ? id + "/" : ""}`;
  const token = localStorage.getItem("Token");

  const res = await axios.delete(API, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useClearJobBasket = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: (id) => ClearJobBasket(id),
    onSuccess: (res) => {
      toast.success(res.data.message);

      queryClient.invalidateQueries(["basket"]);
    },
    onError: (err) => {
      toast.error(
        err.response?.data?.message ||
          "There was an error removing the job from your basket. Please try again",
        { id: "error-toast" }
      );
    },
  });

  return { mutate, isPending, isError };
};
