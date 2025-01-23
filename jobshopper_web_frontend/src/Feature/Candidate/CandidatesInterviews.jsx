import { useGetScheduledInterview } from "../../Services/Employer/useGetScheduledInterviews";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import moment from "moment";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const CandidatesInterviews = () => {
  const [page, setPage] = useState(1);
  const [filter, setfilter] = useState(false);
  const { data, isLoading, isError } = useGetScheduledInterview(page, filter);
  if (isLoading) return <Loader style="py-20" />;
  if (isError)
    return (
      <ErrorMsg ErrorMsg="No Data Availale Right Now Try Again Later . Thank You" />
    );

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

  return (
    <div>
      <div className="flex justify-between pb-3">
        <div className=" font-semibold">
          Total Interviews ({data?.count || 0})
        </div>
        {data?.count && (
          <div className="flex gap-1">
            <button
              onClick={handlePreviousPage}
              disabled={!data?.previous}
              className="bg-slate-200   px-1   disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
            >
              <IoIosArrowRoundBack />
            </button>
            {page}

            <button
              onClick={handleNextPage}
              disabled={!data?.next}
              className="bg-slate-200   px-1    disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
            >
              <IoIosArrowRoundForward />
            </button>
          </div>
        )}
      </div>
      <div className="">
        {data?.data?.length < 0 && (
          <div className="flex gap-4 mb-2">
            <button
              className={` bg-gray-400 text-sm md:text-base ${
                !filter && "!bg-btn-primary"
              } text-white px-4 rounded-md `}
              onClick={() => {
                setfilter(false);
              }}
            >
              All Interviews
            </button>
            <button
              onClick={() => setfilter(true)}
              className={`bg-gray-400 text-white px-4 rounded-md text-sm md:text-base ${
                filter == true && "!bg-btn-primary"
              }`}
            >
              Up Comming Interviews
            </button>
          </div>
        )}
        {data?.data?.length == 0 ? (
          <ErrorMsg ErrorMsg="No Interview Scheduled  " />
        ) : (
          <>
            <div className="w-full capitalize text-sm lg:text-base p-2 font-semibold bg-gray-200 rounded-t-md flex justify-between px-4">
              <div className="w-[25%]">name</div>
              <div className="w-[25%] hidden md:block"> type</div>
              <div className="w-[25%]  "> Interviewer</div>
              <div className="w-[25%]">Date / Time</div>
            </div>

            <div className="w-full overflow-x-auto max-h-[400px] overflow-y-auto  ">
              {data?.results?.data?.map((val, i) => {
                const formattedDate = moment
                  .utc(val?.date_time_start)
                  .local()
                  .format("MMM D, YYYY, h:mm A");

                return (
                  <div
                    className="flex justify-between  border-b text-sm lg:text-base w-full p-3 bg-gray-100"
                    key={i}
                  >
                    <div className="w-[25%] text-btn-primary flex items-center gap-2 font-bold ">
                      <NavLink
                        to={`/candidates/Candidate-Details/${val?.candidate_id}`}
                        className="w-[200px]"
                      >
                        {val.candidate_username}
                      </NavLink>
                    </div>
                    <div className="w-[25%] hidden md:block">
                      {val.interview_type.replace("_", " ")}
                    </div>
                    <div className="w-[25%]"> {val?.interviewer_name}</div>
                    <div className="w-[25%]">{formattedDate}</div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CandidatesInterviews;
