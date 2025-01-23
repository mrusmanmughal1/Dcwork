import { useNavigate } from "react-router-dom";
import bar1 from "../../assets/EmplyersBars/1.png";
import { AiOutlineUser } from "react-icons/ai";
import { CiMail } from "react-icons/ci";
import { FiMapPin } from "react-icons/fi";
import { useEmployerDetails } from "../../Services/Employer/useEmployerDetails";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { useFormik } from "formik";
import { useUpdateEmployer } from "../../Services/Employer/useUpdateEmployer";
import MiniLoader from "../../UI/MiniLoader";
import { EmpStep1Validation } from "../../helpers/Schema/FormValidation";
import { isEqual } from "lodash";
import { useEffect } from "react";

const EmployerPersonalDetails = () => {
  const navigate = useNavigate();

  const { data, isLoading: loading, isError } = useEmployerDetails();
  const { email, last_name, first_name, address_1, address_2 } =
    data?.data?.data || {};
  const {
    mutate: updateEmployerData,
    isPending,
    isError: EmpErr,
  } = useUpdateEmployer();
  const initialValues = {
    email: email || "",
    first_name: first_name || "",
    last_name: last_name || "",
    address_1: address_1 || "",
    address_2: address_2 || "",
  };
  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;

    if (name === "first_name" || name === "last_name") {
      // Prevent space at the beginning of the interviewer name input field
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
        e.preventDefault(); // Block the space from being typed at the beginning
      }

      // Prevent other non-letter characters (for interviewer name)
      if (
        !/[A-Za-z\s]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete"
      ) {
        e.preventDefault(); // Block non-alphabetic and non-space keys
      }
    }
    if (name === "email") {
      if (e.key === " " || e.keyCode === 32) {
        e.preventDefault(); // Block space in username field
      }
    }
    if (name === "address_1" || name === "address_2") {
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
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
    setFieldValue,
  } = useFormik({
    initialValues,
    onSubmit: (values) => {
      if (!isEqual(values, initialValues)) {
        updateEmployerData(values, {
          onSuccess: () =>
            navigate("/employer-dashboard/profile/employer-Details"),
        });
      } else {
        navigate("/employer-dashboard/profile/employer-Details");
      }
    },
    validationSchema: EmpStep1Validation,
  });
  useEffect(() => {
    if (data && data.data) {
      const EMPDATA = data.data.data;
      Object.keys(initialValues).forEach((key) => {
        setFieldValue(key, EMPDATA[key] || initialValues[key]);
      });
    }
  }, [data, setFieldValue]);

  if (loading) return <Loader style="py-40" />;

  if (isError)
    return (
      <ErrorMsg ErrorMsg="Unable To fetch Data Right Now !  Please try again!" />
    );

  return (
    <div>
      <div className=" ">
        <div className="    space-y-4">
          <div className="    justify-center pb-2">
            <p className="text-btn-primary text-center pb-4 font-semibold">
              Enter Your Personal Information
            </p>
            <div className="flex justify-center">
              <img src={bar1} alt="" />
            </div>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="">
                <label htmlFor="first_name" className="block  ">
                  First Name*
                </label>
                <div
                  className={`flex items-center   bg-gray-200 px-2 ${
                    errors.first_name && touched.first_name
                      ? " border border-red-600"
                      : ""
                  }`}
                >
                  <AiOutlineUser />
                  <input
                    type="text"
                    id="first_name"
                    placeholder="Enter First Name"
                    name="first_name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.first_name}
                    maxLength={50}
                    onKeyDown={validateInuts}
                    className={`py-3 bg-gray-200 px-2 text-black outline-none w-full `}
                  />
                </div>
                {errors.first_name && touched.first_name && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.first_name}
                  </p>
                )}
              </div>
              <div className="">
                <label htmlFor="last_name" className="block  ">
                  Last Name*
                </label>
                <div
                  className={`flex items-center   bg-gray-200 px-2 ${
                    errors.last_name && touched.last_name
                      ? " border border-red-600"
                      : ""
                  }`}
                >
                  <AiOutlineUser />
                  <input
                    type="text"
                    id="last_name"
                    placeholder=" Enter Last Name"
                    name="last_name"
                    maxLength={50}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={validateInuts}
                    value={values.last_name}
                    className={`py-3 bg-gray-200 text-black px-2 outline-none w-full ${
                      errors.last_name && touched.last_name
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                </div>
                {errors.last_name && touched.last_name && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.last_name}
                  </p>
                )}
              </div>
              <div className="">
                <label htmlFor="email" className="block  ">
                  Email*
                </label>
                <div
                  className={`flex items-center   bg-gray-200 px-2 ${
                    errors.email && touched.email
                      ? " border border-red-600"
                      : ""
                  }`}
                >
                  <CiMail />
                  <input
                    type="text"
                    placeholder="Enter Email"
                    name=" email"
                    id="email"
                    disabled
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                    className={`py-3 bg-gray-200 text-black px-2 outline-none w-full disabled:cursor-not-allowed ${
                      errors.email && touched.email ? "border-red-600" : ""
                    }`}
                  />
                </div>
                {errors.email && touched.email && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="">
                <label htmlFor="address_1" className="block  ">
                  Address 1*
                </label>
                <div
                  className={`flex items-center   bg-gray-200 px-2 ${
                    errors.address_1 && touched.address_1
                      ? " border border-red-600"
                      : ""
                  }`}
                >
                  <FiMapPin />
                  <input
                    type="text"
                    id="address_1"
                    placeholder=" Enter Address 1"
                    name="address_1"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    maxLength={200}
                    onKeyDown={validateInuts}
                    value={values.address_1}
                    className={`py-3 bg-gray-200 px-2 text-black outline-none w-full ${
                      errors.address_1 && touched.address_1
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                </div>
                {errors.address_1 && touched.address_1 && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.address_1}
                  </p>
                )}
              </div>
              <div className="">
                <label htmlFor="address_2" className="block  ">
                  Address 2
                </label>
                <div
                  className={`flex items-center   bg-gray-200 px-2 ${
                    errors.address_2 && touched.address_2
                      ? " border border-red-600"
                      : ""
                  }`}
                >
                  <FiMapPin />
                  <input
                    type="text"
                    id="address_2"
                    placeholder=" Enter Address 2"
                    name="address_2"
                    maxLength={200}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onKeyDown={validateInuts}
                    value={values.address_2}
                    className={`py-3 bg-gray-200 px-2 outline-none w-full ${
                      errors.address_2 && touched.address_2
                        ? "border-red-600"
                        : ""
                    }`}
                  />
                </div>
                {errors.address_2 && touched.address_2 && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.address_2}
                  </p>
                )}
              </div>
            </div>
            <div className="pt-4 text-end">
              <button
                type="submit"
                className="bg-btn-primary text-white px-6 p-2 rounded-md"
              >
                {isPending ? <MiniLoader /> : "Next"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployerPersonalDetails;
