import React from "react";

const JobStatusIndicator = () => {
  return (
    <div className="flex">
      <div className="border-2 p-4 space-y-3">
        <div className="flex flex-col justify-center items-center">
          <div className=" bg-green-600 text-white px-4 py-2">Accepted</div>
          <p>Applicant Profile Accepted</p>
        </div>
        <hr />
        <div className="flex flex-col justify-center items-center">
          <div className=" bg-yellow-500 text-white px-4 py-2">Pending</div>
          <p>Applicant Profile Pending</p>
        </div>
        <hr />
        <div className="flex flex-col justify-center items-center">
          <div className=" bg-red-600 text-white px-4 py-2">Accepted</div>
          Applicant Profile Rejected
        </div>
      </div>
    </div>
  );
};

export default JobStatusIndicator;
