import { useEffect, useRef, useState } from "react";
import Logo from "./Logo";
import { Link, NavLink, useLocation } from "react-router-dom";
import Minicart from "../Reuseables/Minicart";
import { GiHamburgerMenu } from "react-icons/gi";
import { RxCross2 } from "react-icons/rx";
import Mobilenav from "./Mobilenav";
import loginicon from "../assets/login-icon.webp";
import { BsCart } from "react-icons/bs";
import { useUserinfo } from "../Context/AuthContext";
import Sidebar from "./Sidebar";
import LoginForm from "./LoginForm";
import { FaUser } from "react-icons/fa";
import MiniJobsCart from "./MiniJobsCart";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useGetBasket } from "../Services/Candidate/useGetBasket";
import { BASE_URL_IMG } from "../config/Config";
import { useEmployerDetails } from "../Services/Employer/useEmployerDetails";
import logo from "../assets/Profile-picture.png";
import { useCandidateDetails } from "../Services/Candidate/useCandidateDetails";
const Navbar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [showLogin, setshow] = useState(false);
  const [showMblNav, setshowMblNav] = useState(false);
  const [profile, showprofile] = useState(false);
  const [cart, setcart] = useState(false);
  const { auth, user_type, username } = useUserinfo();
  const { data } = useGetBasket({
    enabled: user_type, // Enable the query only when user is logged in
  });
  // canidate data
  const { data: candidateData } = useCandidateDetails();
  //Employer data
  const { data: EmployerData } = useEmployerDetails();
  const [userImg, setUserImg] = useState(logo);
  const {
    avatar_image,
    license_number,
    address_1,
    country,
    company_name,
    company_size,
  } = EmployerData?.data?.data || [];

  const candidateAvatar = candidateData?.data?.data?.candidate_avatar_image;
  // sticky Navbar no scroll
  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 60 && window.screen.width > 1000);
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  const location = useLocation();
  useEffect(() => {
    if (user_type === "candidate" && candidateAvatar) {
      setUserImg(`${BASE_URL_IMG + candidateAvatar}`);
    } else if (user_type === "employer" && avatar_image) {
      setUserImg(`${BASE_URL_IMG + avatar_image}`);
    } else {
      setUserImg(logo); // Default image
    }
  }, [user_type, candidateAvatar, avatar_image]);
  useEffect(() => {
    showprofile(null); // Set the profile state to null
  }, [location.pathname]);

  // Close sidebar when clicking outside of it
  const sidebarRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        showprofile(false); // Hide sidebar if clicked outside of it
      }
    };

    if (profile) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profile]);

  const handlesidebar = () => {
    showprofile(!profile);
  };
  const handleshow = () => {
    setshow(!showLogin);
  };
  return (
    <section
      className={`${
        isSticky && "fixed top-0 bottom-0 shadow   w-full  z-30 bg-white h-20"
      }   shadow `}
    >
      <div className=" flex justify-between     w-11/12 mx-auto  items-center ">
        <div className="flex    w-full lg:w-auto  md:text-sm   relative justify-between items-center  gap-10">
          <NavLink to="/">
            <Logo width={210} isSticky={isSticky} />
          </NavLink>
          <div className="lg:block hidden">
            <nav>
              <ul className="flex gap-4 items-center   text-lg  uppercase m">
                <li className=" ">
                  <NavLink to="/">HOME</NavLink>
                </li>

                <li>
                  <NavLink to="/jobs">JOBS</NavLink>
                </li>

                {user_type == "employer" &&
                license_number &&
                company_name &&
                company_size &&
                address_1 &&
                country ? (
                  <li>
                    <NavLink to="candidates">Candidates</NavLink>
                  </li>
                ) : (
                  ""
                )}
                {auth && (
                  <li>
                    <NavLink to="/messages">MESSAGES</NavLink>
                  </li>
                )}
              </ul>
            </nav>
          </div>
          <div className="lg:hidden text-2xl">
            {showMblNav ? (
              <RxCross2
                className="bg-[#4e007a] text-white p-1 "
                onClick={() => setshowMblNav(!showMblNav)}
              />
            ) : (
              <div className="flex gap-2">
                <GiHamburgerMenu
                  className="font-bold bg-[#4e007a] text-white p-1"
                  onClick={() => setshowMblNav(!showMblNav)}
                />
                {!auth ? (
                  <Link to="/login">
                    <FaUser className="font-bold bg-[#4e007a] text-white p-1" />
                  </Link>
                ) : (
                  <FaUser
                    className="font-bold bg-[#4e007a] text-white p-1"
                    onClick={() => showprofile(!profile)}
                  />
                )}
              </div>
            )}
          </div>
        </div>
        <div className="lg:block hidden">
          <nav>
            <ul className="flex gap-4    uppercase text-lg  items-center">
              <li>
                <NavLink to="/about-us">ABOUT US</NavLink>
              </li>
              <li>
                <NavLink to="/contact-us">Contact US</NavLink>
              </li>

              {auth && (
                <>
                  <button onClick={() => handlesidebar()}>
                    <div>
                      <div className="flex items-center  cursor-pointer   font-semibold gap-2">
                        <div className=" rounded-full border  overflow-hidden w-12 h-12 ">
                          <img
                            className="   w-full h-full   object-contain "
                            src={userImg}
                            alt="profile"
                            loading="lazy"
                          />
                        </div>
                        <p>{username}</p>
                        {!profile ? (
                          <IoIosArrowDown className="text-3xl hover:text-btn-primary" />
                        ) : (
                          <IoIosArrowUp className="text-3xl hover:text-btn-primary" />
                        )}
                      </div>
                    </div>
                  </button>
                  {user_type == "candidate" && (
                    <button
                      className="relative cursor-pointer hover:text-btn-primary"
                      onClick={() => setcart(!cart)}
                    >
                      <div className="  gap-4 flex items-center font-semibold">
                        <BsCart className="text-2xl" />
                      </div>

                      <div className="rounded-full border-2 absolute bottom-6 border-purple-950  p-1 px-2   text-sm left-0 ">
                        {data?.data?.results?.count}
                      </div>
                    </button>
                  )}
                </>
              )}
              {!auth && (
                <button
                  className="font-semibold flex items-center  text-sm gap-4 cursor-pointer"
                  onClick={() => handleshow()}
                >
                  {/* <NavLink to="/login"></NavLink> */}
                  LOGIN/REGISTRATION
                  <img src={loginicon} width={35} alt="register icon" />
                </button>
              )}
            </ul>
          </nav>
        </div>
      </div>

      {showMblNav && (
        <Minicart style={"w-full left-0   lg:hidden block shadow-lg p-6"}>
          <Mobilenav setMblNav={setshowMblNav} />
        </Minicart>
      )}

      {showLogin && !auth && (
        <Minicart style={" right-4"} data={isSticky} set={setshow}>
          <LoginForm
            set={setshow}
            paddingMain="lg:p-8"
            width="lg:w-full xl:w-full md:w-full"
            fontSize="text-xs"
          />
        </Minicart>
      )}
      {profile && (
        <Minicart
          style={"p-4 px-8  w-[75%] right-0  sm:w-[25%] sm:right-10"}
          data={isSticky}
          set={showprofile}
          profile={profile}
        >
          <Sidebar
            style={"text-sm"}
            hide="hidden"
            baseurl={
              user_type == "candidate" ? "/dashboard/" : "/employer-dashboard/"
            }
            set={showprofile}
            gap="gap-3 text-sm"
            showprofile={showprofile}
          />
        </Minicart>
      )}
      {cart && (
        <Minicart
          style={"p-8  w-[25%] overflow-auto right-10"}
          data={isSticky}
          set={setcart}
        >
          <MiniJobsCart setcart={setcart} />
        </Minicart>
      )}
    </section>
  );
};

export default Navbar;
