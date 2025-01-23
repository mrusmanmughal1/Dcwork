import bgimp from "../assets/jobsshopper_banner.webp";
import mbl from "../assets/jobshopper _mobile.webp";
import { useEffect, useState } from "react";
import MainSearchBox from "./MainSearchBox";
const SearchJobsMain = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="   relative ">
      <link rel="preload" href={bgimp} as="image" />
      <link rel="preload" href={mbl} as="image" />
      <div className="relative w-full" style={{ height: "auto" }}>
        <img
          src={bgimp}
          alt="banner"
          height="auto"
          width="100%"
          className="   hidden md:block md:h-auto w-full  object-cover"
          style={{ aspectRatio: "16 / 9" }}
        />
      </div>
      <div className="relative w-full " style={{ height: "auto" }}>
        <img
          src={mbl}
          alt="banner"
          height="auto"
          width="100%"
          className="md:hidden block object-cover h-screen "
          style={{ aspectRatio: "16 / 9" }}
        />
      </div>

      <div className="   w-full     absolute top-20   flex flex-col gap-2   abs  items-center">
        <p className="text-2xl font-medium   text-center  px-4 ">
          Join us & Explore Thousands of Jobs
        </p>
        <p className="text-sm  text-center hidden sm:block   capitalize  ">
          Enter your job title and click search to explore your perfect
          opportunity!
        </p>
        <div
          className={`

${
  isVisible
    ? "transition-transform transform translate-y-0 duration-1000 ease-out  md:w-[60%] "
    : "transition-transform transform translate-y-full duration-500 ease-in  fixed"
}

`}
        >
          <MainSearchBox />
        </div>
      </div>
    </div>
  );
};

export default SearchJobsMain;
