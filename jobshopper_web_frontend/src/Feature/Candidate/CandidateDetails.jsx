import CandidateContact from "./CandidateContact";
import { useCandidateDetail } from "../../Services/Employer/useCandidateDetail";
import { useParams } from "react-router-dom";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { IoIosChatboxes } from "react-icons/io";
import { useChatContext } from "../../Context/ChatContext";
import Model from "../../Reuseables/Model";
import MessageCandidates from "./MessageCandidates";
import { useState } from "react";
import { BASE_URL, BASE_URL_IMG } from "../../config/Config";
import { FaDownload } from "react-icons/fa";
const CandidateDetails = () => {
  const [mode, setmodel] = useState(false);
  const { dispatch } = useChatContext();
  const { id } = useParams();
  const { data, isLoading, isError, error } = useCandidateDetail(id);
  if (isLoading) return <Loader style="py-20 h-screen" />;
  if (isError)
    return (
      <ErrorMsg
        ErrorMsg={
          error?.response?.data?.detail ||
          "Sorry Unable to fecth data try again later ... "
        }
      />
    );
  const {
    first_name,
    last_name,
    email,
    cvs,
    candidate_professional_skill,
    candidate_avatar_image,
    candidate_about,
    phone,
    candidate_city,
    candidate_country,
    candidate_educations,
    candidate_work_experiences,
    username,
    candidate_certificates,
    id: idd,
  } = data?.data?.data || {};
  const hanldeChat = () => {
    const rec = `user_id${username}${idd}`;
    const Receiver_user_id = rec.replace(/ /g, "_");
    const R_ID = {
      Receiver_user_id: Receiver_user_id,
      Recever_id: idd,
    };

    setmodel(true);
    dispatch({ type: "Receiver", payload: R_ID });
  };
  const handleDownload = () => {
    if (cvs && cvs?.length > 0) {
      const url = BASE_URL + cvs?.at(0)?.file;
      const link = document.createElement("a");
      link.href = url;
      link.target = "_blank";
      link.download = "CV.pdf"; // Set the filename you want
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      alert("No CV available for download.");
    }
  };
  const url =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

  return (
    <div>
      <div className="candidate-man relative  ">
        <div className="absolute inset-0 bg-black   opacity-80 "></div>
        <div className="w-11/12 mx-auto ">
          <div className=" relative text-white   py-8 flex  md:justify-between  flex-col items-start gap-8  md:flex-row  ">
            <div className="  flex-1  ">
              <div className=" py-4 border-b border-white flex flex-col gap-4">
                <div className=" w-[200px] h-[200px]  overflow-hidden">
                  <img
                    src={
                      candidate_avatar_image
                        ? BASE_URL_IMG + candidate_avatar_image
                        : url
                    }
                    height="100%"
                    width="100%"
                    alt="profile"
                    className="w-full h-full object-contain"
                  />
                </div>
                <p className="text-2xl font-semibold">
                  {first_name} {last_name}
                </p>
              </div>
              <div className="flex flex-col gap-4 pt-4 text-xl">
                <div className="flex">
                  <p className="font-semibold">Address </p>: {candidate_city}{" "}
                  {candidate_country}
                </div>
                <div className="flex">
                  <p className="font-semibold">Email</p>
                  <p> : {email}</p>
                </div>
                <div className="">
                  <p className="font-semibold">Work Experience </p>
                  <div className="">
                    {candidate_work_experiences?.map((exp, i) => {
                      return (
                        <div key={i} className="py-1 ps-2">
                          <p> {exp.job_title}</p>
                          <p className="text-base">{exp.company_name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="">
                  <p className="font-semibold">Education</p>
                  <div className="">
                    {candidate_educations?.map((edu, i) => {
                      return (
                        <div key={i} className="py-1 ps-2">
                          <p> {edu.education_level}</p>
                          <p className="text-base">{edu.institute_name}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="">
                  <p className="font-semibold">Certifications</p>
                  <div className="">
                    {candidate_certificates?.map((exp, i) => {
                      return (
                        <div key={i} className="py-1 ps-2">
                          <p> {exp.certificate_name}</p>
                          <p className="text-base">
                            {exp.issuing_organization}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
            <div className=" flex-1 md:pt-20  flex justify-end items-center    ">
              <div className=" text-end flex flex-col gap-4 ">
                <div className="flex md:gap-4 gap-2 flex-col md:flex-row ">
                  {cvs && (
                    <button
                      className=" p-4 bg-btn-primary rounded-md flex items-center gap-2"
                      onClick={handleDownload}
                    >
                      <FaDownload /> DOWNLOAD CV
                    </button>
                  )}
                  {/* <Button>View CV</Button> */}
                  <button
                    onClick={hanldeChat}
                    className="bg-btn-primary p-2 px-4 rounded-md text-3xl flex gap-2 items-center"
                  >
                    <IoIosChatboxes />{" "}
                    <span className="text-base">Messages</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-gray-200  py-8 font-semibold">
        <div className="   w-11/12 mx-auto">
          Skills :{" "}
          {candidate_professional_skill?.map((val, i) => (
            <span key={i}>
              {" "}
              {val} {i < candidate_professional_skill?.length - 1 && ","}{" "}
            </span>
          ))}
        </div>
      </div>
      <div className="w-11/12 mx-auto py-10">
        <div className=" ">
          <div className="">
            <div className=" text-4xl font-semibold pb-8">
              About{" "}
              <span className="text-btn-primary">
                {first_name} {last_name}
              </span>
            </div>
          </div>
          <div className="flex  justify-between flex-col md:flex-row gap-8">
            <div className="  text-justify md:w-3/4   whitespace-pre-line">
              {candidate_about}
            </div>
            <CandidateContact
              email={email}
              phone={phone}
              country={candidate_country}
              city={candidate_city}
              username={username}
              candidate_country={candidate_country}
              download={BASE_URL + cvs?.at(0)?.file}
              handleDownload={handleDownload}
            />
          </div>
        </div>
      </div>
      <Model model={mode}>
        <MessageCandidates
          RecUserName={username}
          RecvID={idd}
          Recfirst_name={first_name}
          Reclast_name={last_name}
          setmodel={setmodel}
          url={BASE_URL + candidate_avatar_image}
        />
      </Model>
    </div>
  );
};

export default CandidateDetails;
