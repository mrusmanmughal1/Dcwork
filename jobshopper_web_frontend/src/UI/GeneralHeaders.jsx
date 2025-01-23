import { useEffect, useState } from "react";
import { useUserinfo } from "../Context/AuthContext";
import Model from "../Reuseables/Model";

import Annoucmentbar from "./Annoucmentbar";
import Navbar from "./Navbar";
import { FaLongArrowAltRight } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import useCandidateValidation from "../helpers/validate/useCandidateValidation";
import useEmployerValidation from "../helpers/validate/useEmployerValidation ";
import { CANDIDATE, EMPLOYER } from "../utils/Constants";
const GeneralHeaders = () => {
  const { user_type, auth } = useUserinfo();
  const [profileModal, setProfileModal] = useState({
    type: null,
    visible: false,
    model: true,
  });
  const { candidateAllData, loadingCandidate } = useCandidateValidation();
  const { employerAllData, loadingEmployer } = useEmployerValidation();
  useEffect(() => {
    if (!candidateAllData && !loadingCandidate && user_type == CANDIDATE) {
      setProfileModal({ type: CANDIDATE, visible: true, model: true });
    } else if (!employerAllData && !loadingEmployer && user_type == EMPLOYER) {
      setProfileModal({ type: EMPLOYER, visible: true, model: true });
    } else {
      setProfileModal({ type: null, visible: false, model: false });
    }
  }, [
    candidateAllData,
    loadingCandidate,
    employerAllData,
    loadingEmployer,
    auth,
    user_type,
  ]);
  const sendTo =
    user_type == "employer"
      ? "/employer-dashboard/profile"
      : "/dashboard/profile";
  const navigate = useNavigate();
  const handleClick = () => {
    setProfileModal((res) => ({ ...res, model: false }));
    navigate(sendTo);
  };

  const shouldShowCandidateBanner =
    profileModal.type == CANDIDATE && profileModal.visible;
  const shouldShowEmployerBanner =
    profileModal.type == EMPLOYER && profileModal.visible;

  const message = shouldShowCandidateBanner
    ? " Please Complete Your Profile and Apply for Jobs"
    : "Complete Your Profile And Post Job and Serch For Candidates .";
  return (
    <div>
      <Annoucmentbar />
      <Navbar />
      {shouldShowCandidateBanner ? (
        <div className="py-4 flex  flex-col md:flex-row justify-center items-center capitalize  font-semibold  bg-primary-green text-center text-white">
          Please Complete Your Profile to Apply for a Job.
          <NavLink to={sendTo} className="flex items-center gap-2">
            Visit your Profile to get started <FaLongArrowAltRight />
          </NavLink>
        </div>
      ) : null}
      {shouldShowEmployerBanner || shouldShowCandidateBanner ? (
        <div className="">
          <Model
            model={profileModal.model}
            key={profileModal.model}
            index={1999}
          >
            <ModelMesssage
              employerAllData={employerAllData}
              message={message}
              onClose={() =>
                setProfileModal((res) => ({ ...res, model: false }))
              }
              handleClick={handleClick}
            />
          </Model>
        </div>
      ) : null}
      {/* Only show this message if the user is an employer, data has loaded, and required fields are missing */}
      {shouldShowEmployerBanner ? (
        <div className="">
          <div className="py-4 font-bold  flex justify-center items-center   bg-primary-green text-center text-white">
            Complete Your Profile And Post Your Job And Search For Candidates
            <NavLink to={sendTo} className="flex items-center gap-2">
              &nbsp; Visit your Profile <FaLongArrowAltRight />
            </NavLink>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default GeneralHeaders;

export const ModelMesssage = ({ message, handleClick, onClose }) => {
  return (
    <div className=" text-black p-5 py-8  flex flex-col gap-4     ">
      <div className="bg-slate-100 pb-4">
        <p className="text-center text-2xl pt-4 text-btn-primary font-semibold  ">
          Welcome{" "}
        </p>
        <p className="text-center text-btn-primary">{message}</p>
      </div>
      <div className="flex justify-between">
        <button
          onClick={() => handleClick()}
          className="bg-btn-primary text-white md:p-3 px-4 rounded-md"
        >
          Manage Profile
        </button>
        <button
          onClick={() => onClose()}
          className=" p-2 md:p-3 bg-slate-500 hover:bg-gray-700 text-white rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};
