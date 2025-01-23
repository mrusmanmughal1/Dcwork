import { useNavigate } from "react-router-dom";
import barComp from "../../assets/EmplyersBars/2.png";
import { FaArrowLeft } from "react-icons/fa";
import CountryStateCity from "../../Reuseables/CountryStateCity";
import { useFormik } from "formik";
import { useGetCountries } from "../../Services/General/useGetCountries";
import { useEmployerDetails } from "../../Services/Employer/useEmployerDetails";
import { EmpStep2Validation } from "../../helpers/Schema/FormValidation";
import { useUpdateEmployer } from "../../Services/Employer/useUpdateEmployer";
import { CiBarcode } from "react-icons/ci";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import MiniLoader from "../../UI/MiniLoader";
import { useEffect } from "react";
import { isEqual } from "lodash";
import PhoneNumberInput from "../../Reuseables/PhoneNumber";
import parsePhoneNumberFromString from "libphonenumber-js";

const EmployerDetails = () => {
  const navigate = useNavigate();

  const {
    data: Countries,
    isLoading: countryLoading,
    isError: countryError,
  } = useGetCountries();
  const { data, isLoading: loading, isError } = useEmployerDetails();

  const {
    mutate: updateEmployerData,
    isPending,
    isError: EmpErr,
  } = useUpdateEmployer();
  const { city, country, phone, website, about, state, zip_code } =
    data?.data?.data || {};
  const initialValues = {
    city: city || "",
    country: country || "",
    phone: phone || "",
    website: website || "",
    about: about || "",
    zip_code: zip_code || "",
    state: state || "",
  };

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;

    if (name === "zip_code") {
      // Prevent space at the beginning of the interviewer name input field
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
        e.preventDefault(); // Block the space from being typed at the beginning
      }

      // Prevent other non-letter characters (for interviewer name)
      if (
        !/[A-Za-z0-9\s]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete"
      ) {
        e.preventDefault(); // Block non-alphabetic and non-space keys
      }
      if (
        e.key === " " &&
        input.value.charAt(input.selectionStart - 1) === " "
      ) {
        e.preventDefault(); // Block multiple spaces in a row
      }
    }
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
        updateEmployerData(values, {
          onSuccess: () =>
            navigate("/employer-dashboard/profile/Employer-Company-Details"),
        });
      } else {
        navigate("/employer-dashboard/profile/Employer-Company-Details");
      }
    },
    validationSchema: EmpStep2Validation,
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

  if (countryLoading || loading) return <Loader style="py-40" />;
  if (countryError || isError)
    return (
      <ErrorMsg ErrorMsg="Unable To fetch Data Right Now !  Please try again!" />
    );

  return (
    <div>
      <p className="text-center text-btn-primary pb-4 font-semibold">
        Enter Employer Details
      </p>

      <div className="flex justify-center py-2">
        <img src={barComp} alt="" />
      </div>

      <form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <CountryStateCity
            setFieldValue={setFieldValue}
            values={values}
            country={country}
            city={city}
            touched={touched}
            Countries={Countries}
            state={state}
            errors={errors}
            handleChange={handleChange}
          />

          <div className="">
            <label htmlFor="zip_code" className="block text-black mb-1">
              Zip Code*
            </label>
            <div
              className={`flex items-center   bg-gray-200 px-2 ${
                errors.zip_code && touched.zip_code
                  ? " border border-red-600"
                  : ""
              }`}
            >
              <CiBarcode className="text-lg" />
              <input
                type="text"
                id="zip_code"
                onKeyDown={validateInuts}
                placeholder="Enter zip code"
                name="zip_code"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.zip_code}
                maxLength={16}
                className="py-3 bg-gray-200 px-3 outline-none w-full"
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
        </div>
        <div className="pt-4 text-end flex justify-between">
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
      </form>
    </div>
  );
};

export default EmployerDetails;
