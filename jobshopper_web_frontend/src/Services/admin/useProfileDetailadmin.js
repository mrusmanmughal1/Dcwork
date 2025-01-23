import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useUserinfo } from "../../Context/AuthContext";

const getProfileDetail = async (id) => {
  const API = `${BASE_URL}api/candidate-profile/${id}/`;

  const Token = localStorage.getItem("Token");
  const config = {
    headers: {
      Authorization: `Token ${Token}`,
    },
  };
  const res = await axios.get(API, config);

  return res;
};

export const useProfileDetailadmin = (id) => {
  const { user_type } = useUserinfo();

  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["single-candidate-admin", id],
    queryFn: () => getProfileDetail(id),
    enabled: user_type === "administrator",
  });
  return { data, isLoading, status, isError };
};
