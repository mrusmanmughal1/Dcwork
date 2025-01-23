import { FaEarthAmericas } from "react-icons/fa6";
import { useJobHistoryEMp } from "../../Services/Employer/useJobHistoryEMp";
import { FaEdit } from "react-icons/fa";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { MdDelete } from "react-icons/md";
import { useState } from "react";
import Model from "../../Reuseables/Model";
import { useDeleteJob } from "../../Services/Employer/useDeleteJob";
import AppliedCandidatesLIst from "./AppliedCandidatesLIst";
import InterviewMain from "../InterviewModule/InterviewMain";
import { NavLink } from "react-router-dom";
import UpdateJob from "./UpdateJob";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { useFeaturedjob } from "../../Services/Jobs/useFeaturedjob";
import MiniLoader from "../../UI/MiniLoader";
import featuredimg from "../../assets/featured-img.png";
import AddFeaturedCart from "./UI/AddFeaturedCart";
import FeaturedPayments from "./UI/FeaturedPayments";
import FeaturedMain from "./UI/FeaturedMain";
import { RxCross2 } from "react-icons/rx";
import { FaArrowLeft } from "react-icons/fa6";
import { IoMdArrowRoundForward } from "react-icons/io";
import { IoMdArrowRoundBack } from "react-icons/io";
const ApplicationHistory = () => {
  const [model, setmodel] = useState(false);
  const [featureModel, setfeatureModel] = useState(false);

  const [interviewModel, setinterviewModel] = useState(false);
  const [applicantID, setapplicantID] = useState(null);
  const [index, setindex] = useState(null);
  const [edit, setEdit] = useState(null);
  const [updateModel, setupdateModel] = useState(false);
  const [page, setPage] = useState(1);
  const [delid, setdelid] = useState();
  const { mutate: featured, isPending: loadFeatured } = useFeaturedjob();
  const { data, isLoading, isError } = useJobHistoryEMp(page);
  const [featurepage, setfeaturepage] = useState(0);
  const toggleModal = (i) => {
    setindex(i);
    setmodel(!model);
  };
  const handlemodelclick = (val) => {
    setupdateModel(true);
    setEdit(val);
  };
  const { mutate: deleteJob, isPending } = useDeleteJob();

  const Head = ["Applicants", "Download  ", "Status", "Action"];

  //pagination
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

  if (isLoading) return <Loader style="py-20" />;
  if (data?.data?.results?.data?.length == 0)
    return <ErrorMsg ErrorMsg=" You have not posted any jobs yet. " />;
  if (isError)
    return (
      <ErrorMsg ErrorMsg="No Data Availale Right Now Try Again Later . Thank You" />
    );

  const handleDeleteJob = (id) => {
    setdelid(id);
    deleteJob(id, {
      onSuccess: () => setdelid(""),
    });
  };
  const handleClose = () => {
    setfeaturepage(0);
    setfeatureModel(false);
  };
  return (
    <div className="">
      <div className="ps-2 pb-2 flex justify-between items-center">
        <div className="font-semibold">
          Posted Jobs
          <span className="text-btn-primary">({data?.data?.count})</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={!data?.data?.previous}
            className="bg-slate-200   p-1 disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
          >
            <IoMdArrowRoundBack />
          </button>
          {page}
          <button
            onClick={handleNextPage}
            disabled={!data?.data?.next}
            className="bg-slate-200   p-1 disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
          >
            <IoMdArrowRoundForward />
          </button>
        </div>
      </div>
      <div className="rounded-md border ">
        {/* 
           
         

        {/* history table  */}

        <div className="  text-sm md:text-base  flex overflow-x-auto   ">
          <table className="w-full table-auto">
            <thead className="bg-gray-200">
              <tr>
                <th className="text-left py-2 px-4">Job Title</th>
                <th className="text-center py-2 px-4">Applications</th>
                <th className="text-center py-2 px-4 hidden md:table-cell">
                  Job Status
                </th>
                <th className="text-right py-2 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {data?.data?.results?.data?.map((val, i) => (
                <tr key={i} className="hover:bg-gray-100 border-b">
                  <td className="py-4 px-4">
                    <div className="flex flex-col">
                      <NavLink to={`/job-Details/${val?.id}`}>
                        <div className="text-black w-[140px] lg:w-[230px] font-semibold">
                          {val?.title} &nbsp;
                          {val?.featured && (
                            <span className="text-[9px] bg-btn-primary text-white p-1 rounded-sm">
                              Featured
                            </span>
                          )}
                        </div>
                      </NavLink>
                      <div className="flex items-center gap-2 text-xs">
                        <FaEarthAmericas />
                        {val.hybrid ? (
                          <p>Hybrid</p>
                        ) : val?.remote ? (
                          <p>Remote</p>
                        ) : (
                          val?.addresses?.map((address, i) => (
                            <span key={i}>
                              {address?.state}
                              {i < val?.addresses?.length - 1 && ","}
                            </span>
                          ))
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4">
                    <div
                      onClick={() => toggleModal(i)}
                      className="cursor-pointer text-xs md:text-sm"
                    >
                      View Applications
                      <span className="text-btn-primary font-bold">
                        ({val?.applications_count})
                      </span>
                    </div>
                  </td>
                  <td className="text-center py-4 px-4 hidden md:table-cell">
                    <span
                      className={`${
                        val?.status === "rejected"
                          ? "bg-red-600"
                          : val?.status === "pending"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      } md:px-6 px-2 text-white capitalize text-sm py-2 rounded-md`}
                    >
                      {val.status}
                    </span>
                  </td>
                  <td className="text-right py-4 px-4">
                    <div className="flex justify-end">
                      {val?.status !== "rejected" && (
                        <>
                          {val?.status === "accepted" && (
                            <button
                              disabled={loadFeatured}
                              onClick={() => setfeatureModel(val.id)}
                              className="bg-btn-primary hover:bg-purple-800 text-[12px] p-2 rounded-md text-white"
                            >
                              <div className="flex  items-center flex-col">
                                Feature Job
                              </div>
                            </button>
                          )}
                          {val.status === "pending" && (
                            <button
                              onClick={() => handlemodelclick(val)}
                              className="text-green-700 hover:text-green-500 font-semibold p-1 rounded-md"
                            >
                              <FaEdit />
                            </button>
                          )}
                        </>
                      )}
                      <button
                        disabled={isPending}
                        onClick={() => handleDeleteJob(val.id)}
                        className="text-red-700 hover:text-red-500 font-semibold p-1 rounded-md text-2xl me-1"
                      >
                        {isPending && delid == val.id ? (
                          <MiniLoader color="border-red-700" />
                        ) : (
                          <MdDelete />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* table end  */}

        {/* featured JOb Model  */}
        <Model model={featureModel}>
          <div className=" p-8 space-y-5 relative">
            {featurepage !== 0 && (
              <button onClick={() => setfeaturepage(featurepage - 1)}>
                <FaArrowLeft />
              </button>
            )}
            <button
              onClick={handleClose}
              className="absolute right-8 top-4 p-1 bg-btn-primary text-white cursor-pointer"
            >
              <RxCross2 />
            </button>
            <div className="px-4 py-2 flex justify-between items-center  border-2">
              <div className="text-xl font-semibold text-btn-primary">
                Featured Job
              </div>
              <div className=" w-32 h-auto overflow-hidden">
                <img
                  src={featuredimg}
                  alt="Featured "
                  width="100%"
                  height="100%"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
            {featurepage == 0 && (
              <FeaturedMain setfeaturepage={setfeaturepage} />
            )}
            {featurepage == 1 && (
              <FeaturedPayments
                jobid={featureModel}
                setfeaturepage={setfeaturepage}
                handleClose={handleClose}
              />
            )}
            {featurepage == 2 && (
              <AddFeaturedCart setfeaturepage={setfeaturepage} />
            )}
          </div>
        </Model>
        {/* applicatnts interview model  */}
        <Model model={model} index="z-10">
          <AppliedCandidatesLIst
            Head={Head}
            Data={data?.data?.results.data?.at(index)}
            setmodel={toggleModal}
            setinterviewModel={setinterviewModel}
            setapplicantID={setapplicantID}
          />
        </Model>
        <Model model={interviewModel} index="z-20">
          <InterviewMain
            key={interviewModel}
            applicantID={applicantID}
            interviewModel={interviewModel}
            setinterviewModel={setinterviewModel}
          />
        </Model>

        {/* update job  */}
        <Model model={updateModel}>
          <UpdateJob edit={edit} setupdateModel={setupdateModel} />
        </Model>
      </div>
      <ReactTooltip id="Feature" place="bottom" content=" Featured This Job" />
      <ReactTooltip id="Edit" place="bottom" content="Edit This Job" />
      <ReactTooltip id="Delete" place="bottom" content="Delete This Job " />
    </div>
  );
};

export default ApplicationHistory;
