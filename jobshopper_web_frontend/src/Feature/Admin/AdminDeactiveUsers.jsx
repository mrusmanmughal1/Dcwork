import { BiWorld } from "react-icons/bi";
import { BASE_URL_IMG } from "../../config/Config";
import { useGetDeactiveUsers } from "../../Services/admin/useGetDeactiveUsers";
import { NavLink, useNavigate } from "react-router-dom";
import MiniLoader from "../../UI/MiniLoader";
import { MdDeleteForever } from "react-icons/md";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useState } from "react";
import { useDeleteProfile } from "../../Services/admin/useDeleteProfile";
import { useUserDeactiveReactive } from "../../Services/admin/useUserDeactiveReactive";
import { IoLockOpenOutline } from "react-icons/io5";
import Loader from "../../UI/Loader";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import { CANDIDATE, EMPLOYER } from "../../utils/Constants";
const AdminDeactiveUsers = () => {
  const [accountType, setaccountType] = useState(" ");
  const [isChecked, setIsChecked] = useState("");
  const [page, setPage] = useState(1);
  const [deleteid, setdeleteid] = useState(null);
  const navigate = useNavigate();
  const { mutate: DeleteProfile, isPending } = useDeleteProfile();
  const { mutate: Deactive, isPending: pendingDeactive } =
    useUserDeactiveReactive();
  const { data, isPending: loadDeactive } = useGetDeactiveUsers(accountType);
  const url =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png";
  if (loadDeactive) return <Loader style=" py-20" />;

  const handleDeleteUser = (type, id) => {
    setdeleteid(id);
    DeleteProfile(
      { profile: type, id: id },
      {
        onSuccess: () => setdeleteid(null),
        onError: () => setdeleteid(null),
      }
    );
  };

  const hanldeNavigation = (type, id) => {
    const url =
      type === CANDIDATE
        ? `/admin/candidates/view-candidate-profile/${id}`
        : `/admin/employeers/view-employeer-profile/${id}`;

    // Open the URL in a new tab
    window.open(url, "_blank");
  };
  const handleDeactive = (id) => {
    setIsChecked(id);
    Deactive({ id, is_deactivated: false });
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
    <div>
      <div className="flex flex-col gap-4">
        <div className="font-bold uppercase">
          <div className="flex items-center w-full justify-between   ">
            <div className="">
              <p className="  uppercase font-semibold text-sm">
                De-Active Users ({data?.data?.count || 0})
              </p>
            </div>
            <div className="flex gap-1">
              <button
                onClick={handlePreviousPage}
                disabled={!data?.data?.results?.previous}
                className="bg-slate-200   p-2   disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
              >
                <IoIosArrowRoundBack />
              </button>
              <div className="flex items-center px-1">{page}</div>
              <button
                onClick={handleNextPage}
                disabled={!data?.data?.results?.next}
                className="bg-slate-200   p-2    disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
              >
                <IoIosArrowRoundForward />
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-md flex">
          <div className="shadow-md rounded-md overflow-hidden">
            <button
              onClick={() => setaccountType(" ")}
              className={`  p-2 border-r  ${
                accountType == " " ? "bg-btn-primary text-white" : "bg-white"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setaccountType("candidate")}
              className={`  p-2 border-r  ${
                accountType == "candidate"
                  ? "bg-btn-primary text-white"
                  : "bg-white"
              }`}
            >
              Candidates
            </button>
            <button
              onClick={() => setaccountType("employer")}
              className={`  p-2 border-r  ${
                accountType == "employer"
                  ? "bg-btn-primary text-white"
                  : "bg-white"
              }`}
            >
              Employers
            </button>
          </div>
        </div>

        {data?.data?.results?.data?.map((v, i) => {
          const date = new Date(v.date_joined);
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
                        v.company_image
                          ? BASE_URL_IMG + v?.company_image
                          : v?.candidate_avatar_image
                          ? BASE_URL_IMG + v?.candidate_avatar_image
                          : url
                      }
                      alt=""
                      className="w-24 h-24"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <p className="uppercase font-bold">
                      {v?.username}{" "}
                      <span className="text-xs font-medium">
                        ({v.account_type})
                      </span>
                    </p>
                    <p className="text-xs flex gap-2 items-center">
                      <BiWorld /> Lahore , Pakistan
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
                <button
                  onClick={() => hanldeNavigation(v.account_type, v.id)}
                  className="text-xs font-semibold lg:px-2 xl:px-6 xl:py-3 px-6
               rounded-md py-3 border-2 border-primary-green hover:text-white hover:bg-primary-green"
                >
                  VIEW PROFILE
                </button>

                <div className="hover:bg-gray-300">
                  <button
                    disabled={pendingDeactive}
                    onClick={() => handleDeactive(v.id)}
                    data-tooltip-id="reactive"
                    className="text-2xl   font-semibold    p-2
               rounded-md   border-2 "
                  >
                    {pendingDeactive && isChecked == v.id ? (
                      <MiniLoader />
                    ) : (
                      <IoLockOpenOutline />
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleDeleteUser(v.account_type, v.id)}
                  data-tooltip-id="delete"
                  disabled={isPending}
                  // onClick={() => handleDelete(v.id)}
                  className="text-xs   font-semibold    p-2
               rounded-md   border-2 text-red-700 hover:bg-red-800 hover:text-white"
                >
                  {isPending && deleteid == v.id ? (
                    <MiniLoader color="border-red-400" />
                  ) : (
                    <MdDeleteForever className="text-2xl" />
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <ReactTooltip
        id="reactive"
        place="bottom"
        content="Re-Active This User"
      />
      <ReactTooltip id="delete" place="bottom" content="Delete This User" />
    </div>
  );
};

export default AdminDeactiveUsers;
