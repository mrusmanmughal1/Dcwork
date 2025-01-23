import { useMutation } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
const sendNotification = async ({ token, username, title }) => {
  const Post = `${BASE_URL}api/send-notification/`;
  const body = {
    fcm_token: token,
    title: "New Application Received ",
    body: `${username} has applied for your " " Position. Review Their Application Now ! `,
  };
  const res = await axios.post(Post, body);
  return res;
};

export const useSendNotification = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: ({ token, username, title }) =>
      sendNotification({ token, username, title }),
  });

  return { mutate, isPending, isError };
};
