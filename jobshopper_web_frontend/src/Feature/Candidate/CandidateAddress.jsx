import { useGetCountries } from "../../Services/General/useGetCountries";
import { useCandidateDetails } from "../../Services/Candidate/useCandidateDetails";
import { useCandidateManageProfile } from "../../Services/Candidate/CandidateManageProfile";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import barComp from "../../assets/CandidateBars/2.png";
import CountryStateCity from "../../Reuseables/CountryStateCity";
import { CandiateStep2Validation } from "../../helpers/Schema/FormValidation";
import { FaArrowLeft } from "react-icons/fa";
import MiniLoader from "../../UI/MiniLoader";
import Loader from "../../UI/Loader";
import { LuMapPin } from "react-icons/lu";
import { IoBarcodeOutline } from "react-icons/io5";

import ErrorMsg from "../../UI/ErrorMsg";
import { isEqual } from "lodash";

import { useEffect } from "react";
import PhoneNumberInput from "../../Reuseables/PhoneNumber";
import parsePhoneNumberFromString from "libphonenumber-js";
const CandidateAddress = () => {
  const navigate = useNavigate();

  const {
    data: Countries,
    isLoading: countryLoading,
    isError: countryError,
  } = useGetCountries();

  const { data, isLoading: loadingDetails, isError } = useCandidateDetails();
  const {
    mutate: updateProfile,
    isPending,
    isError: errorProfile,
  } = useCandidateManageProfile();

  const {
    candidate_city,
    candidate_country,
    candidate_state,
    phone,
    candidate_address_1,
    candidate_address_2,
    candidate_zip_code,
  } = data?.data?.data || {};

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;

    if (name === "address_1" || name === "address_2") {
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
        e.preventDefault(); // Block space from being typed at the beginning
      }

      // Allow backspace and delete
      if (e.key === "Backspace" || e.key === "Delete") {
        return; // Allow these keys
      }

      if (
        input.selectionStart === 0 && // Check if the cursor is at the start of the input
        e.key === " " // Prevent space at the beginning of the string
      ) {
        e.preventDefault(); // Block space from being typed at the beginning
      }

      if (
        e.key === " " &&
        input.value.charAt(input.selectionStart - 1) === " "
      ) {
        e.preventDefault(); // Block multiple spaces in a row
      }
    }

    // Check if the field is 'phone'
    if (name === "zip_code") {
      // Allow only numeric input for phone number
      if (
        !/[A-Za-z0-9]/.test(e.key) && // Allow only numbers
        e.key !== "Backspace" && // Allow backspace to delete
        e.key !== "Delete" // Allow delete key to remove text
      ) {
        e.preventDefault(); // Block non-numeric keys
      }
    }
  };

  const initialValues = {
    address_1: candidate_address_1 || "",
    address_2: candidate_address_2 || "",
    country: candidate_country || "",
    state: candidate_state || "",
    city: candidate_city || "",
    zip_code: candidate_zip_code || "",
    phone: phone || "",
  };
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
    onSubmit: (values) => {
      if (!isEqual(values, initialValues)) {
        // Only make the API call if there are changes
        updateProfile(values, {
          onSuccess: () =>
            navigate("/dashboard/profile/candiate-profession-info"),
        });
      } else {
        // If values are the same, just navigate without calling the API
        navigate("/dashboard/profile/candiate-profession-info");
      }
    },
    validationSchema: CandiateStep2Validation,
    validate: (values) => {
      const errors = {};
      let phone = values.phone;
      if (phone && phone.startsWith("+")) {
        phone = phone.slice(1); // Remove the leading "+" from the phone number
      }
      // Validate phone number based on selected country
      const phoneNumberObj = parsePhoneNumberFromString(`${"+" + phone}`);

      if (values.phone && (!phoneNumberObj || !phoneNumberObj.isValid())) {
        errors.phone = "Invalid phone number for the selected country";
      }

      return errors;
    },
  });
  useEffect(() => {
    if (data && data.data) {
      const EMPDATA = data.data.data;
      Object.keys(initialValues).forEach((key) => {
        setFieldValue(key, EMPDATA[key] || initialValues[key]);
      });
    }
  }, [data, setFieldValue]);
  if (loadingDetails || countryLoading) return <Loader />;
  if (isError || countryError || errorProfile)
    return (
      <ErrorMsg ErrorMsg="Unable To fetch Data Right Now !  Please try again!" />
    );
  return (
    <div>
      <p className="text-center text-btn-primary  pb-4 font-semibold">
        Enter Your Address Details
      </p>
      <div className=" flex justify-center py-2">
        <img src={barComp} alt="" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <div className="">
            <label htmlFor="address_1" className="block text-black mb-1">
              Address 1*
            </label>

            <div
              className={`flex items-center bg-gray-200    px-2 ${
                errors.address_1 && touched.address_1
                  ? " border border-red-600"
                  : ""
              }`}
            >
              <LuMapPin />
              <input
                type="text"
                placeholder="Enter your Address 1"
                name="address_1"
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={validateInuts}
                maxLength={60}
                value={values.address_1}
                className="py-3 bg-gray-200    px-2 outline-none w-full"
              />
            </div>
            {errors.address_1 && touched.address_1 && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.address_1}
              </p>
            )}
          </div>
          <div className="">
            <label htmlFor="address_2" className="block text-black mb-1">
              Address 2
            </label>
            <div className="flex items-center  bg-gray-200    px-2">
              <LuMapPin />

              <input
                type="text"
                placeholder="Enter your Address 2"
                name="address_2"
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={60}
                onKeyDown={validateInuts}
                value={values.address_2}
                className="py-3 bg-gray-200    px-2 outline-none w-full"
              />
            </div>
            {errors.address_2 && touched.address_2 && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.address_2}
              </p>
            )}
          </div>
          <div className="space-y-4">
            <CountryStateCity
              setFieldValue={setFieldValue}
              values={values}
              country={candidate_country}
              city={candidate_city}
              touched={touched}
              Countries={Countries}
              state={candidate_state}
              errors={errors}
              handleChange={handleChange}
            />
          </div>
          <div className="">
            <label htmlFor="zip_code" className="block text-black mb-1">
              Zip Code*
            </label>

            <div
              className={`flex items-center bg-gray-200    px-2 ${
                errors.zip_code && touched.zip_code
                  ? " border border-red-600"
                  : ""
              }`}
            >
              <IoBarcodeOutline />
              <input
                type="text"
                placeholder="Enter your zip code"
                name="zip_code"
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={validateInuts}
                value={values.zip_code}
                maxLength={16}
                className="py-3 bg-gray-200    px-2 outline-none w-full"
              />
            </div>
            {errors.zip_code && touched.zip_code && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.zip_code}
              </p>
            )}
          </div>
          <PhoneNumberInput
            setFieldValue={setFieldValue}
            touched={touched}
            errors={errors}
            handleBlur={handleBlur}
            values={values}
          />

          <div className=" pt-4 text-end flex justify-between">
            <button type="button" onClick={() => navigate(-1)}>
              <FaArrowLeft className="text-gray-400" />
            </button>
            <button
              type="submit"
              className="bg-btn-primary text-white px-6 p-2 rounded-md"
            >
              {isPending ? <MiniLoader /> : "Next"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CandidateAddress;
