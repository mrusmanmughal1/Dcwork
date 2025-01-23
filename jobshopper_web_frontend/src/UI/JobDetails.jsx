import { FaCartPlus } from "react-icons/fa";
import Profile from "../assets/Profile-picture.png";
import SimilarJobs from "./SimilarJobs";
import { useState } from "react";
import { useJobDetails } from "../Services/Jobs/useDetailsjob";
import { IoIosSend } from "react-icons/io";
import Loader from "./Loader";
import ErrorMsg from "./ErrorMsg";
import { useUserinfo } from "../Context/AuthContext";
import { BASE_URL_IMG } from "../config/Config";
import { useJobBasket } from "../Services/Candidate/useJobBacket";
import ShareToSocial from "./ShareToSocial";
import { useJobStatus } from "../Services/General/useJobStatus";
import MiniLoader from "./MiniLoader";
import { useGetBasket } from "../Services/Candidate/useGetBasket";
import Model from "../Reuseables/Model";
import DOMPurify from "dompurify";
import { NavLink, useNavigate } from "react-router-dom";
import SelectResumeModel from "../Reuseables/SelectResumeModel";
function JobDetails() {
  const { data, isLoading, isError } = useJobDetails();
  const { data: jobStatus, isLoading: jobstatusload } = useJobStatus();
  const { data: jobBasket, isLoading: loadingbasketData } = useGetBasket();

  const navigate = useNavigate();

  const {
    mutate: jobbasket,
    isPending: basketload,
    isError: basketError,
  } = useJobBasket();

  const [showModel, setshowModel] = useState(false);

  const { user_type } = useUserinfo();

  if (isLoading || jobstatusload || loadingbasketData)
    return <Loader style="h-screen" />;
  if (isError)
    return (
      <ErrorMsg ErrorMsg="No Data is Available Please Try Agian later Thank You." />
    );
  // Check if the job has already been applied for
  const isApplied = jobStatus?.data.applied_jobs?.some(
    (app) => app === data?.data?.id
  );
  // Check if the job is already in the basket
  const inCart = jobBasket?.data?.results?.results?.some(
    (app) => app.id === data?.data?.id
  );
  const hanldebasket = (id) => {
    if (user_type !== "candidate") {
      navigate("/register", { state: "candidate" });
    } else {
      jobbasket(id); // Directly call jobbasket(id)
    }
  };
  const applyforthejob = () => {
    if (user_type !== "candidate") {
      navigate("/login");
    } else {
      setshowModel(true); // Directly call setshowModel
    }
  };
  const { job_description } = data.data || "";

  
  
  // Sanitize and remove unwanted classes
  const sanitizedHtml = DOMPurify.sanitize(job_description, {
    ALLOWED_TAGS: ['b', 'i', 'u', 'strong', 'em', 'ul', 'ol', 'li', 'h1', 'h2', 'h3', 'p'],
    ALLOWED_ATTR: ['class'], // You can allow classes for other styling needs
  });

   
  return (
    <div className=" ">
      <div className="bg-btn-primary py-8 px-4   lg:py-20">
        <div className="mx-auto w-11/12 px-2 flex  flex-col">
          <div className="flex flex-col md:flex-row  items-center justify-between text-white">
            <div className="mb-8 lg:mb-0 pb-2  w-full">
              <div className="border-b pb-2">
                <h1 className="text-xl font-bold">Job Title</h1>

                <h2 className="text-4xl">{data?.data?.title} </h2>
              </div>
              <div className="text-white flex flex-col gap-6 text-lg lg:text-xl pt-4 w-full ">
                <p>Job Type : {data?.data?.contract_type?.replace("_", " ")}</p>
                <p>
                  Salary : {data?.data?.rate}$ /{data?.data?.rate_unit}
                </p>
                {data?.data?.addresses?.length > 0 ? (
                  <p>
                    Location :
                    {data?.data?.addresses?.map((val, i) => (
                      <span key={val + i}>
                        {" "}
                        {val?.city} , {val?.state} ,{val?.country}
                      </span>
                    ))}
                  </p>
                ) : null}
                {data?.data?.remote && !data?.data?.hybrid && (
                  <p>Remote : {data?.data?.remote ? "Yes" : "No"}</p>
                )}

                {data?.data?.hybrid && (
                  <p> Hybrid : {data?.data?.hybrid ? "Yes" : "No"}</p>
                )}
                <p>
                  Work Auth :
                  {data?.data?.work_authorization?.map((val, i) => (
                    <span key={val + i}>
                      {" "}
                      {val}
                      {i < data?.data?.work_authorization?.length - 1 && ","}
                    </span>
                  ))}
                </p>
              </div>
            </div>
            <div className="w-full flex flex-col justify-end gap-4 md:gap-10 ">
              <div className="flex md:justify-end ">
                {user_type !== "employer" && (
                  <div className="mt-4 lg:mt-0 flex flex-col lg:gap-4">
                    {isApplied ? (
                      <>
                        <button
                          className="uppercase text-md flex items-center px-6 text-white bg-gray-700 font-semibold rounded-md py-2 border border-black"
                          disabled
                        >
                          Already Applied
                        </button>
                        <NavLink
                          to="/dashboard/candidate-applied-job"
                          className="bg-green-600 p-2 text-center rounded-md text-white"
                        >
                          View My Status
                        </NavLink>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={applyforthejob}
                          className="uppercase text-md flex items-center justify-center px-6 text-white bg-[#008000] font-semibold rounded-md py-2 border border-black"
                        >
                          <div className="flex items-center">
                            <IoIosSend className="mr-2 text-xl" />
                            Apply for this job
                          </div>
                        </button>
                        <br className="lg:hidden" />

                        <button
                          onClick={() => hanldebasket(data.data.id)}
                          disabled={inCart}
                          className={` ${
                            inCart ? "bg-gray-500" : "bg-[#008000]"
                          } uppercase text-md disabled:cursor-not-allowed flex items-center justify-center px-6 text-white  font-semibold w-full rounded-md py-2 border border-black lg:mb-0 lg:mr-4`}
                        >
                          {basketload ? (
                            <MiniLoader color="border-green-400  p-3 " />
                          ) : (
                            <div className="flex items-center">
                              <FaCartPlus className="mr-2" />
                              {inCart
                                ? "Already in cart "
                                : " Add to job basket"}
                            </div>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
              <div className="  leading-loose">
                <ShareToSocial />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="py-8 px-4 md:px-6 mx-auto w-11/12">
        <h3>
          <span className="font-semibold">Required Skills</span>:
          {data?.data?.job_skill?.map((val, i) => (
            <span key={val}>
              {" "}
              {val} {i < data?.data?.job_skill.length - 1 && ","}
            </span>
          ))}
        </h3>
      </div>
      <div className="border-t     bg-purple-50"></div>
      <div className="bg-purple-50">
        <div className="flex  w-11/12 mx-auto  pb-20 flex-col md:flex-row gap-10">
          <div className="md:w-[70%] ">
            <div className="flex flex-co  lg:flex-row md:px-6 py-2 ">
              <div className=" w-32 h-32 overflow-hidden">
                <img
                  src={
                    data.data.company_image
                      ? BASE_URL_IMG + data.data.company_image
                      : Profile
                  }
                  className="w-full h-full object-contain"
                  alt="/"
                />
              </div>
              <div className="lg:w-3/4 px-8 mt-4 lg:mt-0 flex flex-col justify-center ">
                <div className="font-semibold text-2xl mb-2">
                  {data?.data?.employer_name}
                </div>
                <div className="  text-xs md:text-base">
                  <NavLink
                    className="hover:text-btn-primary"
                    to={`/jobs/?employer_id=${data.data.employer}`}
                  >
                    View Jobs Posted By This Company
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="border-t pt-8 "></div>

            <div className="flex flex-col gap-4">
              <div className="md:px-8 text-3xl font-semibold text-gray-900">
                <h4>Job Description</h4>
              </div>
              <div className="md:px-8">
                <div className="text-justify whitespace-pre-line">
                <div className="details-of-job" dangerouslySetInnerHTML={{ __html: sanitizedHtml }} />
                   
                </div>
              </div>
            </div>
          </div>
          <div className="   md:w-[30%] flex   ">
            <div className="  w-11/12 md:w-full     mx-auto md:mx-0">
              <SimilarJobs />
            </div>
          </div>
        </div>
      </div>

      {showModel && (
        <Model model={showModel}>
          <div>
            <SelectResumeModel setshowModel={setshowModel} />
          </div>
        </Model>
      )}
    </div>
  );
}

export default JobDetails;
