import { NavLink, useNavigate } from "react-router-dom";
import { useUserinfo } from "../Context/AuthContext";
import { MdDashboardCustomize } from "react-icons/md";
import { FaArrowDown, FaArrowUp, FaThList } from "react-icons/fa";
import { BsPersonWorkspace } from "react-icons/bs";
import { FaNetworkWired } from "react-icons/fa";
import { BiLogOutCircle } from "react-icons/bi";
import { IoSettingsSharp } from "react-icons/io5";
import { useLogout } from "../Services/Logout/useLogout";
import { FaUserSlash } from "react-icons/fa";
import { useEffect, useState } from "react";
const AdminSideBar = () => {
  const { dispatch } = useUserinfo();
  const { mutate: logout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const handleClick = () => {
    dispatch({ type: "logout" });
    logout();
  };

  const AdminNavLinks = [
    {
      title: "Dashboard",
      to: `/admin/dashboard`,
      icon: <MdDashboardCustomize />,
    },
    {
      title: "Approved Jobs List",
      to: `/admin/jobs`,
      icon: <FaNetworkWired />,
    },

    {
      title: "Pending Jobs List",
      to: `/admin/pending-jobs`,
      icon: <MdDashboardCustomize />,
    },
    {
      title: "Rejected Jobs List",
      to: `/admin/rejected`,
      icon: <FaNetworkWired />,
    },
    {
      title: "Deactive Users List",
      to: `/admin/deactive-users`,
      icon: <FaUserSlash />,
    },

    { title: "Candidates Lists", to: `/admin/candidates`, icon: <FaThList /> },

    {
      title: "Employers List",
      to: `/admin/employeers`,
      icon: <BsPersonWorkspace />,
    },
    // {
    //   title: "Settings",
    //   to: "/admin/settings",
    //   icon: <IoSettingsSharp />,
    // },
  ];

  const navigate = useNavigate();
  useEffect(() => {
    toggleMenu(false);
  }, [navigate]);
  return (
    <div className="relative  md:pb-20 w-full">
      <button
        className="md:hidden  bg-btn-primary text-white px-4 py-2 rounded mb-4 w-full flex justify-between items-center"
        onClick={toggleMenu}
      >
        {isOpen ? "Hide Navigation" : "Show Navigation"}
        <span>{isOpen ? <FaArrowUp /> : <FaArrowDown />}</span>
      </button>
      <div className={`${isOpen ? "" : "hidden"} md:block mx-auto`}>
        <ul className={`flex flex-col    gap-2 `}>
          {AdminNavLinks.map((NavValue, i) => {
            const { title, icon, to } = NavValue;
            return (
              <li key={i} className=" md:py-3  lg:py-4">
                <NavLink to={to} className="flex admin  gap-2 items-center">
                  {icon} {title}
                </NavLink>
              </li>
            );
          })}

          <button
            className="  flex gap-2 items-center  md:py-3  lg:py-4 text-start"
            onClick={handleClick}
          >
            <BiLogOutCircle /> Logout
          </button>
        </ul>
      </div>
    </div>
  );
};

export default AdminSideBar;
