import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const getLogin = async (credentials) => {
  const Post = `${BASE_URL}api/login/`;
  const res = await axios.post(Post, credentials);
  return res;
};

export const useLogin = () => {
  const { dispatch } = useUserinfo();
  const navigate = useNavigate();
  const { mutate, isPending } = useMutation({
    mutationFn: (credentials) => {
      // Generate a unique device type identifier
      const deviceType = uuidv4();

      // Include deviceType in the credentials
      const credentialsWithDeviceType = {
        ...credentials,
        device_id: `WebProtal-${deviceType}`,
      };

      // Pass credentials with device type to the login function
      return getLogin(credentialsWithDeviceType);
    },
    onSuccess: (data) => {
      // device_type
      const { user_type, token, device_id } = data.data.data;
      dispatch({ type: "login", payload: data.data.data });
      // setting Tokken and UserData to DB
      localStorage.setItem("Token", token);

      localStorage.setItem("User_Data", JSON.stringify(data.data.data)); 
      localStorage.setItem("Device_id", device_id);
      // Destination as Admin
      const destination =
        user_type === "administrator" ? "/admin/dashboard" : "";
      navigate(destination, { replace: true });

      // toast Message
      toast.success("Successfully Logged in ");
    },

    // Handle Error
    onError: (err) => {
      const errorMessage =
        err.response?.data?.message || err.response.data.error;
      toast.error(errorMessage || "Unable To Logged In Try Again later .", {
        id: "error-toast",
      });
    },
  });

  return { mutate, isPending };
};
