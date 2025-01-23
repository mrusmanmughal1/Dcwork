import barComp from "../../assets/CandidateBars/4.png";
import { NavLink, useNavigate } from "react-router-dom";
import { useCandidateDetails } from "../../Services/Candidate/useCandidateDetails";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { FaArrowLeft, FaRegEdit } from "react-icons/fa";
import { IoIosAddCircle } from "react-icons/io";
import { useState } from "react";
import { MdDeleteOutline } from "react-icons/md";
import AddEducation from "./EducationExperience/AddEducation";
import Model from "../../Reuseables/Model";
import AddWorkExperience from "./EducationExperience/AddWorkExperience";
import { BsBuildings } from "react-icons/bs";
import { useCandidateManageProfile } from "../../Services/Candidate/CandidateManageProfile";
import MiniLoader from "../../UI/MiniLoader";
import { LuGraduationCap } from "react-icons/lu";
import { GrCertificate } from "react-icons/gr";
import AddCertificate from "./EducationExperience/AddCertificate";
import moment from "moment";
const CandidateEduJobHistory = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    currentData: null,
    modelType: null,
  });
  const [delID, setdelID] = useState(null);
  const {
    mutate: updateProfile,
    isPending,
    isError: errorProfile,
  } = useCandidateManageProfile();

  const navigate = useNavigate();
  const { data, isLoading: loadingDetails, isError } = useCandidateDetails();

  const {
    candidate_work_experiences,
    candidate_educations,
    candidate_certificates,
  } = data?.data?.data || {};

  const handleDeleteEducation = (Del_id) => {
    setdelID(Del_id);
    if (candidate_educations) {
      // Append the filtered education data to the FormData object

      updateProfile({ delete_education_id: Del_id });
      setdelID(null);
    }
  };

  const handleDeleteExp = (Del_id) => {
    setdelID(Del_id);
    if (candidate_educations) {
      // Append the filtered education data to the FormData object

      updateProfile({ delete_work_experience_id: Del_id });
      setdelID(null);
    }
  };
  const handleDeleteCertificate = (Del_id) => {
    setdelID(Del_id);
    if (candidate_educations) {
      // Append the filtered education data to the FormData object

      updateProfile({ delete_certificate_id: Del_id });
      setdelID(null);
    }
  };

  if (loadingDetails) return <Loader style="py-20 " />;
  if (isError)
    return (
      <ErrorMsg ErrorMsg="Sorry! Unable to fetch data right now. Please try again later." />
    );

  const handleOpenModal = (type, data = null) => {
    setModalState({ isOpen: true, currentData: data, modelType: type });
  };

  const handleCloseModal = () => {
    setModalState({ isOpen: false, currentData: null, modelType: null });
  };
  return (
    <div>
      <p className="text-center text-btn-primary pb-4 font-semibold">
        Enter Your Education and Work Experience
      </p>

      <div className="flex justify-center py-2">
        <img src={barComp} alt="" />
      </div>
      <div className="space-y-10">
        {/* Education */}
        <div>
          <div className="">
            <div className="">
              <p className="font-semibold mb-4">Education History</p>
              {candidate_educations.length == 0 && (
                <div className="text-center bg-purple-200 p-8">
                  <p className="font-medium"> Add Education Details </p>
                  <p className="text-gray-700">
                    {" "}
                    Add your Educational Background{" "}
                  </p>
                </div>
              )}
            </div>
            <div className="  p-4">
              {candidate_educations.map((edu, id) => {
                return (
                  <div className="flex justify-between p-2 border-b" key={id}>
                    <div className="flex gap-4">
                      <div className="">
                        <LuGraduationCap className="text-btn-primary text-3xl" />
                      </div>
                      <div className="">
                        <div className=" text-md font-semibold">
                          {edu?.education_level}
                        </div>
                        <div className=""> {edu?.institute_name}</div>
                        <div className="">{edu?.location}</div>
                      </div>
                    </div>
                    <div className="flex gap-2 items-center">
                      <button>
                        {isPending && delID == edu.id ? (
                          <MiniLoader color="border-red-600" />
                        ) : (
                          <MdDeleteOutline
                            onClick={() => handleDeleteEducation(edu.id)}
                            className=" text-red-500 cursor-pointer text-2xl hover:text-red-700"
                          />
                        )}
                      </button>
                      <button
                        disabled={isPending}
                        onClick={() => handleOpenModal("education", edu)}
                      >
                        <FaRegEdit className="text-primary-green cursor-pointer text-xl hover:text-green-800" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex   mt-4 justify-center relative">
            <button
              type="button"
              onClick={() => handleOpenModal("education")}
              className="bg-btn-primary    bottom-0 flex gap-2 items-center text-white p-2 px-6 rounded-md "
            >
              <IoIosAddCircle /> Add Education
            </button>
          </div>
        </div>

        {/* Work Experience */}
        <div className="">
          <div className="">
            <p className="font-semibold mb-4">Work Experience</p>
            {candidate_work_experiences.length == 0 && (
              <div className="text-center bg-purple-200 p-8">
                <p className="font-medium"> Add relavant Work Experience</p>
                <p className="text-gray-700"> Add your Work Experience </p>
              </div>
            )}
          </div>

          <div className="">
            <div className="">
              <div className="  p-4">
                {candidate_work_experiences?.map((exp, id) => {
                  const datefrom = moment
                    .utc(exp?.date_from)
                    .local()
                    .format("MMM D, YYYY");
                  const dateto = moment
                    .utc(exp?.date_to)
                    .local()
                    .format("MMM D, YYYY");
                  return (
                    <div className="flex justify-between p-2 border-b" key={id}>
                      <div className="flex gap-4">
                        <div className="">
                          <BsBuildings className="text-btn-primary text-3xl" />
                        </div>
                        <div className="">
                          <div className="  text-md font-semibold">
                            {exp?.job_title}
                          </div>
                          <div className=""> {exp?.company_name}</div>
                          <div className="">
                            {datefrom} -{exp.is_current ? "Current " : dateto}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleDeleteExp(exp.id)}
                          disabled={isPending}
                        >
                          <MdDeleteOutline className=" text-red-500 cursor-pointer text-2xl hover:text-red-700" />
                        </button>
                        <button
                          disabled={isPending}
                          onClick={() => handleOpenModal("work", exp)}
                        >
                          <FaRegEdit className="text-primary-green cursor-pointer text-xl hover:text-green-800" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex   mt-4 justify-center relative">
              <button
                type="button"
                onClick={() => handleOpenModal("work")}
                className="bg-btn-primary    bottom-0 flex gap-2 items-center text-white p-2 px-6 rounded-md "
              >
                <IoIosAddCircle /> Add work experience
              </button>
            </div>
          </div>
        </div>
        {/* certificates  */}
        <div className="">
          <div className="">
            <p className="font-semibold mb-4">Certifications </p>
          </div>

          <div className="">
            <div className="">
              <div className="">
                {candidate_certificates?.length == 0 && (
                  <div className="text-center bg-purple-200 p-8">
                    <p className="font-medium"> Add Certification Details </p>
                    <p className="text-gray-700"> Add your Certificates </p>
                  </div>
                )}
              </div>
              <div className="  p-4">
                {candidate_certificates?.map((cer, id) => {
                  const issued = moment
                    .utc(cer?.date_of_issue)
                    .local()
                    .format("MMM D, YYYY");
                  return (
                    <div className="flex justify-between p-2 border-b" key={id}>
                      <div className="flex gap-4">
                        <div className="">
                          <GrCertificate className="text-btn-primary text-3xl" />
                        </div>
                        <div className="">
                          <div className="  text-md font-semibold">
                            {cer?.certificate_name}
                          </div>
                          <div className=""> {cer?.issuing_organization}</div>
                          <div className="">{issued} </div>
                        </div>
                      </div>
                      <div className="flex gap-2 items-center">
                        <button
                          onClick={() => handleDeleteCertificate(cer.id)}
                          disabled={isPending}
                        >
                          <MdDeleteOutline className=" text-red-500 cursor-pointer text-2xl hover:text-red-700" />
                        </button>
                        <button
                          onClick={() => handleOpenModal("certificate", cer)}
                          disabled={isPending}
                        >
                          <FaRegEdit className="text-primary-green cursor-pointer text-xl hover:text-green-800" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex   mt-4 justify-center relative">
              <button
                type="button"
                onClick={() => handleOpenModal("certificate")}
                className="bg-btn-primary    bottom-0 flex gap-2 items-center text-white p-2 px-6 rounded-md "
              >
                <IoIosAddCircle /> Add Certificate
              </button>
            </div>
          </div>
        </div>
        <div className="">
          <Model model={modalState.isOpen}>
            {modalState.modelType == "certificate" ? (
              <AddCertificate
                currentdata={modalState.currentData}
                handleCloseDataModel={handleCloseModal}
              />
            ) : modalState.modelType === "education" ? (
              <AddEducation
                currentdata={modalState.currentData}
                handleCloseDataModel={handleCloseModal}
              />
            ) : (
              <AddWorkExperience
                currentdata={modalState.currentData}
                handleCloseDataModel={handleCloseModal}
              />
            )}
          </Model>
        </div>
      </div>
      <div className=" pt-4 text-end flex justify-between">
        <button type="button" onClick={() => navigate(-1)}>
          <FaArrowLeft className="text-gray-400" />
        </button>
        <NavLink
          to="/dashboard/profile/candidate-profile-Complete"
          className="bg-btn-primary text-white px-6 p-2 rounded-md"
        >
          Next
        </NavLink>
      </div>
    </div>
  );
};

export default CandidateEduJobHistory;
