import React from "react";

const NotFound = () => {
  return (
    <div className="  relative  flex justify-center items-center flex-col  text-white text-center p-20  not-bg">
      <div className="absolute inset-0 bg-btn-primary  opacity-60 "></div>
      <div className="absolute inset-0 h-screen flex items-center justify-center flex-col">
        <p className="text-9xl  font-semibold    text-[15rem]  inset-0   drop-shadow-2xl">
          404
        </p>
        <p>
          It looks like something went wrong. The page cannot be found. Return
          Home{" "}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
