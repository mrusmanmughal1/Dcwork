import { NavLink } from "react-router-dom";
import { useCandidateDetails } from "../../Services/Candidate/useCandidateDetails";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { FaEye, FaEyeSlash, FaFileAlt } from "react-icons/fa";
import { useCandidateManageProfile } from "../../Services/Candidate/CandidateManageProfile";
import { useFormik } from "formik";
import { useState } from "react";
import {
  CandiateStep1Validation,
  Updatepassword,
} from "../../helpers/Schema/FormValidation";
const MyProfileCandidate = () => {
  const [showpassword, setshowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const {
    data: Candidates,
    isLoading: isLoadingCandidates,
    isError,

  } = useCandidateDetails();
  const initialValues = {
    old_password: "",
    new_password: "",
    confirm_password: "",
  };
  const { mutate: updateProfile, isError: errorProfile } =
    useCandidateManageProfile();
  const { password, confirmPassword } = showpassword;

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;

    if (name === "new_password" || name === "confirm_password") {
      if (e.key === " " || e.keyCode === 32) {
        e.preventDefault(); // Block space in username field
      }
    }
    if (e.key === " " && input.value.charAt(input.selectionStart - 1) === " ") {
      e.preventDefault(); // Block multiple spaces in a row
    }
  };

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    resetForm,
  } = useFormik({
    initialValues,
    onSubmit: (values) => {
      updateProfile(values, {
        onSuccess: () => {
          resetForm({
            values: {
              old_password: "",
              new_password: "", // Reset password field (if needed)
              confirm_password: "", // Reset confirm password field (if needed)
            },
          });
        },
      });
    },
    validationSchema: Updatepassword,
  });

  if (isLoadingCandidates) return <Loader style="pt-20" />;
  if (isError)
    return (
      <ErrorMsg ErrorMsg="Sorry ! unable to fetch Data right now Please Try Again later " />
    );
  const {
    first_name,
    last_name,
    email,
    phone,
    candidate_country,
    candidate_city,
    cvs,
  } = Candidates?.data?.data || {};

  const handleclick = (field) => {
    setshowPassword((prev) => ({
      ...prev,
      [field]: !prev[field], // Toggle the visibility state for the specific field
    }));
  };
  return (
    <div className="     ">
      <div className="  flex justify-between   md:w-3/4">
        <p className="text-3xl font-semibold  tracking-wider">
          ACCOUNT INFORMATION
        </p>
        <NavLink
          to="/dashboard/profile"
          className="text-btn-primary hover:font-medium duration-500"
        >
          {" "}
          Edit
        </NavLink>
      </div>
      <div className="flex gap-10 sm:gap-24 py-8">
        <div className="w-full md:w-[75%]">
          <div className="flex flex-col gap-8">
            <div className="flex justify-between">
              <p className=" font-semibold ">Email</p> <p>{email}</p>
            </div>
            <div className="flex justify-between">
              <p className=" font-semibold ">First Name</p> <p>{first_name}</p>
            </div>
            <div className="flex justify-between">
              <p className=" font-semibold ">Last name</p> <p>{last_name}</p>
            </div>
            <div className="flex justify-between">
              <p className=" font-semibold ">City</p> <p>{candidate_city}</p>
            </div>
            <div className="flex justify-between">
              <p className=" font-semibold ">Country</p>{" "}
              <p>{candidate_country}</p>
            </div>
            <div className="flex justify-between">
              <p className=" font-semibold ">Phone</p> <p>{phone}</p>
            </div>
          </div>
        </div>
      </div>
      {cvs?.length > 0 && (
        <div className="border-t  py-5    ">
          <div className="text-2xl font-semibold">Your Resume</div>
          <div className="flex gap-4  justify-center md:justify-start items-center flex-col lg:flex-row lg:w-[80%]">
            {cvs?.map((val, i) => {
              return (
                <div
                  className=" w-60 border-btn-primary border text-btn-primary p-3 gap-1 break-all  rounded-md hover:bg-btn-primary hover:text-white  flex flex-col  items-center my-2    whitespace-nowrap text-ellipsis"
                  key={val?.cv_id}
                >
                  <div className="">
                    <FaFileAlt className="text-4xl" />
                  </div>
                  <div className="break-all">
                    {i + 1}. {val?.cv_title}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className=" border-t  border-b py-5 flex flex-col gap-4">
        <p className="tracking-wider text-xl font-semibold">
          APPLICATION HISTORY
        </p>
        <p className="text-sm">
          {Candidates?.data?.recent_applications_count} &nbsp;
          <NavLink
            to="/dashboard/candidate-applied-job"
            className="text-btn-primary"
          >
            View application
          </NavLink>
        </p>
      </div>
      <div className=" w-3/4 pt-5 flex flex-col gap-4">
        <p className="tracking-wider text-xl font-semibold">
          Password Managment
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col gap-2">
            <div className="relative ">
              <label className="font-semibold ">Old Password</label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Old Password"
                  name="old_password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={validateInuts}
                  value={values.old_password}
                  maxLength={15}
                  minLength={8}
                  autoComplete="new-password"
                  className="py-3 bg-gray-100 px-2 outline-none w-full"
                />
              </div>
              {errors.old_password && touched.old_password && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.old_password}
                </p>
              )}
            </div>
            <div className="relative ">
              <label className="font-semibold ">New Password</label>

              <div className="relative">
                <div
                  onClick={() => handleclick("password")}
                  className="absolute hover:cursor-pointer right-4 top-1/3 "
                >
                  {password ? (
                    <FaEyeSlash name="password" />
                  ) : (
                    <FaEye name="password" />
                  )}
                </div>
                <input
                  type={`${password ? "text" : "password"}`}
                  placeholder="New Password"
                  name="new_password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onKeyDown={validateInuts}
                  value={values.new_password}
                  maxLength={15}
                  minLength={8}
                  autoComplete="new-password"
                  className="py-3 bg-gray-100 px-2 outline-none w-full"
                />
              </div>
              {errors.new_password && touched.new_password && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.new_password}
                </p>
              )}
            </div>

            <div className="relative">
              <label className="font-semibold ">Confirm Password</label>

              <div className="relative">
                <div
                  onClick={() => handleclick("confirmPassword")}
                  className="absolute hover:cursor-pointer right-4 top-1/3"
                >
                  {confirmPassword ? (
                    <FaEyeSlash name="confirmPassword" />
                  ) : (
                    <FaEye name="confirmPassword" />
                  )}
                </div>
                <input
                  type={`${confirmPassword ? "text" : "password"}`}
                  placeholder="Confirm Password"
                  name="confirm_password"
                  onChange={handleChange}
                  maxLength={15}
                  minLength={8}
                  onKeyDown={validateInuts}
                  onBlur={handleBlur}
                  value={values.confirm_password}
                  className="py-3 bg-gray-100 px-2 outline-none w-full"
                />
              </div>
              {errors.confirm_password && touched.confirm_password && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.confirm_password}
                </p>
              )}
            </div>
            <div className=" mt-4">
              <button className="bg-btn-primary text-white p-2 px-4 rounded-md">
                Update Password
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfileCandidate;
