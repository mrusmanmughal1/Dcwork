import icon1 from "../assets/main-icon1.webp";
import icon2 from "../assets/main_icon2.webp";
import icon3 from "../assets/main_icon3.webp";
const MainInfoBar = () => {
  return (
    <div className=" py-16 bg-[#4a0074] text-center ">
      <div className="sm:mx-auto w-full    md:max-w-[700px] md:mx-auto flex-col flex   gap-8 items-center  md:flex-row md:gap-20 justify-center">
        <div className=" infobar text-white  relative  w-1/2   flex flex-col items-center ">
          <div className=" border-8 border-[#6f00ad] bg-[#370056] rounded-full">
            <img
              src={icon1}
              className="  aspect-auto   p-4"
              height={100}
              width={100}
              alt="Register"
            />
          </div>
          <p className="text-xs pt-4 ">1. Register account to begin applying</p>
        </div>
        <div className=" infobar relative text-white flex flex-col    w-1/2  gap-2 justify-center items-center ">
          <div className=" border-8 border-[#6f00ad] bg-[#370056] rounded-full">
            <img
              src={icon2}
              className="  aspect-auto  p-4"
              height={100}
              width={100}
              alt="Upload Resume"
            />
          </div>
          <p className="text-xs pt-4">
            2. Upload your Resume & browse hundreds of jobs
          </p>
        </div>
        <div className="    text-white flex flex-col  w-1/2    gap-2 justify-center items-center ">
          <div className=" border-8 border-[#6f00ad] bg-[#370056] rounded-full">
            <img
              src={icon3}
              className=" aspect-auto     p-4"
              height={100}
              width={100}
              alt="Apply now"
            />
          </div>
          <p className="text-xs pt-4"> 3. Apply for the jobs in seconds</p>
        </div>
      </div>
    </div>
  );
};

export default MainInfoBar;
