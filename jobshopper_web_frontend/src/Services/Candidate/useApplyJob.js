import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const ApplyJob = async ({ method, body }) => {
  const API = `${BASE_URL}api/jobs/apply/`;
  const token = localStorage.getItem("Token");
  const res = await axios({
    method,
    url: API,
    data: body,
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useApplyJob = () => {
  const { mutate, isPending } = useMutation({
    mutationFn: ({ method, body }) => ApplyJob({ method, body }),

    onError: (err) => {
      toast.error(
        err.response.data.message ||
          "There was an error submitting your application. Please try again.",
        { id: "error-toast" }
      );
    },
  });

  return { mutate, isPending };
};
