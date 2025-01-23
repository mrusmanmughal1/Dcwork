import React from "react";

const FeaturedMain = ({ setfeaturepage }) => {
  return (
    <div>
      <div className="border-2 p-4">
        <p>
          Choosing the <b>Featured Job</b> means your listing will get better
          visibility and show up more often in search results, making it easier
          for relevant job seekers to find and apply to your job.
        </p>
        <div className="space-y-3">
          <div className="mt-2">
            <p className="font-semibold">Job Budget</p>
            <p>
              Fixed Budget <span className="font-semibold"> (US $ 5.00)</span>{" "}
              will be charged from you.
            </p>
          </div>
          <div className=" flex items-center">
            <p className="p-1 border-2 px-4 font-semibold">$</p>
            {/* <input type="text" className="bg-white ps-2" value={5} disabled /> */}
            <p className="p-1 font-semibold border-2 px-4">5.00</p>
          </div>
        </div>
      </div>
      <div className="text-end mt-3">
        <button
          onClick={() => setfeaturepage(1)}
          className="bg-btn-primary p-2 rounded-md text-white font-medium px-4"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default FeaturedMain;
