import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useParams } from "react-router-dom";
import { useAdminJobDetails } from "../Services/admin/useAdminJobDetails";
import { BASE_URL_IMG } from "../config/Config";
import { useAdminJobApprove } from "../Services/admin/useAdminJobApprove";
import MiniLoader from "./MiniLoader";

const AdminViewJobs = () => {
  const { id } = useParams();

  const [selectId, setselecId] = useState("");
  const [rejectid, setrejecid] = useState("");
  const { data } = useAdminJobDetails(id);
  const {
    title,
    contract_type,
    remote,
    rate,
    job_description,
    addresses,
    employer_name,
    company_image,
    status,
    job_posting_deadline,
  } = data?.data || {};
  const { mutate: JobApprove, isPending: load } = useAdminJobApprove();
  const handleApprove = (id) => {
    setselecId(id);
    JobApprove(
      { id, payload: "approve" },
      {
        onSuccess: () => setselecId(null),
        onError: () => setselecId(null),
      }
    );
  };
  const handleReject = (id) => {
    setrejecid(id);
    JobApprove(
      { id, payload: "reject" },
      {
        onSuccess: () => setrejecid(null),
        onError: () => setrejecid(null),
      }
    );
  };
  return (
    <div className="bg-btn-primary py-8 px-4 lg:py-10">
      <div className="mx-auto w-11/12">
        <div className="flex flex-col md:flex-row justify-between text-white">
          <div className="mb-8 lg:mb-0 py-1 border-b w-full">
            <h1 className="text-xl font-semibold">Job Details</h1>
            <h2 className="text-4xl py-2">{title}</h2>
            <p>Job Type : {contract_type}</p>
            <p>Salary : {rate}</p>
            <p>
              Hybrid : {remote && addresses?.length > 0 ? " True " : "False"}
            </p>
            <p>Remote : {remote ? "True" : "False"}</p>
            <p className="flex items-center">
              {" "}
              Address :{" "}
              <div className="flex">
                <div>
                  <p className=" flex gap-2 items-center">
                    &nbsp;{" "}
                    {addresses?.length > 0
                      ? addresses?.map((val, index) => (
                          <span key={index}>
                            {val?.state} {val?.city}
                            {index < addresses?.length - 1 && ","}
                          </span>
                        ))
                      : " false"}
                  </p>
                </div>
              </div>
            </p>
            <p>Deadline : {job_posting_deadline}</p>
            <p className="capitalize">Status : {status}</p>
            <p className="  ">Employer : {employer_name}</p>
          </div>
          <div className="flex flex-col  w-full  items-end  capitalize mt-4 lg:mt-0">
            <div className="">
              <div className=" w-52 h-52 overflow-hidden">
                <img
                  src={BASE_URL_IMG + company_image}
                  alt=""
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="md:flex justify-between items-center leading-loose">
          <div className="text-white flex flex-col gap-6  py-6 ">
            <p className="text-2xl ">Description</p>
            <p className="text-base pe-2">{job_description}</p>
          </div>
          <div className="mt-4 lg:mt-0 flex flex-col lg:gap-4">
            {status !== "accepted" && (
              <button
                onClick={() => handleApprove(id)}
                disabled={load}
                className="uppercase bg-[#008000] disabled:cursor-not-allowed justify-center w-60 p-2 flex items-center font-bold text-white rounded-md mb-4 lg:mb-0"
              >
                {load && id == selectId ? (
                  <MiniLoader color="border-green-400" />
                ) : (
                  <div className="flex items-center">
                    <FaCheck className=" mr-4" />
                    Accept Job
                  </div>
                )}
              </button>
            )}

            {status !== "rejected" && (
              <button
                onClick={() => handleReject(id)}
                disabled={load}
                className="uppercase bg-red-600 disabled:cursor-not-allowed  justify-center flex items-center w-60 font-bold text-white rounded-md p-2 "
              >
                {load && id == rejectid ? (
                  <MiniLoader color="border-red-400" />
                ) : (
                  <div className="flex items-center">
                    <RxCross1 className=" font-extrabold mr-4 " /> Reject the
                    job
                  </div>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminViewJobs;
