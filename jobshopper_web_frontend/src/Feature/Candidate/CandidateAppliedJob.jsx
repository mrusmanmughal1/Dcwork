import { FaEarthAmericas } from "react-icons/fa6";
import { useCandidateHistory } from "../../Services/Candidate/useCandidateHistory";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { NavLink } from "react-router-dom";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useState } from "react";
const CandidateAppliedJob = () => {
  const [page, setPage] = useState(1);

  const { data, isloading, isError } = useCandidateHistory(page);
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

  if (isloading) return <Loader style="  py-20" />;
  if (isError)
    return <ErrorMsg ErrorMsg="Try Again Later Unable To fetch Data !" />;

  if (data?.data?.results?.length == 0)
    return <ErrorMsg ErrorMsg="Your job applications list is currently empty. You have not applied for any jobs yet." />;
  return (
    <div className="">
      <div className="flex items-center w-full justify-between    pb-4 ">
        <div className="">
          <p className="  font-semibold text-sm">
            Total Jobs Available ({data?.data?.count || 0})
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handlePreviousPage}
            disabled={!data?.data?.previous}
            className="bg-slate-200   px-1   disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
          >
            <IoIosArrowRoundBack />
          </button>

          {page}
          <button
            onClick={handleNextPage}
            disabled={!data?.data?.next}
            className="bg-slate-200   px-1    disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
          >
            <IoIosArrowRoundForward />
          </button>
        </div>
      </div>
      <div className="rounded-md border ">
        <div className="overflow-x-auto">
          <table className="min-w-full ">
            <thead className="bg-gray-200">
              <tr className="   table-row">
                <th className="text-left p-2">Job Title</th>
                <th className="text-left p-2">Contract Type</th>
                <th className="text-center p-2">Date</th>
                <th className="text-center p-2 ">Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.results?.map((val, i) => {
                const date = new Date(val?.applied_at);
                const formattedDate = date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                // Format date and time
                return (
                  <tr
                    key={val.id}
                    className="  md:table-row border-b hover:bg-gray-100"
                  >
                    <td className="flex flex-col p-4 md:table-cell">
                      <NavLink
                        className="font-semibold text-sm md:text-base capitalize"
                        to={`/job-Details/${val?.job_id}`}
                      >
                        {val?.title}
                      </NavLink>
                      <div className="flex items-center gap-2 text-xs">
                        <FaEarthAmericas />
                        {val?.remote ? (
                          <span>{val?.hybrid ? "Hybrid" : "Remote"}</span>
                        ) : (
                          val?.addresses?.map((address, ind) => (
                            <span key={ind}>
                              {address?.state}
                              {ind < val?.addresses?.length - 1 && ","}
                            </span>
                          ))
                        )}
                      </div>
                    </td>
                    <td className="text-btn-primary pe-4 text-xs md:text-sm p-4 md:table-cell">
                      {val?.contract_type.replace("_", " ")}
                    </td>
                    <td className="  text-xs md:text-sm p-2 text-center  italic text-gray-500 md:table-cell">
                      {formattedDate}
                    </td>

                    <td className=" text-center text-xs md:text-sm p-2  ">
                      <button
                        className={`${
                          val?.app_status === "pending"
                            ? "bg-yellow-500"
                            : val?.app_status === "rejected"
                            ? "bg-red-500"
                            : "bg-green-400"
                        } md:px-6 px-2 text-white text-sm py-2 rounded-md capitalize`}
                      >
                        {val?.app_status}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* <JobStatusIndicator /> */}
      </div>
    </div>
  );
};

export default CandidateAppliedJob;
