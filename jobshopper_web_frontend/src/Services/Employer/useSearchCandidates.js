import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

const SearchCandidates = async (location, page) => {
  const token = localStorage.getItem("Token");
  const params = new URLSearchParams();

  if (page) params.append("page", page);

  const API = `${BASE_URL}api/candidate-profiles-filter/${location}&page=${page}`;

  const res = await axios.get(API, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res;
};
export const useSearchCandidates = () => {
  const location = useLocation();

  const [localPage, setLocalPage] = useState(1);
  useEffect(() => {
    setLocalPage(1);
  }, [location.search]);

  const handleNextPage = () => {
    if (localPage >= 1) {
      setLocalPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (localPage > 1) {
      setLocalPage((prev) => prev - 1);
    }
  };
  const { data, isLoading, isError, status, isPending } = useQuery({
    queryKey: ["candidates", location.search, localPage],
    queryFn: () => SearchCandidates(location.search, localPage),
  });

  return {
    data,
    isLoading,
    isError,
    status,
    isPending,
    handleNextPage,
    handlePreviousPage,
    localPage,
  };
};
