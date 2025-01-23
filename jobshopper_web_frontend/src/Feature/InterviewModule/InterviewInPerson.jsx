import { useFormik } from "formik";
import { useScheduleInterview } from "../../Services/Interview/useScheduleInterview";
import { useState } from "react";
import moment from "moment";
import MiniLoader from "../../UI/MiniLoader";
import { IntervireOnsite } from "../../helpers/Schema/FormValidation";
import PhoneNumberInput from "../../Reuseables/PhoneNumber";
import parsePhoneNumberFromString from "libphonenumber-js";

const InterviewPerson = ({
  type = "",
  applicantID,
  setinterviewModel,
  settype,
}) => {
  const initialValues = {
    job_application: applicantID,
    interview_type: type,
    interviewer_name: "",
    interviewer_phone: "",
    location: "",
    date_time_start: "",
    date_time_end: "",
    interview_date: "",
  };
  const { mutate: interview, isPending, isError } = useScheduleInterview();

  const handleTimeChange = (time, field) => {
    const formattedTime = moment(time, "HH:mm").format("HH:mm");
    handleChange({ target: { name: field, value: formattedTime } });
  };
  const {
    values,
    errors,
    touched,
    setFieldValue,
    handleChange,
    handleSubmit,
    handleBlur,
  } = useFormik({
    initialValues,
    onSubmit: (values, actions) => {
      const data = {
        ...values,
        interviewer_phone: `+${values.interviewer_phone}`,

        date_time_end: `${values.interview_date}:${values.date_time_start}`,
        date_time_start: `${values.interview_date}:${values.date_time_end}`,
      };
      interview(data, {
        onSuccess: () => {
          setinterviewModel(false);
          settype(" ");
        },
      });
    },
    validationSchema: IntervireOnsite,
    validate: (values) => {
      const errors = {};

      // Validate phone number based on selected country
      const phoneNumberObj = parsePhoneNumberFromString(
        `${"+" + values.interviewer_phone}`
      );

      if (
        values.interviewer_phone &&
        (!phoneNumberObj || !phoneNumberObj.isValid())
      ) {
        errors.interviewer_phone =
          "Invalid phone number for the selected country";
      }

      return errors;
    },
  });

  const handleInput = (event) => {
    const input = event.target;

    // Check for the 'phone' field (validating phone numbers)
    if (input.name === "interviewer_phone") {
      if (
        input.selectionStart === 0 &&
        (event.key === " " || event.keyCode === 32)
      ) {
        event.preventDefault(); // Block the space from being typed at the beginning
      }
      // If the pressed key is not a digit (key codes for 0-9 are 48-57)
      if (
        !/[0-9]/.test(event.key) &&
        event.key !== "Backspace" &&
        event.key !== "Delete"
      ) {
        event.preventDefault(); // Block non-digit keys
      }
      return; // No need to check further for the phone field
    }

    // Prevent spacebar at the beginning of the input (only for non-phone fields)
    if (input.name === "interviewer_name") {
      // Prevent space at the beginning of the interviewer name input field
      if (
        input.selectionStart === 0 &&
        (event.key === " " || event.keyCode === 32)
      ) {
        event.preventDefault(); // Block the space from being typed at the beginning
      }

      // Prevent other non-letter characters (for interviewer name)
      if (
        !/[A-Za-z\s]/.test(event.key) &&
        event.key !== "Backspace" &&
        event.key !== "Delete"
      ) {
        event.preventDefault(); // Block non-alphabetic and non-space keys
      }
    }
    if (input.name === "location") {
      // Prevent space at the beginning of the interviewer name input field
      if (
        input.selectionStart === 0 &&
        (event.key === " " || event.keyCode === 32)
      ) {
        event.preventDefault(); // Block the space from being typed at the beginning
      }
    }
  };
  return (
    <form onSubmit={handleSubmit} className="py-8 space-y-4">
      <div className="">
        <label htmlFor="interviewer_name" className="font-semibold ">
          Interviewer Name
        </label>
        <input
          type="text"
          placeholder="Enter Interviewer Name"
          name="interviewer_name"
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleInput}
          value={values.interviewer_name}
          className={` py-3 bg-gray-100 px-6 outline-none w-full  ${
            errors.interviewer_name && touched.interviewer_name
              ? "border-red-500 border"
              : ""
          }`}
        />
        {errors.interviewer_name && touched.interviewer_name && (
          <p className="text-start px-1 text-sm font-semibold text-red-600">
            {errors.interviewer_name}
          </p>
        )}
      </div>
      <div className="">
        <PhoneNumberInput
          setFieldValue={setFieldValue}
          touched={touched}
          errors={errors}
          handleBlur={handleBlur}
          values={values}
          name="interviewer_phone"
        />
      </div>
      <div className="">
        <label htmlFor="location" className="font-semibold ">
          Address
        </label>
        <input
          type="text"
          placeholder="Enter Address  "
          name="location"
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleInput}
          value={values.location}
          className={`  py-3 bg-gray-100 px-6 outline-none w-full ${
            errors.location && touched.location ? "border-red-600 border" : ""
          }`}
        />
        {errors.location && touched.location && (
          <p className="text-start px-1 text-sm font-semibold text-red-600">
            {errors.location}
          </p>
        )}
      </div>

      <div className="space-y-4">
        <div className="w-full">
          <p className="font-semibold">Select Interview Date</p>
          <input
            type="date"
            name="interview_date"
            className={` border w-full bg-slate-100 p-2  ${
              errors.interview_date && touched.interview_date
                ? "border-red-500 border"
                : ""
            }`}
            onChange={handleChange}
          />
          {errors.interview_date && touched.interview_date && (
            <p className="text-start px-1 text-sm font-semibold text-red-600">
              {errors.interview_date}
            </p>
          )}
        </div>
        <div className="flex w-full  gap-10 pb-8">
          <div className="w-full">
            <p className="font-semibold ">Interview Start Time </p>
            <input
              type="time"
              name="date_time_start"
              onChange={(e) =>
                handleTimeChange(e.target.value, "date_time_start")
              }
              onBlur={handleBlur}
              value={values.date_time_start}
              className={` w-full border bg-slate-100 p-2  ${
                errors.date_time_start && touched.date_time_start
                  ? "border border-red-500"
                  : ""
              }`}
            />
            {errors.date_time_start && touched.date_time_start && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.date_time_start}
              </p>
            )}
          </div>
          <div className="w-full">
            <p className="font-semibold ">Interview End Time </p>
            <input
              type="time"
              name="date_time_end"
              onChange={(e) =>
                handleTimeChange(e.target.value, "date_time_end")
              }
              onBlur={handleBlur}
              value={values.date_time_end}
              className={` w-full border bg-slate-100 p-2  ${
                errors.date_time_end && touched.date_time_end
                  ? "border border-red-500"
                  : ""
              }`}
            />
            {errors.date_time_end && touched.date_time_end && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.date_time_end}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="text-center">
        <button
          type="submit"
          className="text-white bg-btn-primary px-12 uppercase py-4 rounded-md "
        >
          {isPending ? <MiniLoader /> : "Confirm"}
        </button>
      </div>
    </form>
  );
};

export default InterviewPerson;
