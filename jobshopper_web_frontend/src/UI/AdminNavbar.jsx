import Logo from "../assets/logo.webp";
import image from "../assets/bg-page-top.jpg";
import { IoMdLogOut } from "react-icons/io";
import { AiOutlineNotification } from "react-icons/ai";
import { useLogout } from "../Services/Logout/useLogout";
import { NavLink } from "react-router-dom";
const AdminNavbar = () => {
  const { mutate: logout, isLoading } = useLogout();
  const handleClick = () => {
    logout();
    showprofile(false);
  };
  return (
    <div className="shadow-sm">
      <div className="w-11/12 mx-auto">
        <div>
          <div className="flex   justify-between items-center">
            <div className={` "pb-0" : "pb-2 w-36  xl:w-auto "}`}>
              <img src={Logo} alt="" width={150} />
            </div>

            <div className="flex   items-center gap-6">
              <NavLink to="/admin/dashboard">
                <div className="flex gap-2 bg-purple-800 text-white   p-2 md:p-3 rounded-sm ">
                  <div className="flex items-center    ">
                    <p className=" text-[8px] md:text-sm  font-semibold ">
                      Administrator
                    </p>
                  </div>
                </div>
              </NavLink>
              <div className="flex gap-2 relative">
                {/* <p className="md:text-2xl hover:border-purple-700 border    transition-all duration-500  hover:border hover:shadow-lg shadow-md p-2 rounded-md hover:text-btn-primary cursor-pointer ">
                  <AiOutlineNotification />
                </p>
                <p className="w-2  h-2 left-6 top-1 bg-red-700 absolute  animate-ping rounded-full top"></p> */}

                <button
                  disabled={isLoading}
                  onClick={handleClick}
                  className="md:text-2xl hover:border-red-700 border   transition-all duration-500  hover:border hover:shadow-lg shadow-md p-2 rounded-md hover:text-red-500 cursor-pointer"
                >
                  {" "}
                  <IoMdLogOut />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
