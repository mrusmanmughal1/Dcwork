/* eslint-disable no-unused-vars */
import React from "react";
import { NavLink } from "react-router-dom";

const CvUpload = () => {
  return (
    <NavLink to='/dashboard/profile'>
    <div   className="w-72 mt cv mx-auto rela">
      <div className="bg-purple-700   flex flex-col gap-4 py-4 text-center text-white rounded-md">
        <div className=" py-4   ">
          <p className="font-semibold text-4xl px-5  ">Upload Your CV</p>
          <p className="">
            upload your CV to apply for as many jobs as you like{" "}
          </p>
        </div>
        <div className="text-center pb-4">
          <p
            className="px-4 py-2 inline-block rounded-md text-sm font-medium bg-white text-blue-500"
          >
            UPLOAD YOUR CV
          </p>
        </div>
      </div>
    </div>
    </NavLink>
  );
};

export default CvUpload;
