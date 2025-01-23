import { BiWorld } from "react-icons/bi";
import { NavLink } from "react-router-dom";
import Adminfilters from "./Adminfilters";
import { useAllCandidates } from "../../Services/Candidate/useCandidateList";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { BASE_URL_FILE, BASE_URL_IMG } from "../../config/Config";
import { useDeleteProfile } from "../../Services/admin/useDeleteProfile";
import { CANDIDATE } from "../../utils/Constants";
import MiniLoader from "../../UI/MiniLoader";
import { useState } from "react";
import { MdDeleteForever } from "react-icons/md";
import { useUserDeactiveReactive } from "../../Services/admin/useUserDeactiveReactive";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { MdLockOutline } from "react-icons/md";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
const AdminCandidateList = () => {
  const [Loading_ID, setLoading_id] = useState();
  const [isChecked, setIsChecked] = useState();
  const [page, setPage] = useState(1);

  const { data, isLoading, status, isError } = useAllCandidates(page);
  const { mutate: DeleteProfile, isPending } = useDeleteProfile();
  const { mutate: Deactive, isPending: pendingDeactive } =
    useUserDeactiveReactive();
  if (isLoading) return <Loader style=" py-20" />;

  if (data?.data?.results?.length == 0 || isError)
    return (
      <ErrorMsg ErrorMsg="No Data Availale Right Now Try Again Later . Thank You" />
    );
  const url =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

  const handleDelete = (id) => {
    setLoading_id(id);
    const profile = CANDIDATE;
    DeleteProfile({ profile, id });
  };

  const handleDeactive = (id) => {
    setIsChecked(id);
    Deactive({ id, is_deactivated: true });
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
      <div className="flex items-center w-full justify-between   ">
        <div className="">
          <p className="  uppercase font-semibold text-sm">
            Candidates List ({data?.data?.count || 0})
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
      {data?.data?.results?.map((candidate, i) => {
        const date = new Date(candidate.date_joined);
        const formattedDate = date.toLocaleDateString();
        return (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-4 p-5 shadow-lg border-2 border-b
          hover:bg-slate-100 bg-white"
          >
            <div className="w-full md:w-4/3 flex flex-col gap-4">
              <div className="flex gap-6 items-center">
                <div className=" rounded-full">
                  <img
                    src={
                      candidate.candidate_avatar_image
                        ? BASE_URL_IMG + candidate.candidate_avatar_image
                        : url
                    }
                    alt=""
                    className="w-16 h-16 object-contain"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="uppercase font-bold">{candidate.username}</p>
                  <p className="text-xs flex gap-2 items-center">
                    <BiWorld /> {candidate.candidate_country}
                  </p>
                  <p className="text-xs">
                    {" "}
                    <span className="font-bold"> Date Joined</span> :{" "}
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full flex justify-end gap-4 md:flex-row md:items-center text-purple-900">
              <NavLink to={`/admin/candidates/view-candidate-profile/${candidate.id}`}  target="_blank">
                <button
                  className="text-xs font-semibold lg:px-2 xl:px-6 xl:py-3 px-6
               rounded-md py-3 border-2 border-primary-green hover:text-white hover:bg-primary-green"
                >
                  VIEW PROFILE
                </button>
              </NavLink>
              <div data-tooltip-id="Deactive">
                <button
                  disabled={pendingDeactive}
                  onClick={() => handleDeactive(candidate.id)}
                  className="text-2xl   font-semibold  hover:bg-slate-300   p-2
               rounded-md   border-2 "
                >
                  {pendingDeactive && isChecked == candidate.id ? (
                    <MiniLoader />
                  ) : (
                    <MdLockOutline />
                  )}
                </button>
              </div>
              <button
                onClick={() => handleDelete(candidate.id)}
                className="   font-semibold    p-2
               rounded-md   border-2 text-red-700 hover:bg-red-800 hover:text-white"
              >
                {isPending && Loading_ID == candidate.id ? (
                  <MiniLoader color="border-red-400" />
                ) : (
                  <MdDeleteForever
                    data-tooltip-id="Delete"
                    className="text-2xl"
                  />
                )}
              </button>
            </div>
          </div>
        );
      })}
      <ReactTooltip
        id="Deactive"
        place="bottom"
        content="De-Active This User"
      />
      <ReactTooltip id="Delete" place="bottom" content="Delete This User" />
    </div>
  );
};

export default AdminCandidateList;
