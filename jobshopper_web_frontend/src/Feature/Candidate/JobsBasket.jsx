import { FaEarthAmericas } from "react-icons/fa6";
import { FaCheck } from "react-icons/fa";
import { ImCross } from "react-icons/im";
import { useGetBasket } from "../../Services/Candidate/useGetBasket";
import ErrorMsg from "../../UI/ErrorMsg";
import Loader from "../../UI/Loader";
import { useApplyJob } from "../../Services/Candidate/useApplyJob";
import { useClearJobBasket } from "../../Services/Candidate/useClearJobBasket";
import MiniLoader from "../../UI/MiniLoader";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useCandidateDetails } from "../../Services/Candidate/useCandidateDetails";
import toast from "react-hot-toast";
import { db } from "../../Services/Firebase/Firebase.Config";
import { doc, getDoc } from "firebase/firestore";
import { useQueryClient } from "@tanstack/react-query";
import { useSendNotification } from "../../Services/Firebase/useSendNotification";
import { useUserinfo } from "../../Context/AuthContext";

const JobsBasket = () => {
  const { data, isLoading, isError } = useGetBasket();
  const { mutate: apply, isPending } = useApplyJob();
  const { mutate: applyall, isPending: LoadAllJobs } = useApplyJob();

  const { mutate: clear, isPending: loadclear } = useClearJobBasket();
  const {
    data: CandidateData,
    isLoading: LoadCV,
    isError: ErrorCV,
  } = useCandidateDetails();
  const { username } = useUserinfo();
  //notification
  const { mutate: notification } = useSendNotification();
  const [loadingJobs, setLoadingJobs] = useState({});
  const [ApplyLoad, setApplyLoad] = useState([]);
  const [RejectLoad, setRejectLoad] = useState();
  const [selectedResumes, setSelectedResumes] = useState({});
  const queryClient = useQueryClient();

  if (isLoading || LoadCV) return <Loader style="  py-20" />;
  if (isError || ErrorCV)
    return (
      <ErrorMsg ErrorMsg="Sorry ! unable to fetch Data right now Please Try Again later " />
    );
  const { cvs } = CandidateData?.data?.data || {};

  if (data?.data?.results?.count == 0)
    return (
      <ErrorMsg ErrorMsg=" Your Job Basket is currently empty. You haven't added any jobs yet" />
    );
  const reversedResults = data?.data?.results
    ? [...data.data.results.results].reverse()
    : [];

  // handle Bulk Apply
  const handleApplyAll = () => {
    const jobCvs = Object.entries(selectedResumes)?.map(
      ([jobId, { cv_id }]) => ({
        job_id: jobId,
        cv_id: cv_id,
      })
    );

    const body = {
      apply_all: true,
      job_cvs: jobCvs, // Use the collected job_cvs
    };

    applyall(
      { method: "POST", body },
      {
        onSuccess: (res) => {
          queryClient.invalidateQueries(["basket", "Candidate-history"]);
          toast.success("Application submitted successfully! Good luck!");
        },
      }
    );
  };

  const handleApply = (jobId, jobdata) => {
    const cvId = selectedResumes[jobId];
    if (cvId && cvId.cv_id !== "") {
      setApplyLoad(jobId);
      setLoadingJobs((prev) => ({ ...prev, [jobId]: true }));
      const body = {
        job_cvs: [{ cv_id: cvId.cv_id, job_id: jobId }],
      };

      apply(
        { method: "POST", body },
        {
          onSuccess: async (res) => {
            queryClient.invalidateQueries(["basket", "Candidate-history"]);
            const Eid = `user_id${jobdata.employer_name + jobdata.employer}`;
            const empid = Eid.replace(" ", "_");
            const userRef = doc(db, "Users", empid);

            const fetchUserData = async () => {
              try {
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {
                  const { token } = docSnap.data(); // Replace with actual field names
                  notification({ token, username });
                } else {
                  // Success message or handling for no document
                }
              } catch (error) {
                // Handle the error appropriately
              }
            };
            fetchUserData();
            toast.success("Application submitted successfully! Good luck!");
          },
        }
      ).finally(() => {
        setSelectedResumes((prev) => {
          const newSelectedResumes = { ...prev };
          delete newSelectedResumes[jobId];
          return newSelectedResumes;
        });

        setLoadingJobs((prev) => ({ ...prev, [jobId]: false }));
      });
    } else {
      toast.error("Please select a resume", { id: "error-toast" });
    }
  };

  const handleResumeChange = (jobId, cvId) => {
    setSelectedResumes((prev) => ({
      ...prev,
      [jobId]: { cv_id: cvId },
    }));
  };

  const allJobsHaveResumesSelected = () => {
    return reversedResults.every((job) => selectedResumes[job.id]);
  };
  const handleRemove = (id) => {
    setRejectLoad(id);
    clear(id, {
      onSuccess: () =>
        setSelectedResumes((prev) => {
          const newSelectedResumes = { ...prev };
          delete newSelectedResumes[id]; // Remove the cleared job's CV
          return newSelectedResumes;
        }),
    });
  };
  return (
    <div className="rounded-md border md:w-11/12  max-w-full mx-auto ">
      <div className="overflow-x-auto">
        {/* Table Header */}
        <table className="min-w-full table-auto  ">
          <thead>
            <tr className="text-sm font-semibold bg-gray-200">
              <th className="p-3 text-left">Job Title</th>
              <th className="hidden md:table-cell p-3 text-left">Job Type</th>
              <th className="p-3 text-left">Select Resume</th>
              <th className="p-3 pe-6 text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Loop through the job items */}
            {reversedResults.map((val, i) => (
              <tr key={i} className="border-b hover:bg-gray-100">
                {/* Job Title */}
                <td className="p-3 text-sm">
                  <NavLink
                    to={`/job-Details/${val.id}`}
                    className="font-semibold capitalize"
                  >
                    {val.title}
                  </NavLink>
                  <div className="flex items-center gap-2 text-xs">
                    <FaEarthAmericas />{" "}
                    {val?.hybrid
                      ? "Hybrid"
                      : val?.remote
                      ? "Remote "
                      : val?.addresses?.map((address, i) => (
                          <span key={i}>
                            {address.city}
                            {i < val.addresses?.length - 1 && ","}{" "}
                          </span>
                        ))}
                  </div>
                </td>

                {/* Job Type */}
                <td className="hidden md:table-cell p-3 text-sm ">
                  {val.contract_type.replace(/_/g, " ")}
                </td>

                {/* Select Resume */}
                <td className="p-3 text-sm">
                  <select
                    name="resume"
                    className="w-full border border-gray-100"
                    onChange={(e) => handleResumeChange(val.id, e.target.value)}
                    value={selectedResumes[val.id]?.cv_id || ""}
                  >
                    <option disabled value="">
                      Select Your Resume
                    </option>
                    {cvs?.map((cv, idx) => (
                      <option
                        key={idx}
                        value={cv.cv_id}
                        className="text-xs py-4"
                      >
                        {idx + 1}. {cv.cv_title}
                      </option>
                    ))}
                  </select>
                </td>

                {/* Actions */}
                <td className="p-3 text-sm flex justify-end gap-2">
                  <button
                    onClick={() => handleApply(val.id, val)}
                    disabled={isPending || LoadAllJobs || loadclear}
                    className="bg-green-500 text-white px-4 py-2 rounded-md disabled:cursor-not-allowed"
                  >
                    {loadingJobs[val.id] ? (
                      <MiniLoader color="border-green-200" />
                    ) : (
                      <FaCheck />
                    )}
                  </button>
                  <button
                    onClick={() => handleRemove(val.id)}
                    disabled={loadclear || isPending || LoadAllJobs}
                    className="bg-red-500 text-white px-4 py-2 rounded-md disabled:cursor-not-allowed"
                  >
                    {loadclear && RejectLoad === val.id ? (
                      <MiniLoader color="border-red-200" />
                    ) : (
                      <ImCross />
                    )}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="text-center py-4">
        <button
          onClick={handleApplyAll}
          disabled={isPending || !allJobsHaveResumesSelected()}
          className="text-white bg-btn-primary p-10 py-3 rounded-md disabled:bg-purple-500 disabled:cursor-not-allowed"
        >
          {LoadAllJobs ? <MiniLoader /> : "Apply All"}
        </button>
      </div>
    </div>
  );
};

export default JobsBasket;
