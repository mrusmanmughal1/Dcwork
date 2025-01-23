import { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useCandidateManageProfile } from "../../../Services/Candidate/CandidateManageProfile";
import { useFormik } from "formik";
import MiniLoader from "../../../UI/MiniLoader";
import ErrorMsg from "../../../UI/ErrorMsg";
import { ExpeirencCandidate } from "../../../helpers/Schema/FormValidation";

const AddWorkExperience = ({ currentdata, handleCloseDataModel }) => {
  const {
    mutate: updateProfile,
    isPending,
    isError: errorProfile,
  } = useCandidateManageProfile();

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;
    if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
      e.preventDefault(); // Block the space from being typed at the beginning
    }
    if (
      name === "job_title" ||
      name === "company_name" ||
      name === "job_description"
    ) {
      if (
        !/[A-Za-z0-9\s]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete"
      ) {
        e.preventDefault(); // Block non-alphabetic and non-space keys
      }
    }

    if (e.key === " " && input.value.charAt(input.selectionStart - 1) === " ") {
      e.preventDefault(); // Block multiple spaces in a row
    }
  };

  const initialValues = {
    id: "",
    job_title: "",
    job_description: "",
    company_name: "",
    date_from: "",
    date_to: "",
    is_current: false,
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
        job_title: values.job_title,
        job_description: values.job_description,
        company_name: values.company_name,

        date_from: values.date_from
          ? new Date(values.date_from).toISOString().split("T")[0]
          : null,
        date_to: values.isCurrent
          ? null
          : values.date_to
          ? new Date(values.date_to).toISOString().split("T")[0]
          : null,
        is_current: values.is_current,
      };
      if (values.id) {
        education.id = values.id;
      }
      formData.append(
        "candidate_work_experiences",
        JSON.stringify([education])
      );

      try {
        // Attempt to update the profile
        updateProfile(formData);
        resetForm();
        handleCloseDataModel(false); // Close the model on success
      } catch (error) {
        // Handle the error
        // toast.error("Unable to add education, Try Later");
      }
    },
    validationSchema: ExpeirencCandidate,
  });

  useEffect(() => {
    if (currentdata) {
      setFieldValue("id", currentdata.id);
      setFieldValue("job_title", currentdata.job_title);

      setFieldValue("company_name", currentdata.company_name);

      setFieldValue("job_description", currentdata.job_description);
      setFieldValue("date_from", currentdata.date_from);
      setFieldValue("date_to", currentdata.date_to ? currentdata.date_to : " ");
      setFieldValue("is_current", currentdata.is_current);
    }
  }, [currentdata]);
  const handlecancel = () => {
    resetForm();
    handleCloseDataModel(false);
  };
  if (errorProfile)
    return (
      <ErrorMsg ErrorMsg={"Sorry ! Unable to To Get Data Try Again Later "} />
    );
  return (
    <div className="p-10 relative">
      <div className=" text-2xl font-semibold text-btn-primary">
        {currentdata ? "Update" : "Add"} Experience
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
              <label htmlFor="job_title">Job Title</label>

              <input
                type="text"
                id="job_title"
                name="job_title"
                placeholder="Enter Title"
                onKeyDown={validateInuts}
                maxLength={35}
                className="p-2 border bg-gray-200"
                onChange={handleChange}
                value={values.job_title}
              />
              {errors.job_title && touched.job_title && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.job_title}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="company_name">Company Name</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                onKeyDown={validateInuts}
                placeholder="Enter Company Name"
                maxLength={35}
                className="p-2 border bg-gray-200"
                onChange={handleChange}
                value={values.company_name}
              />
              {errors.company_name && touched.company_name && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.company_name}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="job_description">Job Description</label>
              <textarea
                
                rows={4}
                maxLength={200}
                type="text"
                placeholder="Enter Job Description"
                onKeyDown={validateInuts}
                id="job_description"
                name="job_description"
                className="p-2 border outline-none bg-gray-200"
                onChange={handleChange}
                value={values.job_description}
              />
              {errors.job_description && touched.job_description && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.job_description}
                </p>
              )}
            </div>
            <div className="flex  flex-col md:flex-row  justify-between md:gap-10">
              <div className="flex flex-col w-full">
                <label htmlFor="date_from">Start Date </label>
                <input
                  type="date"
                  id="date_from"
                  name="date_from"
                  value={values.date_from}
                  className="p-2 border bg-gray-200 w-full"
                  onChange={handleChange}
                />
                {errors.date_from && touched.date_from && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.date_from}
                  </p>
                )}
              </div>

              <div className="flex flex-col w-full">
                <label htmlFor="date_to">End Date </label>
                <input
                  type="date"
                  id="date_to"
                  name="date_to"
                  value={values.is_current ? "" : values.date_to} // If is_current is true, leave the date_to empty
                  disabled={values.is_current} // Disable the field if is_current is true
                  className={`p-2 border  ${
                    values.is_current ? "bg-gray-400" : "bg-gray-200"
                  } w-full disabled:cursor-not-allowed`}
                  onChange={handleChange}
                />
                {errors.date_to && touched.date_to && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.date_to}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="is_current"
                id="is_current"
                onChange={handleChange}
                checked={values.is_current}
              />{" "}
              <label htmlFor="is_current">I currently work here</label>
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

export default AddWorkExperience;
