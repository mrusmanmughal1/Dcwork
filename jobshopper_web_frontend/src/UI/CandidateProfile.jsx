import { BASE_URL_IMG } from "../config/Config";
import { MdOutlineLocationOn } from "react-icons/md";
import { CgCopy } from "react-icons/cg";
const CandidateProfile = ({ candidateData }) => {
  const url =
    "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";
  return (
    <div className="shadow-md  bg-white p-6 w-full">
      <div className="border p-2">
        <div className="flex  justify-between w-full">
          <div className="flex items-center md:w-[40%] gap-3">
            <img
              src={
                candidateData?.candidate_avatar_image
                  ? BASE_URL_IMG + candidateData?.candidate_avatar_image
                  : url
              }
              alt=""
              className="w-20 h-20 object-contain"
            />
            <div className="flex  md:w-[200px] items-center gap-5">
              <div className="">
                <p className="font-semibold 2xl:text-xl">
                  {candidateData?.first_name} {candidateData?.last_name}
                </p>
                <p className="flex items-center gap-1 text-sm 2xl:text-base">
                  <MdOutlineLocationOn /> {candidateData?.candidate_country}
                </p>
                <div className="text-xs flex items-center gap-1">
                  <CgCopy />
                  {candidateData?.candidate_job_profession?.substring(0, 25)}
                </div>
              </div>
            </div>
          </div>
          <div className="hidden md:block  w-[40%]  ">
            <div className=" text-center flex items-center flex-col justify-center pt-2 ">
              <div className="">
                <p className="text-btn-primary font-semibold capitalize">
                  industries
                </p>
                <div className="flex justify-center items-center w-[350px]">
                  <p className="text-sm">
                    {(candidateData?.candidate_focused_industries || [])
                      ?.slice(0, 10)
                      ?.map((val, iindex) => (
                        <span key={iindex}>
                          {val}
                          {iindex <
                            candidateData?.candidate_focused_industries
                              ?.length -
                              1 && ","}{" "}
                          &nbsp;
                        </span>
                      ))}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-end  w-[20%]">
            <button className="bg-btn-primary text-white px-4 py-3 rounded-md text-xs md:text-sm 2xl:text-base">
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateProfile;
