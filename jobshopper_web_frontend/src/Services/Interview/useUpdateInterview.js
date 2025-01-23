import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const updateInterview = async (data) => {
  const API = `${BASE_URL}api/interviews/`;

  const token = localStorage.getItem("Token");

  const res = await axios.put(API, data, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useUpdateInterview = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: updateInterview,
    onError: (err) => {
      toast.error(err.response.data.message, { id: "intervw-id" });
    },
  });

  return { mutate, isPending, isError };
};
