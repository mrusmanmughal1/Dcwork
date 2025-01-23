import { NavLink } from "react-router-dom";
import Loader from "../../UI/Loader";
import { useEmployerDetails } from "../../Services/Employer/useEmployerDetails";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useFormik } from "formik";
import { Updatepassword } from "../../helpers/Schema/FormValidation";
import { useCandidateManageProfile } from "../../Services/Candidate/CandidateManageProfile";
import { useUpdateEmployer } from "../../Services/Employer/useUpdateEmployer";
import MiniLoader from "../../UI/MiniLoader";
import { useState } from "react";

const MyProfileEmployers = () => {
  const [showpassword, setshowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const { password, confirmPassword } = showpassword;

  const { data: Employer, isLoading: isLoadingEmployer } = useEmployerDetails();
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
    first_name,
    last_name,
    email,
    phone,
    website,
    company_name,
    company_size,
    license_number,
    about,
    address_1,
  } = Employer?.data?.data || {};

  const { mutate: updateProfile, isPending } = useUpdateEmployer();

  const initialValues = {
    old_password: "",
    new_password: "",
    confirm_password: "",
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

              new_password: "",
              confirm_password: "",
            },
          });
        },
      });
    },
    validationSchema: Updatepassword,
  });

  if (isLoadingEmployer) return <Loader style="pt-20" />;
  const handleclick = (field) => {
    setshowPassword((prev) => ({
      ...prev,
      [field]: !prev[field], // Toggle the visibility state for the specific field
    }));
  };
  return (
    <div className="w-full  md:w-3/4">
      <div className="flex justify-between">
        <p className="text-3xl font-semibold  tracking-wider">
          ACCOUNT INFORMATION
        </p>
        <NavLink
          to="/employer-dashboard/profile"
          className="text-btn-primary hover:font-medium duration-500"
        >
          {" "}
          Edit
        </NavLink>
      </div>
      <div className="flex gap-10 sm:gap-24 py-8">
        <div className="w-full">
          <div className="flex   flex-col gap-5">
            <div className="flex justify-between">
              <p className="font-semibold">Company Name</p>{" "}
              <p>{company_name}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Email</p> <p>{email}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">First Name</p> <p>{first_name}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Last name</p> <p>{last_name}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Website</p> <p>{website}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Phone</p> <p>{phone}</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Company Size</p>{" "}
              <p> ( {company_size} ) Employees</p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">License Number</p>{" "}
              <p> {license_number} </p>
            </div>
            <div className="flex justify-between">
              <p className="font-semibold">Company Address</p>{" "}
              <p> {address_1} </p>
            </div>
            <div className=" ">
              <p className="font-semibold w-48 ">About Company</p>
              <p className="text-justify">{about}</p>
            </div>
          </div>
        </div>
      </div>

      <div className=" border-t border-b  py-5 flex flex-col gap-4">
        <p className="tracking-wider text-xl font-semibold">
          APPLICATION HISTORY
        </p>
        <p className="text-sm">
          {Employer?.data.last_30_days_applications_message} &nbsp;
          <NavLink
            to={"/employer-dashboard/applied"}
            className="text-btn-primary"
          >
            View application
          </NavLink>
        </p>
      </div>
      <div className=" w-full pt-5 flex flex-col gap-4">
        <p className="tracking-wider text-xl font-semibold">
          Password Managment
        </p>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="flex flex-col gap-2 w-full">
            <div className="relative ">
              <label htmlFor="old_password" className="font-semibold ">
                Old Password
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Old Password"
                  name="old_password"
                  id="old_password"
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
              <label htmlFor="new_password" className="font-semibold ">
                New Password
              </label>

              <div className="relative">
                <div
                  onClick={() => handleclick("password")}
                  className="absolute hover:cursor-pointer right-4 top-1/3"
                >
                  {password ? (
                    <FaEyeSlash name="confirmPassword" />
                  ) : (
                    <FaEye name="confirmPassword" />
                  )}
                </div>
                <input
                  type={`${password ? "text" : "password"}`}
                  placeholder="New Password"
                  name="new_password"
                  id="new_password"
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
                {isPending ? <MiniLoader /> : "Update Password"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MyProfileEmployers;
