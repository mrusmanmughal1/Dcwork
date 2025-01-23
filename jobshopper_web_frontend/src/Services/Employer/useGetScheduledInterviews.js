import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";

// get intervies
const ScheduledData = async (page, filter) => {
  const API = `${BASE_URL}api/interviews/?${
    filter && "&upcoming=true"
  }&page=${page}`;

  const token = localStorage.getItem("Token");

  const res = await axios.get(API, {
    headers: {
      Authorization: `Token ${token}`,
    },
  });
  return res.data;
};

export const useGetScheduledInterview = (page, filter) => {
  const { data, isLoading, isError, status } = useQuery({
    queryKey: ["Interviews", page, filter],
    queryFn: () => ScheduledData(page, filter),
  });
  return { data, isLoading, status, isError };
};

// Delete Interview

const DeleteIntervies = async (id) => {
  const API = `${BASE_URL}api/interviews/`;

  const token = localStorage.getItem("Token");

  const res = await axios.delete(
    API,

    {
      data: { id: id.id },
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return res.data;
};

export const useDeleteInterview = () => {
  const { mutate, isLoading, isError, isPending } = useMutation({
    mutationFn: (id) => DeleteIntervies(id),
  });

  return { mutate, isLoading, isError, isPending };
};
/// update

const UPdateinterview = async (id) => {
  const API = `${BASE_URL}api/interviews/`;

  const token = localStorage.getItem("Token");

  const res = await axios.delete(
    API,
    {
      id,
    },
    {
      headers: {
        Authorization: `Token ${token}`,
      },
    }
  );
  return res.data;
};

export const useUPdateInterview = () => {
  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, isPending } = useMutation({
    mutationFn: (id) => UPdateinterview(id),
    onSuccess: (res) => {
      toast.success(res.data.message ,{id:"okk"});
      queryClient.invalidateQueries(["Interviews"]);
    },
    onError: (err) => {
      toast.error(err.response.data.error );
    },
  });

  return { mutate, isLoading, isError, isPending };
};
