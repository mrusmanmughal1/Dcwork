import React from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/bootstrap.css";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useLocation } from "react-router-dom";

const PhoneNumberInput = ({
  name,
  errors,
  setFieldValue,
  phoneInputRef,
  values,
  handleBlur,
  touched,
}) => {
  const location = useLocation();
  const isRegister = location.pathname === "/register";
  const handlePhone = (phone) => {
    // Check if name is provided, then set interviewer_phone, otherwise set phone
    if (name) {
      setFieldValue("interviewer_phone", phone);
    } else {
      setFieldValue("phone", phone);
    }
  };
  const error = name ? errors.interviewer_phone : errors.phone;
  const touchedField = name ? touched.interviewer_phone : touched.phone;
  return (
    <div className="">
      <div className="flex gap-2 items-center">
        <p className={`${isRegister && "font-semibold"}`}>Phone Number </p>
      </div>
      <div
        className={`  rounded-sm border   w-full text-black ${
          isRegister && "font-semibold"
        }  bg-gray-200 outline-none  ${
          error && touchedField ? "border-red-600" : ""
        }`}
      >
        <PhoneInput
          ref={phoneInputRef}
          country={"us"}
          enableSearch={true}
          inputProps={{
            name: "phone",
            required: true,
          }}
          onChange={handlePhone}
          onBlur={handleBlur}
          value={name ? values.interviewer_phone : values.phone}
        />
      </div>
      {error && touchedField && (
        <p className="text-start px-1 text-sm font-semibold text-red-600">
          {error}
        </p>
      )}
    </div>
  );
};

export default PhoneNumberInput;
