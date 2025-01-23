import { useNavigate } from "react-router-dom";
import barComp from "../../assets/EmplyersBars/3.png";
import { CiEdit } from "react-icons/ci";
import { FaArrowLeft, FaUsers } from "react-icons/fa6";
import { IoBriefcaseOutline } from "react-icons/io5";
import { TbWorld } from "react-icons/tb";
import { TfiWorld } from "react-icons/tfi";
import { BsCardChecklist, BsUpload, BsBuildings } from "react-icons/bs";
import { CgLoadbarDoc } from "react-icons/cg";  
import { useEmployerDetails } from "../../Services/Employer/useEmployerDetails";
import { EmpStep3Validation } from "../../helpers/Schema/FormValidation";
import { useEffect, useState } from "react";
import { useUpdateEmployer } from "../../Services/Employer/useUpdateEmployer";
import { useFormik } from "formik";
import Select from "react-select";
import { BASE_URL_IMG } from "../../config/Config";
import pic from "../../assets/Profile-picture.png";
import { useSpecialization } from "../../Services/General/useSpecialization";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import MiniLoader from "../../UI/MiniLoader";
import LisenceDocuments from "./UI/LisenceDocuments";
import { isEqual } from "lodash";

const EmployerCompanyDetails = () => {
  const [isAvatarUpdated, setIsAvatarUpdated] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading: loading, isError } = useEmployerDetails();
  const { data: specialismsData, isPending: loadSpecializim } =
    useSpecialization();
  const {
    mutate: updateEmployerData,
    isPending,
    isError: EmpErr,
  } = useUpdateEmployer();

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;

    if (
      name === "company_name" ||
      name === "license_number" ||
      name === "about" ||
      name === "website"
    ) {
      // Prevent space at the beginning of the interviewer name input field
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
        e.preventDefault(); // Block the space from being typed at the beginning
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
    company_name,
    website,
    about,
    focused_industries,
    avatar_image,
    company_size,
    license_number,
    license_image,
    state,
    country,
    zip_code,
  } = data?.data?.data || {};

  const initialValues = {
    company_name: company_name || "",
    website: website || "",
    about: about || "",
    focused_industries: focused_industries || "",
    company_size: company_size || "",
    license_number: license_number || "",
    avatar_image: avatar_image || "",
    license_image: license_image,
    zip_code: zip_code || "",
    state: state || "",
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
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key !== "avatar_image" && key !== "license_image") {
          formData.append(key, values[key]);
        }
      });
      if (isAvatarUpdated) {
        formData.append("avatar_image", values.avatar_image);
      }

      if (!isEqual(values, initialValues)) {
        updateEmployerData(formData, {
          onSuccess: () =>
            navigate("/employer-dashboard/profile/Employer-Profile-complete"),
        });
      } else {
        navigate("/employer-dashboard/profile/Employer-Profile-complete");
      }
    },
    validationSchema: EmpStep3Validation,
  });

  const handleSpecialChange = (selected) => {
    // Map the selected options to an array of values (strings)
    const selectedValues = selected
      ? selected.map((option) => option.value)
      : [];
    setFieldValue("focused_industries", selectedValues);
  };

  useEffect(() => {
    if (data && data.data) {
      const EMPDATA = data.data.data;
      Object.keys(initialValues).forEach((key) => {
        setFieldValue(key, EMPDATA[key] || initialValues[key]);
      });
    }
  }, [data, setFieldValue]);

  if (loading || loadSpecializim) return <Loader style="py-40" />;
  if (isError || EmpErr)
    return (
      <ErrorMsg ErrorMsg="Unable To fetch Data Right Now !  Please try again!" />
    );
  return (
    <div>
      <p className="text-center text-btn-primary pb-4 font-semibold">
        Enter Your Company Details
      </p>
      <div className="flex justify-center py-2">
        <img src={barComp} alt="" />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="pt-8 space-y-4">
          <div className="flex items-center flex-col gap-4">
            <div className="relative  ">
              <div className="w-24 h-24 relative overflow-hidden bg-gray-300 rounded-full">
                {(values.avatar_image || avatar_image) && (
                  <img
                    src={
                      values.avatar_image && values.avatar_image instanceof File
                        ? URL.createObjectURL(values.avatar_image)
                        : avatar_image
                        ? BASE_URL_IMG + avatar_image
                        : pic
                    }
                    alt="Company logo "
                    className="object-contain h-full w-full"
                  />
                )}
              </div>

              <div className="absolute bottom-2 right-2">
                <CiEdit className="bg-slate-200 rounded-full right-0 bottom-0 absolute text-2xl text-btn-primary" />
                <input
                  type="file"
                  name="avatar_image"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("avatar_image", event.currentTarget.files[0]);
                    setIsAvatarUpdated(true);
                  }}
                  onBlur={handleBlur}
                  className="cursor-pointer border h-full bg-gray-200 px-2 outline-none opacity-0 w-full"
                />
              </div>
            </div>
            <div className="">
              {errors.avatar_image && touched.avatar_image && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.avatar_image}
                </p>
              )}
            </div>
            <p className="text-slate-600">Upload Company Profile Image</p>
          </div>

          <div className="">
            <label htmlFor="company_name" className="block text-black mb-1">
              Company Name*
            </label>
            <div
              className={`flex items-center   bg-gray-200 px-2 ${
                errors.company_name && touched.company_name
                  ? " border border-red-600"
                  : ""
              }`}
            >
              <IoBriefcaseOutline />
              <input
                type="text"
                placeholder="Enter Company Name"
                name="company_name"
                onChange={handleChange}
                onBlur={handleBlur}
                onKeyDown={validateInuts}
                maxLength={50}
                value={values.company_name}
                className="py-3 bg-gray-200 px-2 outline-none w-full"
              />
            </div>
            {errors.company_name && touched.company_name && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.company_name}
              </p>
            )}
          </div>
          <div className="">
            <label htmlFor="company_size" className="block text-black mb-1">
              Company Size*
            </label>
            <div
              className={`flex items-center   bg-gray-200 px-2 ${
                errors.company_size && touched.company_size
                  ? " border border-red-600"
                  : ""
              }`}
            >
              <BsBuildings />

              <select
                name="company_size"
                id="company_size"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.company_size}
                className="block w-full p-3 outline-none bg-gray-200"
              >
                <option value="" disabled>
                  Select Company Size
                </option>
                <option value="1-10">1-10</option>
                <option value="11-50">11-50</option>
                <option value="51-200">51-200</option>
                <option value="201-500">201-500</option>
                <option value="501-1000">501-1000</option>
                <option value="1001-5000">1001-5000</option>
                <option value="5001-10000">5001-10000</option>
              </select>
            </div>
            {errors.company_size && touched.company_size && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.company_size}
              </p>
            )}
          </div>

          <div className="">
            <label htmlFor="license_number" className="block text-black mb-1">
              License Number* ({country == "United States" ? "EIN" : "TN"})
            </label>
            <div
              className={`flex items-center   bg-gray-200 px-2 ${
                errors.license_number && touched.license_number
                  ? " border border-red-600"
                  : ""
              }`}
            >
              <CgLoadbarDoc />
              <input
                type="text"
                placeholder="License Number"
                name="license_number"
                id="license_number"
                onChange={handleChange}
                onKeyDown={validateInuts}
                maxLength={16}
                onBlur={handleBlur}
                value={values.license_number}
                className="py-3 bg-gray-200 px-2 outline-none w-full"
              />
            </div>
            {errors.license_number && touched.license_number && (
              <p className="text-start px-1 mt-1 text-sm font-semibold text-red-600">
                {errors.license_number}
              </p>
            )}
          </div>
          <LisenceDocuments
            values={values}
            errors={errors}
            license_image={license_image}
            setFieldValue={setFieldValue}
            touched={touched}
          />

          <div className="">
            <label htmlFor="website" className="block text-black mb-1">
              Website*
            </label>
            <div
              className={`flex items-center   bg-gray-200 px-2 ${
                errors.website && touched.website
                  ? " border border-red-600"
                  : ""
              }`}
            >
              <TfiWorld />
              <input
                type="text"
                id="website"
                placeholder="Enter Website"
                name="website"
                maxLength={50}
                onKeyDown={validateInuts}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.website}
                className="py-3 bg-gray-200 px-2 outline-none w-full"
              />
            </div>
            {errors.website && touched.website && (
              <p className="text-start px-1 mt-1 text-sm font-semibold text-red-600">
                {errors.website}
              </p>
            )}
          </div>

          <div className="">
            <label htmlFor="job_interest" className="block text-black mb-1">
              Focused Industries*
            </label>
            <div
              className={`flex items-center   bg-gray-200 px-2 ${
                errors.focused_industries && touched.focused_industries
                  ? " border border-red-600"
                  : ""
              }`}
            >
              <BsBuildings />
              <Select
                isMulti
                autoComplete="Interest"
                name="job_interest"
                id="job_interest"
                className="w-full"
                onChange={handleSpecialChange}
                defaultValue={focused_industries?.map((option) => ({
                  value: option,
                  label: option,
                }))}
                options={specialismsData?.data?.specializations?.map(
                  (option) => ({
                    value: option,
                    label: option,
                  })
                )}
              />
            </div>
            {errors.focused_industries && touched.focused_industries && (
              <p className="text-start mt-1 px-1 text-sm font-semibold text-red-600">
                {errors.focused_industries}
              </p>
            )}
          </div>

          <div className="">
            <label htmlFor="about" className="block text-black mb-1">
              About*
            </label>
            <div
              className={`flex    bg-gray-200 px-2 ${
                errors.about && touched.about ? " border border-red-600" : ""
              }`}
            >
              <BsCardChecklist className="mt-4" />
              <textarea
                rows="4"
                cols="50"
                type="text"
                placeholder="Enter About"
                name="about"
                id="about"
                maxLength={1000}
                onKeyDown={validateInuts}
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.about}
                className="py-3 bg-gray-200 px-2 outline-none w-full"
              />
            </div>
            {errors.about && touched.about && (
              <p className="text-start px-1 mt-1 text-sm font-semibold text-red-600">
                {errors.about}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 text-end flex justify-between">
          <button type="button" onClick={() => navigate(-1)}>
            <FaArrowLeft className=" text-gray-400" />
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

export default EmployerCompanyDetails;
