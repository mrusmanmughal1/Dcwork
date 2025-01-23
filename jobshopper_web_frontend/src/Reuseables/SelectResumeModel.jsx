import React, { useState } from "react";
import { useApplyJob } from "../Services/Candidate/useApplyJob";
import { NavLink, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useCandidateDetails } from "../Services/Candidate/useCandidateDetails";
import { FaArrowUpRightFromSquare } from "react-icons/fa6";
import MiniLoader from "../UI/MiniLoader";
import toast from "react-hot-toast";

const SelectResumeModel = ({ showModel, setshowModel }) => {
  const queryClient = useQueryClient();
  const { mutate: applyjob, isPending: loadApply } = useApplyJob();
  const { data: CandiateData } = useCandidateDetails();
  const [selectedCv, setSelectedCV] = useState();

  const { id } = useParams();

  const handleApply = (jobId) => {
    if (jobId !== "") {
      const body = {
        job_cvs: [{ cv_id: jobId, job_id: showModel || id }],
      };
      applyjob(
        { method: "POST", body },

        {
          onSuccess: (res) => {
            toast.success(res.data.message);

            queryClient.invalidateQueries(["single-jobDetails"]);
            setshowModel(false);
          },
        }
      );
    }
  };

  const handleResumeChange = (cvId) => {
    setSelectedCV(cvId);
  };
  return (
    <div>
      <div className="    ">
        <div className="  text-2xl font-semibold bg-btn-primary text-white  p-4 ">
          SELECT A RESUME
        </div>
        <div className=" p-4">
          {CandiateData?.data?.data?.cvs.length !== 0 && (
            <div className=" font-semibold capitalize">
              <p className="text-slate-900">
                {" "}
                - Select a Resume to Apply on this job
              </p>
            </div>
          )}
          <div className="py-8">
            <div className="flex gap-4 flex-wrap">
              {CandiateData?.data?.data?.cvs.length !== 0 ? (
                <select
                  onChange={(e) => handleResumeChange(e.target.value)}
                  value={selectedCv || ""}
                  className={`border flex flex-col justify-center w-full items-center  overflow-hidden hover:cursor-pointer      bg-btn-primary     p-4 rounded-md text-white`}
                >
                  <option disabled value="" className="bg-white">
                    Select Your Resume
                  </option>
                  {CandiateData?.data?.data?.cvs?.map((val, i) => {
                    console.log(val);
                    return (
                      <option className="bg-white" value={val.cv_id} key={i}>
                        {i + 1} .{val?.cv_title}
                      </option>
                    );
                  })}
                </select>
              ) : (
                <div className="w-full   ">
                  <p className="text-2xl font-semibold text-btn-primary">
                    No Resume Available
                  </p>
                  <p className="text-red-700 font-semibold capitalize">
                    Add a Resume in Your Profile before applying
                  </p>
                  <div className="flex">
                    <NavLink
                      to="/dashboard/profile"
                      className="bg-btn-primary text-white p-2 px-6  my-4 rounded-md flex  items-center gap-2  "
                    >
                      Manage Profile <FaArrowUpRightFromSquare />
                    </NavLink>
                  </div>
                </div>
              )}
            </div>
          </div>
          <hr className="" />
          <div className="w-full flex justify-between pt-4 ">
            <button
              disabled={!selectedCv || loadApply}
              onClick={() => handleApply(selectedCv)}
              className="bg-btn-primary disabled:cursor-not-allowed disabled:bg-purple-700 text-white p-4 px-6 rounded-md"
            >
              {loadApply ? (
                <MiniLoader color={"border-purple-500 p-1"} />
              ) : (
                " Apply Now"
              )}
            </button>
            <button
              disabled={loadApply}
              onClick={() => setshowModel(false)}
              className="bg-gray-700 text-white p-4 rounded-md disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SelectResumeModel;
