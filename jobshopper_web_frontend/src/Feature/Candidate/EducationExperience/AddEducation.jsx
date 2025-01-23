import { useEffect, useState } from "react";
import { useEducationLevels } from "../../../Services/General/useEducationLevels";
import { RxCross2 } from "react-icons/rx";
import { FaChevronDown } from "react-icons/fa";
import { useCandidateManageProfile } from "../../../Services/Candidate/CandidateManageProfile";

import { useFormik } from "formik";
import MiniLoader from "../../../UI/MiniLoader";
import ErrorMsg from "../../../UI/ErrorMsg";
import { CandidateEducation } from "../../../helpers/Schema/FormValidation";
import toast from "react-hot-toast";
const AddEducation = ({ currentdata, handleCloseDataModel }) => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    data: Education,
    isLoading,
    isError: eduError,
  } = useEducationLevels();

  const EducationsLIst = Education?.map((val) => val.education_levels);
  const flatlist = EducationsLIst?.flat()?.map((val) => val?.name) || [];

  const {
    mutate: updateProfile,
    isPending,
    isError: errorProfile,
  } = useCandidateManageProfile();

  const initialValues = {
    id: "",
    education_level: "",
    institute_name: "",
    location: "",
  };
  const {
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
    handleChange,
    resetForm,
  } = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formData = new FormData();

      // Prepare the education object
      const education = {
        education_level: values.education_level,
        institute_name: values.institute_name,
        location: values.location,
      };
      if (values.id) {
        education.id = values.id;
      }
      formData.append("candidate_educations", JSON.stringify([education]));

      try {
        // Attempt to update the profile
        updateProfile(formData);
        resetForm();
        handleCloseDataModel(false); // Close the model on success
      } catch (error) {
        // Handle the error
        toast.error("Unable to add education, Try Later");
      }
    },
    validationSchema: CandidateEducation,
  });

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;
    if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
      e.preventDefault(); // Block the space from being typed at the beginning
    }
    if (name === "institute_name") {
      if (
        !/[A-Za-z0-9\s]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete"
      ) {
        e.preventDefault(); // Block non-alphabetic and non-space keys
      }
    }

    if (name === "location") {
      const locationRegex = /^[A-Za-z0-9\s\-\/\#\+\_\(\)]+$/;
      if (
        !locationRegex.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete"
      ) {
        e.preventDefault(); // Prevent the input if the key is invalid
      }
    }
    if (e.key === " " && input.value.charAt(input.selectionStart - 1) === " ") {
      e.preventDefault(); // Block multiple spaces in a row
    }
  };

  useEffect(() => {
    if (currentdata) {
      setFieldValue("id", currentdata.id);
      setFieldValue("education_level", currentdata.education_level);

      setFieldValue("institute_name", currentdata.institute_name);

      setFieldValue("location", currentdata.location);
    }
  }, [currentdata]);
  const handleOptionClick = (option) => {
    setFieldValue("education_level", option);
    setIsOpen(false);
  };
  const handlecancel = () => {
    resetForm();
    handleCloseDataModel(false);
  };
  if (isLoading)
    return (
      <div className="p-20">
        <MiniLoader />
      </div>
    );

  if (eduError || errorProfile)
    return (
      <ErrorMsg ErrorMsg={"Sorry ! Unable to To Get Data Try Again Later "} />
    );
  return (
    <div className="p-10 relative">
      <div className=" text-2xl font-semibold text-btn-primary">
        {currentdata ? "Update" : "Add"} Education
      </div>
      <div className="">
        <RxCross2
          className="absolute right-8 top-8 cursor-pointer"
          onClick={() => handleCloseDataModel()}
        />
      </div>
      <div className="py-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-2  ">
            <div className="flex flex-col ">
              <label htmlFor="education_level">Education Level</label>
              <div
              className={` border text-sm p-2 w-full flex justify-between items-center bg-gray-200 cursor-pointer ${errors.education_level && touched.institute_name  ? "border-red-500" :""}  `}
                
                onClick={() => setIsOpen(!isOpen)}
              >
                {values.education_level || "Select Level of Study"}
                <FaChevronDown />
              </div>
              {errors.education_level && touched.institute_name && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.education_level}
                </p>
              )}
              <div className="">
                {isOpen && (
                  <div className="absolute z-10 bg-white border  border-gray-300 max-h-[200px] overflow-y-auto  ">
                    {flatlist.map((level, idx) => (
                      <div
                        key={idx}
                        className="p-2 hover:bg-gray-200 cursor-pointer"
                        onClick={() => handleOptionClick(level)}
                      >
                        {level}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col">
              <label htmlFor="institute_name">Institute Name</label>
              <input
                type="text"
                id="institute_name"
                name="institute_name"
                placeholder="Enter Institute Name"
                maxLength={60}
                className={` p-2 border bg-gray-200 ${errors.institute_name && touched.institute_name  ? "border-red-500" :""}`}
                onChange={handleChange}
                onKeyDown={validateInuts}
                value={values.institute_name}
              />
              {errors.institute_name && touched.institute_name && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.institute_name}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="location">Location</label>
              <input
                type="text"
                id="location"
                maxLength={100}
                placeholder="Enter Location"
                name="location"
                value={values.location}
                onKeyDown={validateInuts}
                className={` p-2 border bg-gray-200 ${errors.location && touched.location ? "border-red-500" :""}`}
                onChange={handleChange}
              />
              {errors.location && touched.location && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.location}
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-4 m-2 items-end justify-end">
            <button
              type="submit"
              className="bg-btn-primary text-white p-2 rounded-md px-4 py-2"
            >
              {isPending ? <MiniLoader /> : "Save"}
            </button>
            <button
              type="button"
              onClick={handlecancel}
              className="bg-gray-400 text-white p-2 rounded-md px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEducation;
