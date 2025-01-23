import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

const DeleteAccount = async (cardData) => {
  const API = `${BASE_URL}api/delete-payment-profile/`;
  const token = localStorage.getItem("Token");

  const res = await axios.post(API, cardData, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};

export const useRemovePaymentAccount = () => {
  const { mutate, isPending, isError } = useMutation({
    mutationFn: DeleteAccount,
  
    onError: (err) => {
      toast.error(err.response.data.message || "Sorry Unable To Delete Card Right Now .Try Later.", { id: "error-toast" });
    },
  });
  return { mutate, isPending, isError };
};
