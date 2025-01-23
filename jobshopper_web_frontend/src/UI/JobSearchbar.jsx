import { FaSearch } from "react-icons/fa";
import { useEffect, useState } from "react";

const JobSearchbar = ({
  isRemote,
  handleChange,
  title,
  location,
  handleRemoteChange,
  seclicked,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Set isVisible to true when the component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div
      className={`flex-col rounded-sm md:flex sm:flex-row pt-3 px-2 pb-2 md:gap-4 bg-blurr-bg 
      
      `}
    >
      <div className="text-sm w-full">
        <p className="text-white"> Job Title </p>
        <div className="flex items-center rounded-md bg-white px-2">
          <FaSearch className="text-btn-primary" />
          <input
            type="text rounded-md"
            value={title}
            name="title"
            onChange={(e) => handleChange(e)}
            className="p-5 pe-16 outline-none w-full rounded-md"
            placeholder="Key Word / Job Title"
          />
        </div>
      </div>
      <div className="text-sm w-full">
        <p className="text-white">Where</p>
        <div className="">
          <input
            location={location}
            value={location}
            type="text"
            name="location"
            onChange={(e) => handleChange(e)}
            className="p-5 outline-none rounded-md border px-10 w-full"
            placeholder="Location"
          />
        </div>
      </div>
      <div className=" flex flex-col sm:gap-0   gap-4">
        <div className="flex gap-1  items-center mt-2 sm:mt-0 ">
          <input
            type="checkbox"
            className="text-black"
            name="isRemote"
            id="remote"
            checked={isRemote}
            onChange={(e) => handleRemoteChange(e)}
          />
          <label htmlFor="remote" className="text-sm text-white">
            Remote Only
          </label>
        </div>
        <button
          onClick={() => seclicked()}
          className="px-10 text-sm rounded-md font-bold text-white py-5 bg-[#4e007a]"
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default JobSearchbar;
