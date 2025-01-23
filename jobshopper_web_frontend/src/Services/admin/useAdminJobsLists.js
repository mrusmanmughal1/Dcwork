import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const adminjoblist = async ({ status, page }) => {
  const API = `${BASE_URL}api/admin/jobs/?status=${status}&page=${page}`;
  const Token = localStorage.getItem("Token");

  const config = {
    headers: {
      Authorization: `Token ${Token}`,
    },
  };
  const res = await axios.get(API, config);
  return res;
};

export const useAdminJobsLIsts = ({ status, page }) => {
  const { data, isLoading, isError, isPending } = useQuery({
    queryKey: ["admin-ARP", page],
    queryFn: () =>
      adminjoblist({
        status,
        page,
      }),
  });
  return { data, isLoading, status, isError, isPending };
};
