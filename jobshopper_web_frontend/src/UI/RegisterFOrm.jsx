import { useFormik } from "formik";
import { RegisterSchema } from "../helpers/Schema/FormValidation";
import { useRegister } from "../Services/register/useRegister";
import MiniLoader from "./MiniLoader";
import { Tooltip as ReactTooltip } from "react-tooltip";
import { FaEyeSlash, FaEye } from "react-icons/fa";
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import PhoneNumberInput from "../Reuseables/PhoneNumber";
const RegisterFOrm = () => {
  const location = useLocation();
  const candidate_Selected = location.state || {};
  const initialValues = {
    account_type:
      typeof candidate_Selected === "string" ? candidate_Selected : "",
    username: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    phone: "",
  };
  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;

    if (name === "first_name" || name === "last_name") {
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
        e.preventDefault(); // Block the space from being typed at the beginning
      }

      if (
        !/[A-Za-z\s]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete"
      ) {
        e.preventDefault(); // Block non-alphabetic and non-space keys
      }
    }
    if (name === "username") {
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
        e.preventDefault(); // Block the space from being typed at the beginning
      }

      if (
        !/[A-Za-z0-9]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete"
      ) {
        e.preventDefault(); // Block non-alphabetic and non-space keys
      }
    }
    if (
      name === "email" ||
      name === "password" ||
      name === "confirm_password"
    ) {
      if (e.key === " " || e.keyCode === 32) {
        e.preventDefault(); // Block space in username field
      }
    }
    if (
      e.key === " " &&
      input.value.charAt(input.selectionStart - 1) === " "
    ) {
      e.preventDefault(); // Block multiple spaces in a row
    }
  };

  const { mutate: Register, isPending } = useRegister();
  const [showpassword, setshowPassword] = useState({
    password: false,
    confirmPassword: false,
  });
  const { password, confirmPassword } = showpassword;

  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: async (values) => {
      await Register(values);
    },
    validationSchema: RegisterSchema,
    validate: (values) => {
      const errors = {};

      // Validate phone number based on selected country
      const phoneNumberObj = parsePhoneNumberFromString(
        `${"+" + values.phone}`,
        values.phone_country
      );

      if (values.phone && (!phoneNumberObj || !phoneNumberObj.isValid())) {
        errors.phone = "Invalid phone number for the selected country";
      }

      return errors;
    },
  });

  const handleclick = (field) => {
    setshowPassword((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  return (
    <div className="">
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="flex flex-col gap-2 md:gap-4 w-full md:w-1/2 mx-auto">
          {/* Account Type */}
          <div className="flex justify-between">
            {candidate_Selected !== "candidate" && (
              <div className=" flex flex-col gap-2 justify-between ">
                <div className="flex items-center ">
                  <p className=" font-semibold">Choose account type</p>
                </div>
                <div className="">
                  <div className="flex gap-4">
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="account_type"
                        onChange={handleChange}
                        id="account_type1"
                        value="candidate"
                      />
                      <label htmlFor="account_type1" className="font-semibold">
                        Candidate
                      </label>
                    </div>
                    <div className=" flex items-center gap-3">
                      <input
                        type="radio"
                        name="account_type"
                        id="account_type"
                        value="employer"
                        onChange={handleChange}
                      />
                      <label htmlFor="account_type" className="font-semibold">
                        Employer
                      </label>
                    </div>
                  </div>
                  {errors.account_type && touched.account_type && (
                    <p className="text-start px-1  text-sm font-semibold text-red-600">
                      {errors.account_type}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* First Name Input */}
          <div className="w-full">
            <div className="flex gap-2 items-center">
              <p className="font-semibold"> First Name </p>
            </div>
            <input
              type="text"
              className={`py-4 px-2 rounded-sm border w-full text-black font-semibold bg-gray-200 outline-none ${
                errors.first_name && touched.first_name ? "border-red-600" : ""
              }`}
              placeholder="Enter First Name "
              name="first_name"
              id="first_name"
              maxLength={50}
              onChange={handleChange}
              onKeyDown={validateInuts}
              onBlur={handleBlur}
              value={values.first_name}
            />
            {errors.first_name && touched.first_name && (
              <p className="text-start px-1  text-sm font-semibold text-red-600">
                {errors.first_name}
              </p>
            )}
          </div>

          {/* Last Name Input */}
          <div className="w-full">
            <div className="flex gap-2 items-center">
              <p className="font-semibold">Last Name </p>
            </div>
            <input
              type="text"
              className={`py-4 px-2 w-full rounded-sm border text-black font-semibold bg-gray-200 outline-none ${
                errors.last_name && touched.last_name ? "border-red-600" : ""
              }`}
              placeholder=" Enter Last Name "
              name="last_name"
              id="last_name"
              maxLength={50}
              onKeyDown={validateInuts}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.last_name}
            />
            {errors.last_name && touched.last_name && (
              <p className="text-start px-1  text-sm font-semibold text-red-600">
                {errors.last_name}
              </p>
            )}
          </div>

          {/* Username Input */}
          <div className="w-full">
            <div className="flex gap-2 items-center">
              <p className="font-semibold">User Name</p>
            </div>
            <input
              type="text"
              className={`py-4 px-2 rounded-sm border w-full text-black font-semibold bg-gray-200 outline-none ${
                errors.username && touched.username ? "border-red-600" : ""
              }`}
              placeholder="User Name"
              name="username"
              id="username"
              maxLength={15}
              autoComplete="username"
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={validateInuts}
              value={values.username}
            />
            {errors.username && touched.username && (
              <p className="text-start px-1  text-sm font-semibold text-red-600">
                {errors.username}
              </p>
            )}
          </div>

          {/* Email Input */}
          <div className="">
            <div className="flex gap-2 items-center">
              <p className="font-semibold">Email Address </p>
            </div>
            <input
              type="email"
              className={`py-4 px-2 rounded-sm border w-full text-black font-semibold bg-gray-200 outline-none ${
                errors.email && touched.email ? "border-red-600" : ""
              }`}
              placeholder="Enter Email Address"
              name="email"
              id="email"
              onChange={handleChange}
              onBlur={handleBlur}
              onKeyDown={validateInuts}
              value={values.email}
            />
            {errors.email && touched.email && (
              <p className="text-start px-1  text-sm font-semibold text-red-600">
                {errors.email}
              </p>
            )}
          </div>

          {/* Phone Number Input */}
          <PhoneNumberInput
            setFieldValue={setFieldValue}
            touched={touched}
            errors={errors}
            handleBlur={handleBlur}
            values={values}
          />

          {/* Password Input */}
          <div className="">
            <div className="flex gap-2 items-center">
              <p className="font-semibold">Password</p>
              <p className="text-xs">
                (Must contain numbers, letters, and special characters)
              </p>
            </div>
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
                className={`py-4 px-2 rounded-sm border w-full text-black font-semibold bg-gray-200 outline-none ${
                  errors.password && touched.password ? "border-red-600" : ""
                }`}
                placeholder="Enter Password"
                name="password"
                maxLength={15}
                id="password"
                onKeyDown={validateInuts}
                autoComplete="new-password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />
            </div>

            {errors.password && touched.password && (
              <p className="text-start px-1  text-sm font-semibold text-red-600">
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm Password Input */}
          <div className="">
            <div className="flex gap-2 items-center">
              <p className="font-semibold">Confirm Password</p>
            </div>
            <div className="relative">
              <div
                onClick={() => handleclick("confirmPassword")}
                className="absolute hover:cursor-pointer right-4 top-1/3 "
              >
                {confirmPassword ? (
                  <FaEyeSlash name="confirmPassword" />
                ) : (
                  <FaEye name="confirmPassword" />
                )}
              </div>
              <input
                type={`${confirmPassword ? "text" : "password"}`}
                className={`py-4 px-2 rounded-sm border w-full text-black font-semibold bg-gray-200 outline-none ${
                  errors.confirm_password && touched.confirm_password
                    ? "border-red-600"
                    : ""
                }`}
                placeholder="Confirm Password"
                name="confirm_password"
                maxLength={15}
                onKeyDown={validateInuts}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.confirm_password}
              />
            </div>

            {errors.confirm_password && touched.confirm_password && (
              <p className="text-start px-1  text-sm font-semibold text-red-600">
                {errors.confirm_password}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              disabled={isPending}
              className="font-semibold px-8 py-4 rounded-md bg-purple-900 text-white"
              type="submit"
            >
              {isPending ? <MiniLoader /> : " REGISTER NOW"}
            </button>
          </div>
        </div>
      </form>
      <div className=" text-center pt-4 md:hidden">
        <NavLink to="/login">Already have an Account ? </NavLink>
      </div>
      <ReactTooltip
        id="password"
        place="bottom"
        content="Password Must Contain Following "
      />
    </div>
  );
};

export default RegisterFOrm;
