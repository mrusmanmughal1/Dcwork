import { BiWorld } from "react-icons/bi";
import { CiClock2 } from "react-icons/ci";
import { FaCartPlus } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import { useJobBasket } from "../Services/Candidate/useJobBacket";
import { useUserinfo } from "../Context/AuthContext";
import { EMPLOYER } from "../utils/Constants";
import { MdOutlineSettings, MdOutlineWorkspacePremium } from "react-icons/md";
import DaysAgo from "../helpers/DatesTime/DaysAgo";
import { FaMoneyBillAlt } from "react-icons/fa";
import Model from "../Reuseables/Model";
import SelectResumeModel from "../Reuseables/SelectResumeModel";
import { useState } from "react";
const Job = ({ job = [], rec, JobStatus }) => {
  const navigate = useNavigate();
  const [showModel, setshowModel] = useState(false);

  const { user_type } = useUserinfo();
  const { mutate: jobbasket } = useJobBasket();
  // status of the job

  const handleclick = (id) => {
    if (user_type !== "candidate") {
      navigate("/register", { state: "candidate" });
    } else {
      jobbasket(id);
    }
  };

  // hanldeApply NOw
  const handleApplyNOw = () => {
    if (user_type !== "candidate") {
      navigate("/register", { state: "candidate" });
    } else {
      setshowModel(job.id);
    }
  };

  // cart and filter
  const carted = user_type && JobStatus?.data?.basket_jobs?.includes(job?.id);
  const applied = user_type && JobStatus?.data?.applied_jobs?.includes(job?.id);
  const buttonText = carted ? "Added" : applied ? "Applied" : "Add";

  // Determine the button class based on buttonText
  const buttonClass =
    buttonText === "Added"
      ? "bg-primary-green border-white text-white "
      : buttonText === "Applied"
      ? "bg-btn-primary text-white"
      : "border-purple-900 text-purple-900  hover:bg-btn-primary hover:text-white";
  const formattedSalary = new Intl.NumberFormat("en-US").format(job?.rate);

  return (
    <div
      className={`${
        !rec && "shadow-lg  my-4   border-2 "
      } border-b hover:bg-slate-100 bg-white `}
    >
      <div className=" flex flex-col  md:flex-row   p-5   relative">
        <div className="absolute  left-0 -top-0">
          {job?.featured ? (
            <p className="text- bg-btn-primary   flex items-center gap-1 text-white p-[1px] ps-3 pe-1">
              <span className="text-[9px]">Featured</span>
              <MdOutlineWorkspacePremium />
            </p>
          ) : (
            ""
          )}
        </div>
        <div className=" w-full   md:w-[30%] flex flex-col  ">
          <div className="leading-5">
            <p className="uppercase font-bold  ">{job?.title}</p>
            <p className="font-semibold text-xs text-slate-500">
              {job.company_name}
            </p>
          </div>
          {job.hybrid ? (
            <p className="text-xs flex items-center gap-2">
              <BiWorld /> Hybrid
            </p>
          ) : job.remote ? (
            <p className="text-xs flex items-center gap-2">
              <BiWorld /> Remote
            </p>
          ) : job?.addresses?.length ? (
            <div>
              <p className="text-xs flex  gap-2 items-center">
                <BiWorld />
                {job?.addresses?.slice(0, 2).map((val, index) => (
                  <span key={index}>
                    {val.city}
                    {index < job?.addresses?.length - 1 && ","}
                  </span>
                ))}
                {job?.addresses?.length > 2 && <span>...</span>}
              </p>
            </div>
          ) : null}
          <div className="flex gap-2  ">
            <p className="text-xs font-semibold flex  pt-1  gap-1">
              <MdOutlineSettings className="" />
            </p>
            <div className="flex text-xs">
              {
                job?.job_skill
                  ?.map((val, index) => val.trim()) // Trim each skill value to remove extra spaces
                  ?.join(", ").length > 50 // Join all skills with a comma and space
                  ? `${job?.job_skill
                      .map((val) => val.trim()) // Trim each skill
                      .join(", ") // Join them with commas and spaces
                      .slice(0, 50)}...` // Slice to 50 characters and add "..."
                  : job?.job_skill
                      ?.map((val) => val.trim()) // Trim each skill
                      ?.join(", ") // Join them with commas and spaces
              }
            </div>
          </div>
        </div>
        <div className=" w-full md:w-[30%] text-sm md:p-1">
          <p className="flex gap-2 items-center text-btn-primary ">
            <CiClock2 className="font-extrabold  " />
            {job?.contract_type.replace("_", " ")}
          </p>
          <div>
            <div className="  items-start gap-1">
              <div className="flex">
                <FaMoneyBillAlt className="text-gray-500 pt-1 text-lg " />{" "}
                &nbsp;Salary :&nbsp;
                {job?.currency_symbol}
                {formattedSalary}
                {job?.rate_unit && (
                  <p className="capitalize ">
                    /{job?.rate_unit.replace("_", " ")}
                  </p>
                )}
              </div>
              <p className="w-60">
                Work Auth :&nbsp;
                {job?.work_authorization?.map((val, i) => (
                  <span key={i}>
                    {val}
                    {i < job?.work_authorization?.length - 1 && ","}&nbsp;
                  </span>
                ))}
              </p>
              <div className=" flex gap-2  absolute text-slate-400  capitalize  text-xs bottom-1">
                <DaysAgo date={job?.posted_at} />
              </div>
            </div>
          </div>
        </div>
        <div className="md:w-[40%] pb-2  w-full flex  justify-end gap-2  md:flex-row  md: items-center text-purple-900">
          {buttonText !== "Applied" && user_type !== EMPLOYER && (
            <button
              onClick={() => handleApplyNOw()}
              className=" text-[10px] md:text-xs    flex items-center font-semibold  px-4 rounded-md  py-3 lg:py-3 xl:py-3 2xl:py-3 border-2 border-purple-900  hover:text-white hover:bg-purple-900"
            >
              Apply Now
            </button>
          )}

          {user_type !== EMPLOYER && (
            <button
              disabled={buttonText !== "Add"}
              onClick={() => handleclick(job.id)}
              className={`flex text-[10px] md:text-xs   w-20  font-semibold  flex-col items-center px-6 rounded-md py-[0.25rem] sm:py-3 md:py-[0.25rem] lg:py-1 xl:py-1 border-2 ${buttonClass} `}
            >
              <FaCartPlus className="text-base" />
              {buttonText}
            </button>
          )}
          <NavLink
            to={`/job-Details/${job.id}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className=" md:text-xs  text-[10px]     font-semibold    px-4   rounded-md py-3  lg:py-3 2xl:py-3  xl:py-3 border-2 border-purple-900  hover:text-white hover:bg-purple-900">
              View More
            </button>
          </NavLink>
        </div>
      </div>

      {showModel && (
        <Model model={showModel}>
          <div>
            <SelectResumeModel
              showModel={showModel}
              setshowModel={setshowModel}
            />
          </div>
        </Model>
      )}
    </div>
  );
};

export default Job;
