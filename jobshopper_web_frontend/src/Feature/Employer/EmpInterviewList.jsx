import {
  useDeleteInterview,
  useGetScheduledInterview,
} from "../../Services/Employer/useGetScheduledInterviews";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import moment from "moment";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { MdDelete } from "react-icons/md";
import { GrUpdate } from "react-icons/gr";
import MiniLoader from "../../UI/MiniLoader";
import Model from "../../Reuseables/Model";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import InterviewReschedule from "../InterviewModule/InterviewReschedule";

const EmpInterviewList = () => {
  const queryClient = useQueryClient();
  const [model, setmodel] = useState(false);
  const [page, setPage] = useState(1);
  const [filter, setfilter] = useState(false);
  const [deleteid, setdeleteid] = useState(null);
  const [interview, setinterview] = useState([]);
  const { data, isLoading, isError } = useGetScheduledInterview(page, filter);
  const { mutate, isPending: deletpending } = useDeleteInterview();
  if (isLoading) return <Loader style="py-20" />;
  if (isError)
    return (
      <ErrorMsg ErrorMsg="No Data Availale Right Now Try Again Later . Thank You" />
    );

  if (data?.data?.length === 0)
    return (
      <ErrorMsg ErrorMsg="No Interview Is  Scheduled  Right Now , Please Schedule An Interview First . " />
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
  const handleReschedule = (val) => {
    setmodel(true);
    setinterview(val);
  };

  const handledelete = (id) => {
    setdeleteid(id);

    mutate(
      { id },

      {
        onSuccess: () => {
          // Optionally show a success message or perform additional actions
          toast.success("Interview deleted successfully!", { id: "ok" });
          setdeleteid(null);
          queryClient.invalidateQueries(["Interviews"]);
        },
        onError: () => {
          toast.error("Unable To Delete Try Later!", { id: "scheduled" });

          setdeleteid(null);
        },
      }
    );
  };
  return (
    <div>
      <div className="flex justify-between pb-3">
        <div className=" font-semibold">
          Total Interviews ({data?.count || 0})
        </div>
        {data?.count > 0 && (
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
        {data?.data?.length == 0 ? (
          <ErrorMsg ErrorMsg="No Interview Scheduled . Schedule an Interview First." />
        ) : (
          <>
            <div className="w-full capitalize text-sm lg:text-base p-2 font-semibold bg-gray-200 rounded-t-md flex justify-between px-4">
              <div className="w-[25%]">name</div>
              <div className="w-[25%]"> type</div>
              <div className="w-[25%] hidden md:block"> Interviewer</div>
              <div className="w-[25%]">Date / Time</div>
              <div className="w-[25%] text-center">Actions</div>
            </div>

            <div className="w-full overflow-x-auto min-h-[400px] overflow-y-auto  ">
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
                    <div className="w-[25%] text-btn-primary flex items-center gap-2 font-bold">
                      <NavLink
                        to={`/candidates/Candidate-Details/${val?.candidate_id}`}
                      >
                        {val.candidate_username}{" "}
                      </NavLink>
                    </div>
                    <div className="w-[25%] hidden md:block">
                      {" "}
                      {val.interview_type.replace("_", " ")}
                    </div>
                    <div className="w-[25%]"> {val?.interviewer_name}</div>
                    <div className="w-[25%]">{formattedDate}</div>
                    <div className="w-[25%] text-center flex justify-center">
                      <button
                        disabled={deletpending}
                        onClick={() => handleReschedule(val)}
                      >
                        <GrUpdate className="text-xl mx-2" />
                      </button>

                      <button
                        onClick={() => handledelete(val.id)}
                        className="text-red-700"
                      >
                        {deletpending && deleteid == val.id ? (
                          <MiniLoader color="border-red-700" />
                        ) : (
                          <MdDelete className="text-xl" />
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <Model model={model}>
        <InterviewReschedule interview={interview} setmodel={setmodel} />
      </Model>
    </div>
  );
};

export default EmpInterviewList;
