import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";
import { CANDIDATE } from "../../utils/Constants";
import toast from "react-hot-toast";

const getJobStatus = async () => {
  const API = `${BASE_URL}api/candidate/job-status/`;
  const Token = localStorage.getItem("Token");

  try {
    const res = await axios.get(API, {
      headers: {
        Authorization: `Token ${Token}`,
      },
    });
    return res;
  } catch (error) {
    if (
      error.response.data.detail == "User account is deactivated." ||
      error.response.data.detail == "Invalid token."
    ) {
      toast.error(
        "Your account has been deactivated or deleted. Please contact our support team for further assistance. ",
        { id: "deactive" }
      );
      localStorage.removeItem("Token");
      localStorage.removeItem("User_Data");
      window.location.reload();
    }
    throw error;
  }
};

export const useJobStatus = () => {
  const { auth, user_type } = useUserinfo();
  const { data, isLoading, isPending, isError, status } = useQuery({
    queryKey: ["jobstatus"],
    queryFn: getJobStatus,
    enabled: auth && user_type === CANDIDATE ? true : false,
  });
  return { data, isLoading, status, isError, isPending };
};
