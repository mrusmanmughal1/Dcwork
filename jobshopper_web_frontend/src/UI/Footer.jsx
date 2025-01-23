import FooterBottom from "./FooterBottom";
import { CiMail } from "react-icons/ci";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { useUserinfo } from "../Context/AuthContext";
import { FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  const { user_type } = useUserinfo();
  return (
    <div className=" border-t">
      {user_type !== "administrator" && <FooterMain />}
      <FooterBottom />
    </div>
  );
};

export const FooterMain = () => {
  const { user_type } = useUserinfo();
  const sendTo =
    user_type == "employer"
      ? "/employer-dashboard/profile"
      : "/dashboard/profile";
  return (
    <div className="flex md:flex-row flex-wrap    gap-12  md:gap-4    flex-col px-6   sm:px-24   py-20">
      <div className="flex flex-col flex-1 items-center  ">
        <p className="font-bold text-[#4e007a] pb-4">JOBS</p>
        <ul className="flex flex-col  text-center gap-2">
          <li>
            <NavLink to="/jobs">Browse Jobs</NavLink>
          </li>
          <NavLink to={sendTo}>Manage Profile</NavLink>
        </ul>
      </div>
      <div className="flex flex-col  flex-1  items-center  ">
        <p className="font-bold text-[#4e007a] pb-4">OTHER</p>
        <ul className="flex flex-col gap-2 items-center">
          <li>
            <NavLink to="/">Home</NavLink>
          </li>
          <li>
            <NavLink to="/about-us">About Us </NavLink>
          </li>
          <li>
            <NavLink to="/contact-us">Contact Us</NavLink>
          </li>
          <li>
            <NavLink to="/privacy-policy">Privacy Policy </NavLink>
          </li>
        </ul>
      </div>
      <div className="flex flex-col  items-center flex-1 sm:text-center  ">
        <p className="font-bold text-[#4e007a]  pb-4">CONTACT US</p>
        <div className="flex justify-center">
          <ul className="flex flex-col gap-2 ">
            <a href="mailto:info@jobsshopper.com" target="_blank">
              <li className="flex items-center gap-2 ">
                <span className="bg-blue-900 p-2 rounded-full">
                  <CiMail className="  text-white " />{" "}
                </span>
                info@jobsshopper.com
              </li>
            </a>
            <a href="https://www.instagram.com/job_shopper/" target="_blank">
              <li className="flex items-center  gap-2">
                <span className="bg-red-500 p-2 rounded-full">
                  <FaInstagram className="text-white" />
                </span>
                Instagram
              </li>
            </a>
            <a href="https://www.facebook.com/JobsShopperus/" target="_blank">
              <li className="flex items-center gap-2">
                <span className="bg-blue-900 p-2 rounded-full">
                  <FaFacebook className="text-white" />
                </span>{" "}
                Facebook
              </li>
            </a>
            <a href="https://x.com/jobsshopper" target="_blank">
              <li className="flex items-center gap-2">
                <span className="bg-black p-2 rounded-full">
                  <FaXTwitter className="text-white" />
                </span>
                X
              </li>
            </a>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
