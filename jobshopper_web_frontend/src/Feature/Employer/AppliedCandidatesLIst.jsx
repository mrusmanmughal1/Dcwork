import { FaDownload } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FaVideo } from "react-icons/fa";
import { useCandidateAppect } from "../../Services/Employer/useCandidateAppect";
import MiniLoader from "../../UI/MiniLoader";
import { BASE_URL_FILE } from "../../config/Config";
import { useState } from "react";
import { NavLink } from "react-router-dom";
const AppliedCandidatesLIst = ({
  Head,
  Data,
  setmodel,
  setinterviewModel,
  setapplicantID,
}) => {
  const [loadID, setLoadID] = useState();
  const [loadRejectId, setLoadRejectId] = useState();
  const { mutate: approval, isLoading, isPending } = useCandidateAppect();
  const handleinterview = (id) => {
    setinterviewModel(true);
    setapplicantID(id);
  };
  const hanldeCandidateAccept = (id) => {
    setLoadID(id);

    approval(
      { id: id, status: "accepted" },
      {
        onSuccess: () => setLoadID(null),
      }
    );
  };
  const handleDownload = (val) => {
    if (val.candidate_resume) {
      const url = BASE_URL_FILE + val.candidate_resume;
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
  return (
    <div className="   lg:w-full">
      <div className=" font-semibold  bg-slate-700      text-white justify-between    md:text-base  flex p-3 md:px-5 ">
        {Head?.map((val, i) => (
          <div className=" " key={i}>
            {val}
          </div>
        ))}
      </div>
      {/* //table */}

      <div className="h-96  overflow-y-auto">
        {Data?.applications_received?.length == 0 ? (
          <div className="text-center pt-16 font-semibold text-btn-primary">
            You have not received any applications yet.
          </div>
        ) : (
          Data?.applications_received?.map((val, i) => {
            return (
              <div key={i} className="px-2 hover:bg-slate-50  ">
                <div className="flex items-center justify-between md:py-4 py-2  hover:bg-gray-100 border-b ">
                  <div className=" w-[25%] flex md:flex-row  flex-col  md:items-center justify-between  px-1 md:px-4">
                    <div className="flex  text-sm  md:text-base flex-col gap-3">
                      <NavLink
                        to={`/candidates/Candidate-Details/${val.candidate_id}`}
                        className="font-semibold text-[12px] w-62"
                      >
                        {val?.candidate_username}
                      </NavLink>
                      <div className="  text-xs hidden md:block">
                        <p className=" flex items-center gap-2">
                          {val?.candidate_email}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className=" w-[25%] md:text-center text-end cursor-pointer      text-xs md:text-sm">
                    <button
                      onClick={() => handleDownload(val)}
                      className="text-btn-primary font-bold pe-4 "
                    >
                      <FaDownload />
                    </button>
                  </div>

                  <div className="status ps-[8%]   w-[25%]  text-center  ">
                    <span
                      className={`${
                        val.status == "rejected"
                          ? "bg-red-600"
                          : val?.status == "pending"
                          ? "bg-yellow-500 "
                          : "bg-green-500"
                      }  md:px-6 px-2 text-white  capitalize text-[9px] md:text-sm py-2 rounded-md`}
                    >
                      {isLoading ? <MiniLoader /> : val.status}
                    </span>
                  </div>
                  <div className=" w-[25%] flex flex-col items-end md:flex-row  md:justify-end  ">
                    {val?.status && (
                      <>
                        {val?.status !== ("accepted" || "rejected") && (
                          <button
                            data-tooltip-id="Accept"
                            disabled={isPending}
                            onClick={() => hanldeCandidateAccept(val.id)}
                            className="bg-green-500 font-semibold  p-2 disabled:cursor-not-allowed rounded-md text-white me-2"
                          >
                            {isPending && loadID == val.id ? (
                              <MiniLoader color="border-green-400" />
                            ) : (
                              <FaCheck />
                            )}
                          </button>
                        )}
                        <button
                          data-tooltip-id="Reject"
                          disabled={isPending}
                          onClick={() => {
                            setLoadRejectId(val.id);
                            approval(
                              { id: val.id, status: "rejected" },
                              {
                                onSuccess: () => setLoadRejectId(""),
                              }
                            );
                          }}
                          className="bg-red-500 font-semibold p-2 rounded-md text-white me-2  disabled:cursor-not-allowed"
                        >
                          {isPending && loadRejectId == val.id ? (
                            <MiniLoader color="border-red-400" />
                          ) : (
                            <RxCross1 />
                          )}
                        </button>
                        {val.status == "accepted" && (
                          <button
                            onClick={() => handleinterview(val.id)}
                            data-tooltip-id="my-tooltip-1"
                            className="bg-btn-primary font-bold text-white p-2 rounded-md"
                          >
                            {" "}
                            <FaVideo className=" " />
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="bg-gray-200 px-4 py-3 text-right">
        <button
          onClick={setmodel}
          type="button"
          className="py-2 px-4 bg-gray-600 text-white rounded hover:bg-gray-700 mr-2"
        >
          <i className="fas fa-times"></i> Close
        </button>
      </div>

      <ReactTooltip
        id="my-tooltip-1"
        place="bottom"
        content="Schedule a Meeting"
      />
      <ReactTooltip id="Accept" place="bottom" content="Accept Candidate " />
      <ReactTooltip id="Reject" place="bottom" content="Reject Candidate " />
    </div>
  );
};

export default AppliedCandidatesLIst;
