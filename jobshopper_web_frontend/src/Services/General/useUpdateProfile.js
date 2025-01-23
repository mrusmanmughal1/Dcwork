import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/Userinfo";

const UpdateProfile = async (credentials, id) => {
  const Post = `${BASE_URL}api/manage-candidate-profile/${id}/`;
  const res = await axios.post(Post, credentials);
  return res;
};

export const useUpdateProfile = () => {
  const navigate = useNavigate();
  const { user_id } = useUserinfo();

  const { mutate, isLoading } = useMutation({
    mutationFn: (credentials) => UpdateProfile(credentials, user_id),
    onSuccess: (data) => {
      const { user_type, token } = data.data.data;
      localStorage.setItem("Token", token);
      if (user_type == "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }
      toast.success(data.data.message, { id: "updated" });
    },
    onError: (err) =>
      toast.error(
        err.message == "Network Error"
          ? "  Please Try Again Later ! "
          : err.error,
        { id: "error-toast" }
      ),
  });

  return { mutate, isLoading };
};
