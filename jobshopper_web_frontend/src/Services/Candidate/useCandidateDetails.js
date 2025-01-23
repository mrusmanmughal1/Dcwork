import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";
import { useEffect } from "react";
import toast from "react-hot-toast";

const CandidateDetails = async (id) => {
  const API = `${BASE_URL}api/candidate-profile/${id}/`;
  const token = localStorage.getItem("Token");

  try {
    const res = await axios.get(API, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return res;
  } catch (error) {
    if (
      error.response.data.detail == "User account is deactivated." ||
      error.response.data.detail == "Invalid token."
    ) {
      toast.error(
        "Your account has been deactivated or deleted. Please contact our support team for further assistance.",
        { id: "deactive" }
      );
      localStorage.removeItem("Token");
      localStorage.removeItem("User_Data");
      window.location.reload();
    }
    throw error;
  }
};

export const useCandidateDetails = () => {
  const { user_id, user_type, auth } = useUserinfo();
  const { data, isLoading, isPending, isError, status, refetch } = useQuery({
    queryKey: ["candidate", user_id],
    queryFn: () => CandidateDetails(user_id),
    enabled: user_type === "candidate",
    staleTime: auth ? 1000 * 60 * 10 : 1000 * 60 * 2,
    cacheTime: auth ? 1000 * 60 * 60 : 1000 * 60 * 5,
    onError: (err) => {
      console.error("Error fetching candidate details data:", err.response);
    },
  });

  useEffect(() => {
    if (auth && user_type === "candidate") {
      refetch(); // Manually trigger a refetch when auth becomes true
    }
  }, [auth, refetch]);
  return { data, isLoading, isPending, status, isError };
};
