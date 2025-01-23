// manage-candidate-profile/
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const pasrseData = async ({ profileid, cvIndex }) => {
  const API = `${BASE_URL}api/manage-candidate-profile/${profileid}/`;
  const token = localStorage.getItem("Token");
  const res = await axios.put(
    API,
    { cv_id: cvIndex },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return res;
};

export const useCandidateCvParsing = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ profileid, cvIndex }) => pasrseData({ profileid, cvIndex }),
    onSuccess: (res) => {
      queryClient.invalidateQueries(["candidate"]);
      toast.success(
        `${res?.data?.updated_fields?.length} Fields Data Updated Successfully `
      );
    },
    onError: (err) => {
      toast.error("Unable To Parse Data Try Again Later" , {id: "candidate-cv-parse-error"});
    },
  });

  return { mutate, isPending, isError };
};
