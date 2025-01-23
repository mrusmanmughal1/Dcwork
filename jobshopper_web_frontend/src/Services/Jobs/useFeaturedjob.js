import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
const postFeatured = async (id) => {
  const { jobid, payment_profile_id } = id;
  const API = `${BASE_URL}api/jobs/${jobid}/featured/`;
  const token = localStorage.getItem("Token");
  const res = await axios.post(
    API,
    { payment_profile_id },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return res;
};

export const useFeaturedjob = () => {
  const query = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: postFeatured,
    onSuccess: (res) => {
      toast.success(res.data.detail);
      query.invalidateQueries(["Employer-history"]);
    },
    onError: (err) => {
      toast.error(
        err.response.data.detail ||
          " Unable To Featured This Job Right NOw Try Again Later ."
      ),
        { id: "intervw-id" };
    },
  });

  return { mutate, isPending, isError };
};
