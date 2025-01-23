import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const createFeatureAccount = async (cardData) => {
  const API = `${BASE_URL}api/create-customer-profile/`;
  const token = localStorage.getItem("Token");

  const res = await axios.post(
    API, // URL
    cardData, // Body data (send `cardData` as the body of the request)
    {
      headers: {
        Authorization: `Token ${token}`, // Authorization header
      },
    }
  );
  return res;
};

export const useCreateFeatureAccount = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: createFeatureAccount,

    onError: (err) => {
      toast.error(err.response.data.message ,{ id: "error-toast" });
    },
  });
  return { mutate, isPending, isError };
};
