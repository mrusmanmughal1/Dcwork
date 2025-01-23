import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
const JobTheJob = async (formData) => {
  const Post = `${BASE_URL}api/jobs/create/`;
  const token = localStorage.getItem("Token");
  if (formData.remote_work) {
    delete formData.addresses;
  }

  const res = await axios.post(Post, formData, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useJobPost = () => {
  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: (JONFORM) => JobTheJob(JONFORM),
    onSuccess: (res) => {
      toast.success("Job posted successfully! Your listing is now live");
      return res;
    },
    onError: (err) => {
      const errorMessage =
        err?.response?.data?.message ||
        err.response.data.detail ||
        err?.response?.data?.details ||
        "There was an error posting your job. Please try again.";

      toast.error(errorMessage, { id: "job-id" });
    },
  });

  return { mutate, isPending, isError, error };
};
