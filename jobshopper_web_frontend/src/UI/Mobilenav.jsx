import { useEffect, useRef } from "react";
import { GrLogin } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { useUserinfo } from "../Context/AuthContext";

const Mobilenav = ({ setMblNav }) => {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setMblNav(false);
      }
    }
    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);
  const handleclick = () => {
    setMblNav(false);
  };
  const { auth } = useUserinfo();
  return (
    <div ref={ref}>
      <ul className="flex  w-full  flex-col gap-4     mblnav  font-semibold uppercase ">
        <li onClick={handleclick} className="    border-b pb-2">
          <NavLink to="/">HOME</NavLink>
        </li>
        <li onClick={handleclick} className="  border-b pb-2">
          <NavLink to="/jobs">JOBS</NavLink>
        </li>
        <li onClick={handleclick} className="  border-b pb-2">
          <NavLink to="/contact-us">CANDIDATES</NavLink>
        </li>
        <li onClick={handleclick} className="  border-b pb-2">
          <NavLink to="/about-us">ABOUT US</NavLink>
        </li>
        <li onClick={handleclick} className="  border-b pb-2">
          <NavLink to="/contact-us">Contact US</NavLink>
        </li>

        {!auth && (
          <li onClick={handleclick} className="font-bold ">
            <NavLink
              to="/login"
              onClick={handleclick}
              className="flex items-center gap-4 cursor-pointer"
            >
              LOGIN/REGISTRATION
              <GrLogin />
            </NavLink>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Mobilenav;
