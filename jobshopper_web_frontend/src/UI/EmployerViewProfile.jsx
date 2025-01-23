import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useEmployeeProfile } from "../Services/admin/useEmployeeProfile";
import { BASE_URL, BASE_URL_IMG } from "../config/Config";
import { FaCheck } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useUserDeactiveReactive } from "../Services/admin/useUserDeactiveReactive";
import pic from "../assets/Profile-picture.png";
import Loader from "./Loader";
import MiniLoader from "./MiniLoader";
import { useDeleteProfile } from "../Services/admin/useDeleteProfile";
import { EMPLOYER } from "../utils/Constants";

const EmployerViewProfile = () => {
  const { id } = useParams();
  const { data, isLoading } = useEmployeeProfile(id);
  const { mutate: DeleteProfile, isPending } = useDeleteProfile();
  const [deleteid, setdeleteid] = useState(null);

  const [isChecked, setIsChecked] = useState("");
  const { mutate: Deactive, isPending: pendingDeactive } =
    useUserDeactiveReactive();
  const navigate = useNavigate();

  if (isLoading) return <Loader />;
  const {
    id: EMPID,
    about,
    avatar_image,
    email,
    first_name,
    last_name,
    phone,
    website,
    company_size,
    license_number,
    license_image,
    is_deactivated,
  } = data?.data?.data || {};
  const handleDeactive = () => {
    setIsChecked(EMPID);
    Deactive(
      { id, is_deactivated: is_deactivated ? false : true },

      {
        onSuccess: () => {
          setdeleteid(null);
          navigate("/admin/deactive-users");
        },
        onError: () => setdeleteid(null),
      }
    );
  };
  const handleDeleteUser = () => {
    setdeleteid(EMPID);
    DeleteProfile(
      { profile: EMPLOYER, id: EMPID },
      {
        onSuccess: () => {
          setdeleteid(null);
          navigate("/admin/employeers");
        },
        onError: () => setdeleteid(null),
      }
    );
  };
  const handleDownload = () => {
    const url = BASE_URL + license_image;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = "doc.pdf"; // Set the filename you want
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloaddoc = () => {
    const url = BASE_URL + license_image;
    const link = document.createElement("a");
    link.href = url;
    link.target = "_blank";
    link.download = "CV.pdf"; // Set the filename you want
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <div className="bg-btn-primary py-8  ">
      <div className="mx-auto w-11/12">
        <div className="flex flex-col md:flex-row justify-between text-white">
          <div className="mb-8 lg:mb-0 py-6 border-b w-full">
            <h1 className="text-xl font-semibold pb-2">Employer Details</h1>
            <h2 className="text-4xl">
              {first_name} {last_name}
            </h2>
            <p>Email : {email}</p>
            <p>Phone : {phone}</p>
            <p>Website : {website}</p>
            <p>Company Size : {company_size}</p>
            <p> Lisence No : {license_number}</p>
            <div className="">
              <p>Lisence Document </p>
              <button
                onClick={handleDownload}
                className=" border p-2  mt-2 cursor-pointer"
              >
                {license_image ? "Download Document" : "No Document Found"}
              </button>
            </div>
          </div>
          <div className="w-full flex  flex-col items-end justify-end">
            <div className="w-52 h-52 overflow-hidden flex items-center justify-center border">
              <img
                src={avatar_image ? BASE_URL_IMG + avatar_image : pic}
                alt=""
                className="w-full h-full object-contain"
              />
            </div>
            <div className="  py-2 flex flex-col lg:gap-4">
              <button
                onClick={handleDeactive}
                disabled={pendingDeactive || isPending}
                className="uppercase bg-[#008000] w-52 p-2 flex items-center font-bold text-white rounded-md mb-4 lg:mb-0"
              >
                <FaCheck className=" mx-4" />
                {pendingDeactive && isChecked == EMPID ? (
                  <MiniLoader />
                ) : (
                  <>
                    {is_deactivated == true && "Re-Activate"}{" "}
                    {is_deactivated == false && "De-Active"}
                  </>
                )}
              </button>

              <button
                onClick={handleDeleteUser}
                disabled={isPending || pendingDeactive}
                className="uppercase bg-red-600 flex items-center w-52 font-bold text-white rounded-md p-2 "
              >
                <RxCross2 className=" font-extrabold mx-4 " />
                {isPending && deleteid == EMPID ? (
                  <MiniLoader color="border-red-400" />
                ) : (
                  "Delete User"
                )}
              </button>
            </div>
          </div>
        </div>
        <div className="md:flex justify-between items-center leading-loose">
          <div className="text-white flex flex-col  py-4">
            <p className="font-semibold text-2xl">About </p>
            <p className="text-base">{about}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployerViewProfile;
