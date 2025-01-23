import { useEffect } from "react";
import { RxCross2 } from "react-icons/rx";
import { useCandidateManageProfile } from "../../../Services/Candidate/CandidateManageProfile";
import { useFormik } from "formik";
import MiniLoader from "../../../UI/MiniLoader";
import ErrorMsg from "../../../UI/ErrorMsg";
import {
  CertificateCandidate,
  ExpeirencCandidate,
} from "../../../helpers/Schema/FormValidation";

const AddCertificate = ({ currentdata, handleCloseDataModel }) => {
  const {
    mutate: updateProfile,
    isPending,
    isError: errorProfile,
  } = useCandidateManageProfile();

  const initialValues = {
    id: "",
    certificate_name: "",
    issuing_organization: "",
    date_of_issue: "",
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
        certificate_name: values.certificate_name,
        issuing_organization: values.issuing_organization,

        date_of_issue: values.date_of_issue
          ? new Date(values.date_of_issue).toISOString().split("T")[0]
          : null,
      };
      if (values.id) {
        education.id = values.id;
      }
      formData.append("candidate_certificates", JSON.stringify([education]));

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
    validationSchema: CertificateCandidate,
  });
  useEffect(() => {
    if (currentdata) {
      setFieldValue("id", currentdata.id);
      setFieldValue("certificate_name", currentdata.certificate_name);

      setFieldValue("issuing_organization", currentdata.issuing_organization);
      setFieldValue("date_of_issue", currentdata.date_of_issue);
    }
  }, [currentdata]);

  const handlecancel = () => {
    resetForm();
    handleCloseDataModel(false);
  };

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;
    if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
      e.preventDefault(); // Block the space from being typed at the beginning
    }
    if (name === "certificate_name" || name === "issuing_organization") {
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
  if (errorProfile)
    return (
      <ErrorMsg ErrorMsg={"Sorry ! Unable to To Get Data Try Again Later "} />
    );
  return (
    <div className="p-10 relative">
      <div className=" text-2xl font-semibold text-btn-primary">
        {currentdata ? "Update" : "Add"} Certificate
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
              <label htmlFor="certificate_name">Certificate Name</label>

              <input
                type="text"
                id="certificate_name"
                placeholder="Enter Certificate"
                name="certificate_name"
                maxLength={35}
                onKeyDown={validateInuts}
                className={` p-2 border bg-gray-200 ${
                  errors.certificate_name && touched.certificate_name
                    ? "border-red-500"
                    : ""
                }`}
                onChange={handleChange}
                value={values.certificate_name}
              />
              {errors.certificate_name && touched.certificate_name && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.certificate_name}
                </p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="company_name">Organization Name</label>
              <input
                type="text"
                maxLength={35}
                placeholder="Enter Organization"
                onKeyDown={validateInuts}
                id="issuing_organization"
                name="issuing_organization"
                className={` p-2 border bg-gray-200 ${
                  errors.issuing_organization && touched.issuing_organization
                    ? "border-red-600"
                    : ""
                }`}
                onChange={handleChange}
                value={values.issuing_organization}
              />
              {errors.issuing_organization && touched.issuing_organization && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.issuing_organization}
                </p>
              )}
            </div>

            <div className="flex  justify-between gap-10">
              <div className="flex flex-col w-full">
                <label htmlFor="date_of_issue">Date Of Issue </label>
                <input
                  type="date"
                  id="date_of_issue"
                  name="date_of_issue"
                  value={values.date_of_issue}
                  className={` p-2 border bg-gray-200 w-full ${
                    errors.date_of_issue && touched.date_of_issue
                      ? "border-red-500"
                      : ""
                  }`}
                  onChange={handleChange}
                  onKeyDown={validateInuts}
                />
                {errors.date_of_issue && touched.date_of_issue && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.date_of_issue}
                  </p>
                )}
              </div>
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

export default AddCertificate;
