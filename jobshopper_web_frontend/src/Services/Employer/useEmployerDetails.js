import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";
import { useEffect } from "react";
import { useLogout } from "../Logout/useLogout";
import toast from "react-hot-toast";

const EmployerDetails = async (id) => {
  const API = `${BASE_URL}api/employer-profile/${id}/`;

  const token = localStorage.getItem("Token");

  try {
    const res = await axios.get(API, {
      headers: {
        Authorization: `Token ${token}`,
      },
    });
    return res;
  } catch (error) {
    if (error.response.data.detail === "Invalid token.") {
      toast.error("Your Account is  Deleted, Kindly Contact To The Admin.");
      localStorage.removeItem("Token");
      localStorage.removeItem("User_Data");
      window.location.reload();
    }
    throw error; // Rethrow the error to be caught by useQuery
  }
};

export const useEmployerDetails = () => {
  const { mutate } = useLogout();
  const { user_id, user_type, auth } = useUserinfo();
  const { data, isLoading, isError, status, isPending, refetch } = useQuery({
    queryKey: ["Employer", user_id],
    queryFn: () => EmployerDetails(user_id),
    enabled: user_type === "employer",
    staleTime: auth ? 1000 * 60 * 10 : 1000 * 60 * 2,
    cacheTime: auth ? 1000 * 60 * 60 : 1000 * 60 * 5,
  });

  useEffect(() => {
    if (auth && user_type === "employer") {
      refetch(); // Manually trigger a refetch when auth becomes true
    }
  }, [auth, refetch]);
  return { data, isLoading, status, isError, isPending };
};
