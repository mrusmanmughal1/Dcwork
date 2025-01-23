import { BiWorld } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import Loader from "../../UI/Loader";
import { useAdminJobApprove } from "../../Services/admin/useAdminJobApprove";
import ErrorMsg from "../../UI/ErrorMsg";
import { useAdminJobsLIsts } from "../../Services/admin/useAdminJobsLists";
import MiniLoader from "../../UI/MiniLoader";
import { useState } from "react";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";

const PendingJobs = () => {
  const [page, setPage] = useState(1);

  const status = "pending";
  const { data, isLoading, isError } = useAdminJobsLIsts({
    status,
    page,
  });
  const [approved, setApprovingId] = useState(null);
  const [reject, setRejectingId] = useState(null);

  const { mutate: JobApprove, isPending: load } = useAdminJobApprove();
  if (isLoading) return <Loader style="h-screen  " />;
  if (data?.data?.results?.length == 0 || isError)
    return (
      <ErrorMsg ErrorMsg="No Data Availale Right Now Try Again Later . Thank You" />
    );

  const handleApprove = (id) => {
    setApprovingId(id);
    JobApprove(
      { id, payload: "approve" },
      {
        onSuccess: () => setApprovingId(null),
        onError: () => setApprovingId(null),
      }
    );
  };

  const handleReject = (id) => {
    setRejectingId(id);
    JobApprove(
      { id, payload: "reject" },
      {
        onSuccess: () => setRejectingId(null),
        onError: () => setRejectingId(null),
      }
    );
  };
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
    <div className="flex flex-col gap-4">
      <div className="flex items-center w-full justify-between   pt-4 ">
        <div className="">
          <p className="  font-semibold text-sm">
            PENDING JOBS ({data?.data?.count || 0})
          </p>
        </div>
        <div className="flex gap-1">
          <button
            onClick={handlePreviousPage}
            disabled={!data?.data?.previous}
            className="bg-slate-200   p-2   disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
          >
            <IoIosArrowRoundBack />
          </button>
          <div className="flex items-center px-1">{page}</div>
          <button
            onClick={handleNextPage}
            disabled={!data?.data?.next}
            className="bg-slate-200   p-2    disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
          >
            <IoIosArrowRoundForward />
          </button>
        </div>
      </div>

      {/* <Adminfilters /> */}
      {data?.data?.results?.map((val, id) => (
        <div
          key={id}
          className="flex flex-col md:flex-row gap-4 p-5 shadow-lg border-2 border-b
          hover:bg-slate-100 bg-white"
        >
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            <p className="uppercase font-bold">{val?.title}</p>

            {val?.remote ? (
              <p className="text-xs font-semibold flex  items-center  gap-1">
                {" "}
                <BiWorld /> Remote{" "}
              </p>
            ) : (
              <p className="text-xs flex gap-2 items-center">
                <BiWorld />{" "}
                {val?.addresses?.slice(0, 2).map((v, id) => (
                  <span className="font-medium" key={id}>
                    {v?.city}
                    {id < val?.addresses?.length - 1 && ","}
                  </span>
                ))}
              </p>
            )}
          </div>
          <div className="w-full md:w-1/3 text-sm p-2 font-bold">
            <p>
              Salary : <span className="text-sm font-medium">{val?.rate}</span>{" "}
            </p>
            <p>
              Job Type :{" "}
              <span className="font-medium">
                {val?.contract_type.replace("_", " ")}
              </span>
            </p>
          </div>
          <div className="md:w-1/3 w-full flex justify-end gap-4 md:flex-row md:items-center text-purple-900">
            <div className="flex gap-4">
              <button
                disabled={load}
                onClick={() => handleApprove(val.id)}
                className="flex  bg-green-700 font-bold flex-col items-center
               px-6 rounded-md py-[0.30rem] border-2 border-green-700 text-white hover:bg-green-700"
              >
                {approved === val.id ? (
                  <MiniLoader color={"border-green-200"} />
                ) : (
                  <FaCheck />
                )}
              </button>
              <button
                disabled={load}
                onClick={() => handleReject(val.id)}
                className="bg-red-600 px-6 py-[0.30rem] font-bold text-white text-xl rounded-md"
              >
                {reject === val.id ? (
                  <MiniLoader color={"border-red-200"} />
                ) : (
                  <RxCross2 />
                )}
              </button>
            </div>
            <NavLink to={`/admin/view-job/${val.id}`} target="_blank">
              <button
                disabled={load}
                className="text-xs font-semibold lg:px-2 xl:px-6 xl:py-3 px-6
               rounded-md py-3 border-2 border-purple-900 hover:text-white hover:bg-purple-900"
              >
                VIEW
              </button>
            </NavLink>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingJobs;
