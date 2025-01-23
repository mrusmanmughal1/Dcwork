import React from "react";
import { FaDownload } from "react-icons/fa";

const Button = ({ children }) => {
  return (
    <button className="px-6 flex items-center gap-2   text-center  justify-center    hover:bg-blue-800 rounded-md   py-4 bg-btn-primary text-white font-semibold">
      {" "}
      <FaDownload /> {children}
    </button>
  );
};

export default Button;
