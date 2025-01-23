import { useFormik } from "formik";
import { useCandidateCvParsing } from "../../Services/Candidate/useCandidateCvParsing";
import { useCandidateDetails } from "../../Services/Candidate/useCandidateDetails";
import CandidatesCvManagment from "./CandidatesCvManagment";
import { useNavigate } from "react-router-dom";
import { useCandidateManageProfile } from "../../Services/Candidate/CandidateManageProfile";
import bar1 from "../../assets/CandidateBars/1.png";
import { CandiateStep1Validation } from "../../helpers/Schema/FormValidation";
import MiniLoader from "../../UI/MiniLoader";
import { LuUser2 } from "react-icons/lu";
import { RiUserSharedLine } from "react-icons/ri";
import { IoIosCalendar } from "react-icons/io";
import { CiMail } from "react-icons/ci";
import { useEffect } from "react";
import ErrorMsg from "../../UI/ErrorMsg";
import Loader from "../../UI/Loader";
import { isEqual } from "lodash";
import toast from "react-hot-toast";
const CandidatePersonalDetails = () => {
  const { data, isLoading: loadingDetails, isError } = useCandidateDetails();
  const {
    mutate: cvparse,
    isPending: parseloading,
    isError: parseError,
  } = useCandidateCvParsing();

  const { dob, email, first_name, last_name, gender, cvs } =
    data?.data?.data || {};

  const initialValues = {
    email: email || "",
    first_name: first_name || "",
    last_name: last_name || "",
    gender: gender || "",
    date_of_birth: dob || "",
    cvs: cvs || [],
  };

  const navigate = useNavigate();
  const { mutate: updateProfile, isPending } = useCandidateManageProfile();

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;

    if (name === "first_name" || name === "last_name") {
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
        e.preventDefault(); // Block space from being typed at the beginning
      }

      if (
        !/[A-Za-z\s]/.test(e.key) && // Allow only letters and spaces
        e.key !== "Backspace" && // Allow backspace to delete
        e.key !== "Delete" // Allow delete key to remove text
      ) {
        e.preventDefault(); // Block non-alphabetic and non-space keys
      }

      // Prevent space at the start of the input
      if (
        input.selectionStart === 0 && // Check if the cursor is at the start of the input
        e.key === " " // Prevent space at the beginning of the string
      ) {
        e.preventDefault(); // Block space from being typed at the beginning
      }

      // Prevent multiple spaces in a row
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
      if (
        values.cvs &&
        values.cvs.length > 0 &&
        values.cvs[0].cv_title === "Untitled CV"
      ) {
        toast.error("Update Your Cv Name ", { id: "error" });
      } else {
        if (!isEqual(values, initialValues)) {
          // Only make the API call if there are changes
          updateProfile(values, {
            onSuccess: () =>
              navigate("/dashboard/profile/candiate-address-info"),
          });
        } else {
          // If values are the same, just navigate without calling the API
          navigate("/dashboard/profile/candiate-address-info");
        }
      }
    },
    validationSchema: CandiateStep1Validation,
  });

  useEffect(() => {
    const cvlength = cvs?.length;
    setFieldValue("cvs", cvlength);
  }, [cvs, setFieldValue]);
  useEffect(() => {
    if (data && data.data) {
      const EMPDATA = data.data.data;
      Object.keys(initialValues).forEach((key) => {
        setFieldValue(key, EMPDATA[key] || initialValues[key]);
      });
    }
  }, [data, setFieldValue]);
  if (loadingDetails) return <Loader />;
  if (isError)
    return (
      <ErrorMsg ErrorMsg="Unable To fetch Data Right Now !  Please try again!" />
    );

  return (
    <div>
      <div className="    justify-center pb-2">
        <p className="text-btn-primary text-center pb-4 font-semibold">
          Enter Your Personal Information
        </p>
        <div className="flex justify-center">
          <img src={bar1} alt="" />
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <CandidatesCvManagment
          cvs={cvs}
          errors={errors}
          cvparse={cvparse}
          parseloading={parseloading}
          setFieldValue={setFieldValue}
          touched={touched}
        />

        <div className="flex py-4  flex-col gap-4">
          <div className="w-full">
            <label htmlFor="first_name" className="block text-black mb-1">
              First Name*
            </label>
            <div
              className={` flex items-center bg-gray-200     px-2   ${
                errors.first_name && touched.first_name
                  ? " border border-red-600"
                  : ""
              }`}
            >
              <LuUser2 />
              <input
                type="text"
                placeholder=" Enter your first name"
                name="first_name"
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength={20}
                value={values.first_name}
                onKeyDown={validateInuts}
                className="py-3 bg-gray-200    px-2 outline-none w-full"
              />
            </div>

            {errors.first_name && touched.first_name && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.first_name}
              </p>
            )}
          </div>

          <div className="">
            <label htmlFor="last_name" className="block text-black mb-1">
              Last Name*
            </label>
            <div
              className={` flex items-center bg-gray-200      px-2   ${
                errors.last_name && touched.last_name
                  ? " border border-red-600"
                  : ""
              }`}
            >
              <LuUser2 />

              <input
                type="text"
                placeholder="Enter your last name"
                name="last_name"
                maxLength={20}
                onChange={handleChange}
                onKeyDown={validateInuts}
                onBlur={handleBlur}
                value={values.last_name}
                className="py-3 bg-gray-200   px-2 outline-none w-full"
              />
            </div>
            {errors.last_name && touched.last_name && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.last_name}
              </p>
            )}
          </div>
        </div>
        <div className="">
          <div className="flex   flex-col gap-4 ">
            <div className="">
              <label htmlFor="gender" className="block text-black mb-1">
                Select Gender*
              </label>
              <div
                className={` w-full flex items-center bg-gray-200    px-2   ${
                  errors.gender && touched.gender
                    ? " border border-red-600"
                    : ""
                }`}
              >
                <RiUserSharedLine />
                <select
                  name="gender"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.gender}
                  className="block w-full   outline-none p-3 bg-gray-200"
                >
                  <option disabled value="">
                    Select your gender.
                  </option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>

                  <option value="not_to_disclose">Not to disclose</option>
                </select>
              </div>
              {errors.gender && touched.gender && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.gender}
                </p>
              )}
            </div>
            <div className="">
              <label htmlFor="date_of_birth" className="block text-black mb-1">
                Date of Birth*
              </label>
              <div
                className={` w-full flex items-center bg-gray-200    px-2   ${
                  errors.date_of_birth && touched.date_of_birth
                    ? " border border-red-600"
                    : ""
                }`}
              >
                <IoIosCalendar />
                <input
                  type="date"
                  name="date_of_birth"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.date_of_birth}
                  className="py-3 bg-gray-200   px-2 outline-none  w-full"
                />
              </div>

              {errors.date_of_birth && touched.date_of_birth && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.date_of_birth}
                </p>
              )}
            </div>
            <div className="">
              <label htmlFor="date_of_birth" className="block text-black mb-1">
                E-mail*
              </label>

              <div
                className={` w-full flex items-center bg-gray-200    px-2   ${
                  errors.email && touched.email ? " border border-red-600" : ""
                }`}
              >
                <CiMail />
                <input
                  type="text"
                  placeholder="Enter your email"
                  name="email"
                  disabled
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                  className="py-3 bg-gray-200   px-2 outline-none w-full disabled:cursor-not-allowed"
                />
                {errors.email && touched.email && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="text-end py-4">
          <button
            type="submit"
            className="bg-btn-primary rounded-md text-white px-6 py-2   "
          >
            {isPending ? <MiniLoader /> : " Next"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CandidatePersonalDetails;
