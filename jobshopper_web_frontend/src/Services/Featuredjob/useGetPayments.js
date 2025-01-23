import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useState } from "react";

const GetPayments = async (page) => {
  const API = `${BASE_URL}api/payments/?page=${page}
`;
  const token = localStorage.getItem("Token");
  const res = await axios.get(API, {
    headers: {
      Authorization: `Token ${token}`, // Authorization header
    },
  });
  return res;
};

export const useGetPayments = () => {
  const [page, setpage] = useState(1);
  const next = () => {
    setpage(page + 1);
  };
  const pre = () => {
    setpage(page - 1);
  };
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["AllPayments", page],
    queryFn: () => GetPayments(page),
  });
  return { status, isError, data, isLoading, page, next, pre };
};
