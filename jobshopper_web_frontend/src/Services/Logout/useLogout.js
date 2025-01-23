import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

import { useUserinfo } from "../../Context/AuthContext";
const getLogout = async () => {
  const Post = `${BASE_URL}api/logout/`;
  const Token = localStorage.getItem("Token");
  const Device_id = localStorage.getItem("Device_id");
  const body = {
    device_id: Device_id,
  };
  const config = {
    headers: {
      Authorization: `Token ${Token}`,
    },
  };
  const res = await axios.post(Post, body, config);
  return res;
};

export const useLogout = () => {
  const { dispatch } = useUserinfo();

  const { mutate, isLoading } = useMutation({
    mutationFn: () => getLogout(),
    onSuccess: (data) => {
      // Clear local storage
      localStorage.clear();
      sessionStorage.clear();
      dispatch({ type: "logout" });
      // window.location.reload();
      toast.success("Logout successful! See you next time!");
    },
    onError: (err) => {
      toast.error("There was an error logging you out. Please try again.", { id: "Logout-id" });
    },
  });

  return { mutate, isLoading };
};
