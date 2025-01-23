import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";
import toast from "react-hot-toast";

const EmployerUpdate = async (Credndials, id) => {
  const API = `${BASE_URL}api/manage-employer-profile/${id}/`;

  const token = localStorage.getItem("Token");
  const res = await axios.patch(API, Credndials, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useUpdateEmployer = () => {
  const { user_id } = useUserinfo();
  const queryClient = useQueryClient();
  const { mutate, isPending, isError } = useMutation({
    mutationFn: (credentials) => EmployerUpdate(credentials, user_id),
    onSuccess: (res) => {
      toast.success(res.data.message);
      queryClient.invalidateQueries(["Employer"]);
    },
    onError: (err) => {
      // Check if the error response exists
      if (err.response) {
        const errorMessage = err.response.data.message || "An error occurred";

        // Check if the error message indicates a unique constraint violation
        const isUniqueConstraintError = errorMessage.includes(
          "employer profile with this phone already exists"
        );

        const formattedError = isUniqueConstraintError
          ? "Phone number already exists"
          : errorMessage;

        toast.error(formattedError, { id: "error-toast" });
      } else {
        toast.error("An unexpected error occurred", { id: "error-toast" });
      }
    },
  });

  return { mutate, isPending, isError };
};
