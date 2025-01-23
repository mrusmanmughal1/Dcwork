/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { useProfileDetailadmin } from "../Services/admin/useProfileDetailadmin";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "./Loader";
import ErrorMsg from "./ErrorMsg";
import { BASE_URL_FILE, BASE_URL_IMG } from "../config/Config";
import { FaCheck, FaFileAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { useDeleteProfile } from "../Services/admin/useDeleteProfile";
import MiniLoader from "./MiniLoader";
import { CANDIDATE } from "../utils/Constants";
import { useUserDeactiveReactive } from "../Services/admin/useUserDeactiveReactive";
const CandidateViewProfile = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useProfileDetailadmin(id);
  const { mutate: DeleteProfile, isPending } = useDeleteProfile();
  const [deleteid, setdeleteid] = useState(null);
  const [isChecked, setIsChecked] = useState("");
  const { mutate: Deactive, isPending: pendingDeactive } =
    useUserDeactiveReactive();
  const navigate = useNavigate();
  if (isLoading)
    return (
      <div className="pt-20">
        <Loader />
      </div>
    );
  if (isError)
    return (
      <ErrorMsg ErrorMsg="Unable To Fetch Data Please Try Again later !" />
    );
  const {
    first_name,
    last_name,
    email,
    id: candidateId,
    phone,
    candidate_about,
    dob,
    cvs,
    candidate_avatar_image,
    candidate_city,
    candidate_country,
    candidate_professional_skill,
    is_deactivated: deacive,
  } = data?.data?.data || {};

  const handleDownload = (val) => {
    if (val.file) {
      const url = BASE_URL_FILE + val.file;
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No CV available for download.");
    }
  };
  const handleDeactive = () => {
    setIsChecked(candidateId);
    Deactive(
      { id, is_deactivated: deacive ? false : true },

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
    setdeleteid(candidateId);
    DeleteProfile(
      { profile: CANDIDATE, id: candidateId },
      {
        onSuccess: () => {
          setdeleteid(null);
          navigate("/admin/deactive-users");
        },
        onError: () => setdeleteid(null),
      }
    );
  };
  return (
    <div className="bg-btn-primary py-8 px-4 lg:py-8">
      <div className="mx-auto w-11/12">
        <div className="flex flex-col md:flex-row justify-between text-white">
          <div className="mb-8 lg:mb-0 py-6 border-b w-full">
            <h1 className="font-semibold pb-2">Candidate Details</h1>
            <div className="flex flex-col md:flex-row justify-between w-full">
              {" "}
              <div className="w-full space-y-2">
                <h2 className="text-4xl pb-2">
                  {first_name} {last_name}
                </h2>
                <p>Candidate Id : {candidateId}</p>
                <p>Date of Birth : {dob}</p>
                <p>Email : {email}</p>
                <p>Phone : {phone}</p>
                <p>
                  {" "}
                  Address : {candidate_city} {candidate_country}
                </p>
                <div className="">
                  <p> Candidate Resumes</p>
                  <div className="">
                    <div className="flex gap-4  justify-center md:justify-start md:items-center flex-col lg:flex-row  ">
                      {cvs?.map((val, i) => {
                        return (
                          <button
                            onClick={() => handleDownload(val)}
                            className="    relative  border   p-3 gap-1 break-all   rounded-md hover:bg-purple-600 hover:text-white  flex flex-wrap  items-center my-2    whitespace-nowrap text-ellipsis"
                            key={val + i}
                          >
                            <div className="">
                              <FaFileAlt className="text-2xl" />
                            </div>
                            <div className="break-all">
                              {i + 1} .{" "}
                              {val?.file
                                ?.split("cvs")[1]
                                .slice(1)
                                .substring(0, 8)}
                              ...
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
                <p className=" ">
                  Professional Skills :{" "}
                  {candidate_professional_skill?.map((val, i) => (
                    <span className="text-gray-200" key={i}>
                      &nbsp; {val}
                      {i < candidate_professional_skill?.length - 1 && ","}
                    </span>
                  ))}
                </p>
              </div>
              <div className="w-full flex  flex-col md:items-end gap-4 ">
                <div className=" w-40 h-40 overflow-hidden">
                  <img
                    src={BASE_URL_IMG + candidate_avatar_image}
                    alt=""
                    className="object-contain h-full w-full"
                  />
                </div>
                <div className="  py-2 flex flex-col lg:gap-4">
                  <button
                    onClick={handleDeactive}
                    disabled={pendingDeactive || isPending}
                    className="uppercase bg-[#008000] w-52 p-2 flex items-center font-bold text-white rounded-md mb-4 lg:mb-0"
                  >
                    <FaCheck className=" mx-4" />
                    {isChecked == candidateId && pendingDeactive ? (
                      <MiniLoader color="border-green-400" />
                    ) : (
                      <>
                        {deacive == true && "Re-Activate"}{" "}
                        {deacive == false && "De-Active"}
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleDeleteUser}
                    disabled={isPending || pendingDeactive}
                    className="uppercase bg-red-600 flex items-center w-52 font-bold text-white rounded-md p-2 "
                  >
                    <RxCross2 className=" font-extrabold mx-4 " />
                    {deleteid == candidateId && isPending ? (
                      <MiniLoader color="border-red-700" />
                    ) : (
                      "Delete User"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="md:flex justify-between items-center leading-loose">
          <div className="text-white flex flex-col   text-lg lg:text-xl pt-4  ">
            <div>
              <p className="font-semibold pb-4">About Candidate</p>
              <p className="text-base"> {candidate_about} </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateViewProfile;
