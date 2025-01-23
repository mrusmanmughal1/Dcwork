  
  import { useQuery } from "@tanstack/react-query";
  import { BASE_URL } from "../../config/Config";
  import axios from "axios";
  
  const getJobDetails = async (id) => {
    const API = `${BASE_URL}api/jobs/${id}/`;
    const Token = localStorage.getItem("Token");
    const config = {
        headers: {
          Authorization: `Token ${Token}`,
        },
      };
      const res = await axios.get(API, config);

    return res;
  };
  
  export const useAdminJobDetails = (id) => {
  
    const { data, isLoading, isError, status } = useQuery({
      queryKey: ["single-jobDetails-admin", id],
      queryFn: () => getJobDetails(id),
    });
    return { data, isLoading, status, isError };
  };
  