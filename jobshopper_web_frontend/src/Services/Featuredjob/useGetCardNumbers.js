import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";

const getcards = async (id) => {
  const API = `${BASE_URL}api/get-customer-profile/`;
  const token = localStorage.getItem("Token");
  const res = await axios.post(
    API, // URL
    { user: id },
    {
      headers: {
        Authorization: `Token ${token}`, // Authorization header
      },
    }
  );
  return res;
};

export const useGetCardNumbers = () => {
  const { user_id } = useUserinfo();

  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["featuredcards", user_id],
    queryFn: () => getcards(user_id),
  });
  return { status, isError, data ,isLoading };
};
