// api/employers-profile-list/

import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";

const getAllEmployers = async (page = 1) => {
  const API = `${BASE_URL}api/employers-profile-list/?page=${page}`;

  const Token = localStorage.getItem("Token");

  const config = {
    headers: {
      Authorization: `Token ${Token}`,
    },
  };
  const res = await axios.get(API, config);
  return res;
};

export const useAllEmployer = (page) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["admin-Employer-List", page],
    queryFn: () => getAllEmployers(page),
  });
  return { data, isLoading, status, isError };
};
