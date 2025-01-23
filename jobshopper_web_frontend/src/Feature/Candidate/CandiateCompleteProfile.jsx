import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import bar3 from "../../assets/CandidateBars/6.png";
import { NavLink, useNavigate } from "react-router-dom";
const CandiateCompleteProfile = () => {
  const navigate = useNavigate();
  return (
    <div className=" ">
      <div className=" flex justify-center py-2">
        <img src={bar3} alt="" />
      </div>
      <div className=" font-semibold  mt-10  bg-purple-200 py-10 space-y-2 text-lg text-center text-btn-primary">
        <p className=" uppercase text-center  text-2xl">Congratulations !</p>
        <p>Your Profile is Completed !</p>
        <p>Now You can Apply for Jobs and get Hired </p>
        <div className="flex justify-center items-center">
          <NavLink
            to="/jobs"
            className="bg-btn-primary hover:bg-purple-800 text-white py-2 px-4 rounded-md flex items-center gap-2"
          >
            Apply For a Job <FaArrowRight />
          </NavLink>
        </div>
      </div>
      <div className=" pt-4 text-end flex justify-between">
        <button onClick={() => navigate(-1)}>
          <FaArrowLeft className="text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default CandiateCompleteProfile;
