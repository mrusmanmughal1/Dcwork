import { BiSolidRightArrowSquare, BiWorld } from "react-icons/bi";
import { BiSolidLeftArrowSquare } from "react-icons/bi";
import Slider from "react-slick";
import { useGetFeaturedJobs } from "../Services/Jobs/useGetFeaturedJobs";
import { NavLink } from "react-router-dom";
import { useRef } from "react";
import { PiMoneyFill } from "react-icons/pi";
import MiniLoader from "./MiniLoader";
import ErrorMsg from "./ErrorMsg";
const   FeaturedJobs = () => {
  const { data, isPending, isError } = useGetFeaturedJobs();
  const sliderRef = useRef(null);
  const settings = {
    infinite: data?.data?.results?.results?.length > 1,
    speed: 500,
    autoplaySpeed: 3000,
    arrows: false,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1, // Ensure only 1 slide is shown on smaller screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1, // Ensure only 1 slide is shown on smaller screenss
          slidesToScroll: 1,
        },
      },
    ],
  };
  if (isPending)
    return (
      <div className="py-10">
        <MiniLoader />
      </div>
    );
  if (isError || data?.data?.results?.count == 0)
    return <ErrorMsg ErrorMsg={"No Featured Jobs Available"} />;
  return (
    <div className=" w-full mx-auto       ">
      <div className="flex items-center  justify-between border-b-2">
        <div className="font-bold">Featured Jobs</div>
        <div className=" flex justify-between py-4 ">
          <span>
            <BiSolidLeftArrowSquare
              onClick={() => sliderRef.current.slickPrev()}
              className="text-2xl text-purple-900  hover:cursor-pointer"
            />
          </span>
          <span>
            <BiSolidRightArrowSquare
              onClick={() => sliderRef.current.slickNext()}
              className="text-2xl text-purple-900 hover:cursor-pointer"
            />
          </span>
        </div>
      </div>
      <div className="mx-auto pt-4 md:w-[300px] 2xl:w-[340px]  bg-white shadow-md mb-4  ">
        <Slider {...settings} ref={sliderRef}>
          {data?.data?.results?.results?.map((val, i) => {
            const { title, company_image, job_skill, rate, rate_unit } = val;

            return (
              <div className="bg-white " key={i}>
                <NavLink to={`/job-Details/${val.id}`}>
                  <div className="  relative      ">
                    <div className="   w-42 md:w-62 overflow-hidden">
                      <span className="absolute z-[99] bg-red-900 text-white  px-2 text-xs">
                        Featured
                      </span>
                    </div>
                    <div className="p-3 pt-5 space-y-1">
                      <p className="capitalize font-bold   text-btn-primary   ">
                        {title}
                      </p>
                      <div className="   bg-white">
                        {val.remote ? (
                          <p className="text-xs flex items-center gap-2">
                            <BiWorld /> {val.hybrid ? "Hybrid" : "Remote"}
                          </p>
                        ) : (
                          <div>
                            <p className="text-xs flex gap-2  items-center">
                              <BiWorld />
                              {val?.addresses?.map((val, index) => (
                                <span key={index}>
                                  {val.city}{" "}
                                  {index < val.addresses?.length - 1 && ","}{" "}
                                </span>
                              ))}
                            </p>
                          </div>
                        )}
                      </div>
                      <p className="flex  text-xs  items-center gap-2">
                        <PiMoneyFill /> Salary : {rate}$ / {rate_unit}
                      </p>
                    </div>
                    <div className="border-t text-xs p-2">
                      <span className="font-semibold">Required Skills :</span>{" "}
                      {job_skill?.slice(0, 4).map((val, index) => (
                        <span key={index}>
                          {" "}
                          {val}
                          {index < job_skill?.length - 1 && ","}{" "}
                        </span>
                      ))}
                      {job_skill && job_skill?.length > 3 && <span> ...</span>}
                    </div>
                  </div>
                </NavLink>
              </div>
            );
          })}
        </Slider>
      </div>
      {/* <div className=" flex justify-end pt-4">
        <button className="border-2 border-purple-900  text-xs rounded-md font-bold text-purple-900 hover:text-white px-4 py-2 hover:bg-purple-900">
          VIEW MORE
        </button>
      </div> */}
    </div>
  );
};

export default FeaturedJobs;
