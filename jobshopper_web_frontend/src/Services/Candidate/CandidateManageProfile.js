import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const CandidateDetails = async (Credndials, id) => {
  const API = `${BASE_URL}api/manage-candidate-profile/${id}/`;
  const token = localStorage.getItem("Token");
  const res = await axios.patch(API, Credndials, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useCandidateManageProfile = () => {
  const { user_id } = useUserinfo();
  const queryClient = useQueryClient();
  const { mutate, isPending, error } = useMutation({
    mutationFn: (credentials) => CandidateDetails(credentials, user_id),
    onSuccess: (res) => {
      toast.success("Profile updated successfully!", { id: "updated" });
      queryClient.invalidateQueries(["candidate"]);
    },
    onError: (err) => {
      toast.error(
        "There was an error updating your profile. Please try again.",
        { id: "error-id" }
      );
    },
  });

  return { mutate, isPending, error };
};
