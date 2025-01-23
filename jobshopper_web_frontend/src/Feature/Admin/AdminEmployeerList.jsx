import { NavLink } from "react-router-dom";
import { useAllEmployer } from "../../Services/admin/useAllEmployer";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { BASE_URL_IMG } from "../../config/Config";
import { useDeleteProfile } from "../../Services/admin/useDeleteProfile";
import { useState } from "react";
import { EMPLOYER } from "../../utils/Constants";
import MiniLoader from "../../UI/MiniLoader";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useUserDeactiveReactive } from "../../Services/admin/useUserDeactiveReactive";
import { MdLockOutline } from "react-icons/md";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { validate } from "uuid";

const AdminEmployeerList = () => {
  const [Loading_ID, setLoading_id] = useState();
  const [isChecked, setIsChecked] = useState();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAllEmployer(page);

  const { mutate: DeleteProfile, isPending } = useDeleteProfile();
  const { mutate: Deactive, isPending: pendingDeactive } =
    useUserDeactiveReactive();
  if (isLoading) return <Loader style="h-screen py-20" />;

  if (data?.data?.results?.length == 0)
    return (
      <ErrorMsg ErrorMsg="No Data Availale Right Now Try Again Later . Thank You" />
    );
  const img =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
  const handleDelete = (id) => {
    setLoading_id(id);
    const profile = EMPLOYER;
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
            Employers List ({data?.data?.count || 0})
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

      {data?.data?.results?.map((Employee, i) => {
        const date = new Date(Employee?.date_joined);
        const formattedDate = date.toLocaleDateString();
        return (
          <div
            key={i}
            className="flex flex-col md:flex-row gap-4 p-5 shadow-lg border-2 border-b 
          hover:bg-slate-100 bg-white"
          >
            <div className="w-full md:w-4/3 flex flex-col gap-4">
              <div className="flex gap-6 items-center">
                <div className=" overflow-hidden">
                  <img
                    src={
                      Employee.company_image
                        ? BASE_URL_IMG + Employee?.company_image
                        : img
                    }
                    className="w-16 h-16 object-contain "
                    alt=""
                  />
                </div>
                <div className="">
                  <p className="uppercase font-bold">{Employee.username}</p>
                  <p className="text-xs flex gap-2 items-center">
                    <span className="font-semibold">Date Joined</span>:
                    {formattedDate}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full flex justify-end gap-4 md:flex-row md:items-center text-purple-900">
              <NavLink
                to={`/admin/employeers/view-employeer-profile/${Employee.id}`}
                target="_blank"
              >
                <button
                  className="text-xs font-semibold lg:px-2 xl:px-6 xl:py-3 px-6
               rounded-md py-3 border-2 border-primary-green hover:text-white hover:bg-primary-green"
                >
                  VIEW PROFILE
                </button>
              </NavLink>
              <div>
                <button
                  disabled={pendingDeactive}
                  onClick={() => handleDeactive(Employee.id)}
                  data-tooltip-id="Deactive"
                  className="text-2xl   font-semibold    p-2
               rounded-md   border-2 "
                >
                  {pendingDeactive && isChecked == Employee.id ? (
                    <MiniLoader />
                  ) : (
                    <MdLockOutline />
                  )}
                </button>
              </div>
              <button
                onClick={() => handleDelete(Employee.id)}
                className="text-xs   font-semibold    p-2
               rounded-md   border-2 text-red-700 hover:bg-red-800 hover:text-white"
              >
                {isPending && Loading_ID == Employee.id ? (
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

export default AdminEmployeerList;
