import { BiWorld } from "react-icons/bi";
import { FaCheck } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { RxCross2 } from "react-icons/rx";
import Adminfilters from "./Adminfilters";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { useAdminJobsLIsts } from "../../Services/admin/useAdminJobsLists";
import { useState } from "react";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { useDeleteJob } from "../../Services/Employer/useDeleteJob";
import MiniLoader from "../../UI/MiniLoader";

const AdminRejectedList = () => {
  const [page, setPage] = useState(1);
  const [deleteid, setdeleteid] = useState(null);
  const status = "rejected";
  const { data, isLoading, isError, isPending } = useAdminJobsLIsts({
    status,
    page,
  });
  const { mutate, isPending: deletepending } = useDeleteJob();
  //   const { mutate: JobApprove, isLoading: load } = useAdminJobApprove();
  if (isLoading) return <Loader style="h-screen  " />;
  if (data?.data?.results?.length == 0 || isError)
    return (
      <ErrorMsg ErrorMsg="No Data Availale Right Now Try Again Later . Thank You" />
    );
  const hanldeDelete = (id) => {
    setdeleteid(id);
    mutate(id, {
      onSuccess: () => setdeleteid(null),
      onError: () => setdeleteid(null),
    });
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
      <div className="font-bold uppercase">
        {" "}
        <div className="flex items-center w-full justify-between   pt-4 ">
          <div className="">
            <p className="  font-semibold text-sm">
              REJECTED JOBS ({data?.data?.count || 0})
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
      </div>

      {/* <Adminfilters /> */}
      {data?.data?.results?.map((val, i) => (
        <div
          key={i}
          className="flex flex-col md:flex-row gap-4 p-5 shadow-lg border-2 border-b
          hover:bg-slate-100 bg-white"
        >
          <div className="w-full md:w-1/3 flex flex-col gap-2">
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
            <div className="text-xs uppercase">
              status :{" "}
              <span className=" bg-red-600 px-1 text-white">{val?.status}</span>
            </div>
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
            <button
              disabled={deletepending}
              onClick={() => hanldeDelete(val.id)}
              className="text-xs font-semibold lg:px-2 xl:px-6 xl:py-3 px-6
               rounded-md py-3 border-2 bg-red-800 text-white  border-red-600 hover:text-white hover:bg-red-700"
            >
              {deletepending && val.id == deleteid ? (
                <MiniLoader color="border-red-500" />
              ) : (
                "Delete"
              )}
            </button>
            <NavLink to={`/admin/view-job/${val?.id}`} target="_blank">
              <button
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

export default AdminRejectedList;
