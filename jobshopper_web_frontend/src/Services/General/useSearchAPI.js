import { useQuery } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { useEffect, useState } from "react";

const getSearchedData = async (val, page, city) => {
  const {
    title = "",
    location = "",
    isRemote = "",
    keyword = "",
    focused_industries = [],
    posted_in_last = "",
    contract_type = [],
    employer_id = "",
    work_type = [],
    rate_min = 0,
    rate_max = 0,
  } = val.searched;

  const params = new URLSearchParams();
  if (keyword) params.append("keyword", keyword);
  if (title || title == "") params.append("job_title", title);
  if (location || location == "") params.append("location", location);
  if (city) params.append("location", city);
  if (contract_type.length)
    params.append("contract_type", contract_type.toString());
  if (employer_id) params.append("employer_id", employer_id);
  if (work_type.length) params.append("work_type", work_type);
  if (rate_max) params.append("rate_max", rate_max);
  if (rate_min) params.append("rate_min", rate_min);

  if (posted_in_last) params.append("posted_in_last", posted_in_last);
  if (focused_industries.length)
    params.append("focused_industries", focused_industries);
  if (isRemote) params.append("remote", isRemote);
  if (page) params.append("page", page);

  const API = `${BASE_URL}api/jobs/search/?${params.toString()}`;
  const res = await axios.get(API);
  return res;
};

const getCityFromCoordinates = async (lat, lon) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`;
  const response = await axios.get(url);
  return response.data.address.country;
};
export const useSearchAPI = (searched) => {
  const [localPage, setLocalPage] = useState(1);

  const { data: cityData, isLoading: isCityLoading } = useQuery({
    queryKey: ["city"], // Cache key
    queryFn: async () => {
      if (navigator.geolocation) {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(async (position) => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            const city = await getCityFromCoordinates(lat, lon);
            resolve(city);
          });
        });
      }
    },
    enabled: !!navigator.geolocation, // Only run if geolocation is available
    staleTime: 1000 * 60 * 60, // Cache for 1 hour
  });
  useEffect(() => {
    setLocalPage(1);
  }, [searched]);

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
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["searched", searched, localPage, cityData],
    queryFn: () => getSearchedData({ searched }, localPage, cityData),
  });
  return {
    data,
    isLoading,
    status,
    isError,
    handleNextPage,
    handlePreviousPage,
    localPage,
  };
};
