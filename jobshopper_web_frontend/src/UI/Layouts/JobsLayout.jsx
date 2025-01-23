import { useState, useEffect } from "react";

import CvUpload from "../../UI/CvUpload";
import FeaturedJobs from "../../UI/FeaturedJobs";
import Job from "../Job";
import JobType from "../../UI/JobType";
import { useUserinfo } from "../../Context/AuthContext";
import { useSearchAPI } from "../../Services/General/useSearchAPI";
import Loader from "../Loader";
import { IoIosArrowRoundBack } from "react-icons/io";
import { useLocation, useNavigate } from "react-router-dom";
import { useCandidateDetails } from "../../Services/Candidate/useCandidateDetails";
import ErrorMsg from "../ErrorMsg";
import { IoIosArrowRoundForward } from "react-icons/io";
 
import JObSearch from "../JObSearch";
const JobsLayout = ({ JobStatus, statusError }) => {
  const [searched, setsearch] = useState({
    title: "",
    location: "",
    isRemote: "",
    focused_industries: [],
    posted_in_last: "",
    contract_type: [],
    employer_id: "",
    work_type: [],
    rate_min: "",
    rate_max: "",
  });

  const { posted_in_last } = searched;
  const navigate = useNavigate();

  const locationObj = useLocation();
  const queryParams = new URLSearchParams(locationObj.search);
  const titles = queryParams.get("title") || "";
  const locationParam = queryParams.get("location") || "";
  const posted = queryParams.get("posted_in_last") || "";
  const contacttype = queryParams.get("contract_type") || "";
  const employer_id = queryParams.get("employer_id") || "";
  const focused_industries = queryParams.get("focused_industries") || "";
  const isRemotes = queryParams.get("isRemote") || "";
  const rate_max = queryParams.get("rate_max") || "";
  const rate_min = queryParams.get("rate_min") || "";

  useEffect(() => {
    setsearch({
      title: titles || "",
      location: locationParam || "",
      isRemote: isRemotes || "",
      focused_industries: focused_industries || [],
      posted: posted || "",
      contract_type: contacttype || "",
      employer_id: employer_id || "",
      work_type: [],
      rate_min: rate_min || "",
      rate_max: rate_max || "",
    });
  }, [
    titles,
    locationParam,
    isRemotes,
    focused_industries,
    posted,
    contacttype,
    employer_id,
    rate_max,
    rate_min,
  ]);

  const { user_type } = useUserinfo();
  const {
    data: SearchedData,
    isLoading: isSearch,
    isError: SearchError,
    localPage,
    handleNextPage,
    handlePreviousPage,
  } = useSearchAPI(searched);

  // Handle search and update URL parameters
  const handleSearched = () => {
    const queryParams = new URLSearchParams({
      title: searched.title,
      location: searched.location,
      isRemote: searched.isRemote,
      focused_industries: searched.focused_industries,
      posted_in_last: searched.posted_in_last,
      contract_type: searched.contract_type,
      employer_id: searched.employer_id,
      work_type: searched.work_type,
      rate_min: searched.rate_min,
      rate_max: searched.rate_max,
    });

    // Update the URL with new query parameters
    navigate(`/jobs?${queryParams.toString()}`);
  };

  const handleChange = (e) => {
    const { name, value, checked } = e.target;
    if (name === "work_type") {
      const currentWorkTypes = searched.work_type;

      if (checked) {
        // Add the checked work type
        setsearch((prev) => ({
          ...prev,
          work_type: [...currentWorkTypes, value], // Add the value to the array
        }));
        // Append the new work type to the query parameters
      } else {
        // Remove the unchecked work type
        const updatedWorkTypes = currentWorkTypes.filter(
          (type) => type !== value
        );
        setsearch((prev) => ({
          ...prev,
          work_type: updatedWorkTypes, // Update the state
        }));

        // Clear existing work_type
      }
    } else if (name === "locations") {
      if (value === "") {
        queryParams.set("location", e.target.value);

        navigate(`/jobs?${queryParams}`);
      }
    } else if (name.startsWith("focused_industries")) {
      const currentWorkTypess = searched.focused_industries;

      if (checked) {
        // Add the checked work type
        setsearch((prev) => ({
          ...prev,
          focused_industries: [...currentWorkTypess, value], // Add the value to the array
        }));
        // Append the new work type to the query parameters
        queryParams.append("focused_industries", searched.focused_industries); // Append to query parameters
      } else {
        // Remove the unchecked work type
        const updatedWorkTypes = currentWorkTypess.filter(
          (type) => type !== value
        );
        setsearch((prev) => ({
          ...prev,
          focused_industries: updatedWorkTypes, // Update the state
        }));

        // Clear existing focused_industries
        queryParams.delete("focused_industries");

        // Check if there are any remaining work types
        if (updatedWorkTypes.length > 0) {
          queryParams.set("focused_industries", focused_industries.join(",")); // Use set instead of append
        }

        // Update the URL with new query parameters
        navigate(`/jobs?${queryParams.toString()}`);
      }
    }
  };

  const { data: candidateCVUpdated } = useCandidateDetails();
  return (
    <div className="flex lg:flex-row flex-col w-11/12 mx-auto ">
      <div className="pt-4 lg:w-[30%]  lg:order-none order-2">
        {user_type === "candidate" &&
          candidateCVUpdated?.data?.data?.cvs?.length == 0 && <CvUpload />}
        <FeaturedJobs />
        <JobType
          setsearch={setsearch}
          posted_in_last={posted_in_last}
          alljobs={SearchedData}
          searched={searched}
          handleChange={handleChange}
        />
      </div>

      <div className=" w-full   py-8 md:pt-4">
        <div className="   lg:w-3/4 mx-auto ">
          <JObSearch
            searched={searched}
            setsearch={setsearch}
            handleSearched={handleSearched}
          />
        </div>
        <div className="flex items-center w-full justify-between ps-8  pt-4 ">
          <div className="">
            <p className="  font-semibold text-sm">
              Jobs Available ({SearchedData?.data?.results?.count || 0})
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handlePreviousPage}
              disabled={!SearchedData?.data?.results?.previous}
              className="bg-slate-200   p-2   disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
            >
              <IoIosArrowRoundBack />
            </button>
            <div className="flex items-center px-1">{localPage}</div>
            <button
              onClick={handleNextPage}
              disabled={!SearchedData?.data?.results?.next}
              className="bg-slate-200   p-2    disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
            >
              <IoIosArrowRoundForward />
            </button>
          </div>
        </div>

        <div className=" lg:ps-8 mt-4 min-h-56">
          {isSearch ? (
            <Loader style="py-10" />
          ) : SearchError || statusError ? (
            <ErrorMsg ErrorMsg="Sorry, Unable to Fetch Data. Try Again Later" />
          ) : (
            <div>
              {SearchedData?.data?.count === 0 ? (
                <ErrorMsg ErrorMsg="No Data is Available Right Now . Try Again Later." />
              ) : SearchedData?.data?.results?.results < 1 ? (
                <p className="p-10 font-semibold text-center text-2xl">
                  Sorry ! No Job Found
                </p>
              ) : (
                SearchedData?.data?.results?.results?.map((val, i) => (
                  <Job
                    job={val}
                    key={`${user_type}-${i}`}
                    JobStatus={JobStatus}
                  />
                ))
              )}
              {SearchedData?.data?.results?.count > 0 && (
                <div className="flex items-center w-full justify-center ps-8  pt-4 ">
                  <div className="flex gap-1">
                    <button
                      onClick={handlePreviousPage}
                      disabled={!SearchedData?.data?.results?.previous}
                      className="bg-slate-200   p-2   disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
                    >
                      <IoIosArrowRoundBack />
                    </button>
                    <div className="flex items-center px-1">{localPage}</div>
                    <button
                      onClick={handleNextPage}
                      disabled={!SearchedData?.data?.results?.next}
                      className="bg-slate-200   p-2    disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
                    >
                      <IoIosArrowRoundForward />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobsLayout;
