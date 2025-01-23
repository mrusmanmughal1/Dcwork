import { NavLink } from "react-router-dom";
import { useUserinfo } from "../Context/AuthContext";
import { useLogout } from "../Services/Logout/useLogout";
import { useState } from "react";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import useEmployerValidation from "../helpers/validate/useEmployerValidation ";
const Sidebar = ({ baseurl, gap = "gap-5", showprofile,hide }) => {
  const [isOpen, setIsOpen] = useState(true);
  const toggleMenu = () => setIsOpen(!isOpen);
  const { user_type } = useUserinfo();
  const { mutate: logout } = useLogout();
  const handleClick = () => {
    logout();
    showprofile(false);
  };
  const { employerAllData } = useEmployerValidation();
  return (
    <div className="   mx-auto  w-full  ">
      <button
        className={`md:hidden ${hide}  bg-btn-primary text-white px-4 py-2 rounded mb-4 w-full flex justify-between items-center`}
        onClick={toggleMenu}
      >
        {isOpen ? "Hide Navigation" : "Show Navigation"}
        <span>{isOpen ? <FaArrowUp /> : <FaArrowDown />}</span>
      </button>
      {/* <ul className={`flex flex-col ${gap} ${isOpen ? "" : "hidden"} md:block`}> */}
      <div className={`${isOpen ? "" : "hidden"} md:block`}>
        <ul className={`flex flex-col   ${gap} `}>
          <li className="border-b w- border-t pb-5 pt-5">
            <NavLink to={`${baseurl}myaccount`}> My Account</NavLink>
          </li>
          {user_type == "employer" && (
            <li className="border-b pb-5 ">
              <NavLink to={`${baseurl}applied`}>Job Posting History </NavLink>
            </li>
          )}
          {user_type == "candidate" && (
            <li className="border-b pb-5   ">
              <NavLink to={`${baseurl}candidate-applied-job`}>
                Job Applied{" "}
              </NavLink>
            </li>
          )}
          <li className="border-b pb-5">
            <NavLink to={`${baseurl}profile`}> Manage Profile </NavLink>
          </li>

          {user_type == "candidate" && (
            <>
              <li className="border-b pb-5">
                <NavLink to={`${baseurl}jobs-basket`}>Jobs cart</NavLink>
              </li>
              <li className="border-b pb-5">
                <NavLink to={`${baseurl}interviews-candidate`}>
                  Interviews List
                </NavLink>
              </li>
            </>
          )}
          {user_type === "employer" && employerAllData && (
            <>
              <li className="border-b pb-5">
                <NavLink to={`${baseurl}new-post`}>New Post</NavLink>
              </li>
              <li className="border-b pb-5">
                <NavLink to={`${baseurl}scheduled-interviews`}>
                  Scheduled Interviews
                </NavLink>
              </li>
              <li className="border-b pb-5">
                <NavLink to={`${baseurl}payment-history`}>
                  Payment History
                </NavLink>
              </li>
            </>
          )}

          <button className="border-b pb-5 text-start" onClick={handleClick}>
            Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
