import {
  BiSolidLeftArrowSquare,
  BiSolidRightArrowSquare,
} from "react-icons/bi";
import { NavLink } from "react-router-dom";
import Loader from "./Loader";
import ErrorMsg from "./ErrorMsg";
import Job from "./Job";
import { useJobStatus } from "../Services/General/useJobStatus";
import { useSearchAPI } from "../Services/General/useSearchAPI";
import { useState } from "react";
const RecentJObs = () => {
  const { data: JobStatus, isLoading: LoadJobStatus, isError } = useJobStatus();
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const {
    data: SearchedData,
    isLoading: isSearch,
    isError: SearchError,
  } = useSearchAPI(query, page);
  const handleNextPage = () => {
    if (page >= 1) {
      setPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage((prev) => prev - 1);
    }
  };
  if (isSearch || LoadJobStatus)
    return (
      <div className="w-full py-20">
        {" "}
        <Loader />
      </div>
    );
  if (SearchedData?.data?.results?.count == 0 || SearchError || isError) {
    return (
      <div className="w-full">
        <ErrorMsg
          ErrorMsg={"  No Job is  Available  Right Now !  Try Later ."}
        />
      </div>
    );
  }
  return (
    <div className=" w-full   mx-auto  ">
      <div className="flex items-center   justify-between     border-b-2">
        <div className="font-bold">Recent Jobs</div>
        <div className=" flex justify-between py-4 ">
          <button
            onClick={handlePreviousPage}
            disabled={!SearchedData?.data?.results?.previous}
            className="text-purple-900 text-2xl     disabled:cursor-not-allowed     hover:cursor-pointer"
          >
            <BiSolidLeftArrowSquare />
          </button>
          <button
            onClick={handleNextPage}
            className="text-purple-900 text-2xl     disabled:cursor-not-allowed   hover:cursor-pointer"
            disabled={!SearchedData?.data?.results?.next}
          >
            <BiSolidRightArrowSquare />
          </button>
        </div>
      </div>

      <div className="border  mt-8">
        {SearchedData?.data?.results?.results?.map((val, i) => (
          <Job key={i} job={val} JobStatus={JobStatus} rec="res" />
        ))}
      </div>
      <div className="flex py-4  justify-end">
        <NavLink
          to={"/jobs"}
          className="px-4 py-2 bg-purple-900 font-semibold rounded-md text-white"
        >
          ALL JOBS
        </NavLink>
      </div>
    </div>
  );
};

export default RecentJObs;
