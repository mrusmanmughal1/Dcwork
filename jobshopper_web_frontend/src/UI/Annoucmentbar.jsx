import { FaFacebookF } from "react-icons/fa";
import { FaLinkedinIn } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

const Annoucmentbar = () => {
  return (
    <div className="bg-[#f5f5f5]">
      <div className="w-11/12 mx-auto md:py-3 2xl:py-3    py-2 flex justify-between">
        <div className="text-xs">
          <a href="mailto:info@jobsshopper.com">info@jobsshopper.com</a>
        </div>
        <div className="flex md:gap-8 gap-4 ">
          <a href="https://www.facebook.com/JobsShopperus/" target="_blank">
            {" "}
            <FaFacebookF />
          </a>
          <a href="https://x.com/JobsShopper" target="_blank">
            <FaXTwitter />
          </a>
          <a
            href="https://pk.linkedin.com/company/humanstaffingsolution"
            target="_blank"
          >
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </div>
  );
};

export default Annoucmentbar;
