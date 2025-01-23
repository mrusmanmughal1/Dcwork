import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
const sendNotification = async (data) => {
  const Post = `${BASE_URL}api/send-notification/`;
  const body = {
    fcm_token: "",
    title: "",
    body: "",
  };
  const res = await axios.post(Post, body);
  return res;
};

export const useNotificationFirebase = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (data) => sendNotification(data),
  });

  return { mutate, isPending, isError };
};
