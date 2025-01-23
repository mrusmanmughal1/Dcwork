import { useFormik } from "formik";
import { JobPost } from "../../helpers/Schema/FormValidation";
import { useJobPost } from "../../Services/JobPost/useJobPost";
import Select from "react-select";

import { useWorkAuthorization } from "../../Services/General/useWorkAuthorization";
import { useSpecialization } from "../../Services/General/useSpecialization";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import MiniLoader from "../../UI/MiniLoader";

const NewPost = () => {
  const { mutate: PostJob, isLoading } = useJobPost();
  const {
    values,
    errors,
    touched,
    handleChange,
    handleSubmit,
    handleBlur,
    setFieldValue,
  } = useFormik({
    initialValues: {
      contract_type: "",
      title: "",
      remote_work: false,
      addresses: [
        {
          state: "",
          city: "",
          zip_code: "",
        },
      ],
      duration: "",
      rate: "",
      job_description: "",
      work_authorization: [],
      other_work_authorization: "",
      specializations_skills: [],
      job_posting_deadline: "",
    },
    onSubmit: (values, action) => {
      PostJob(values);
    },
    validationSchema: JobPost,
  });

  const {
    data,
    isLoading: workLoading,
    isError: error,
  } = useWorkAuthorization();
  const {
    data: specialization,
    isLoading: load,
    isError,
  } = useSpecialization();

  // Add a new address field
  const handleAddAddress = () => {
    setFieldValue("addresses", [
      ...values.addresses,
      { state: "", city: "", zip_code: "" },
    ]);
  };

  // Remove an address field
  const handleRemoveAddress = (index) => {
    setFieldValue("addresses", values.addresses.filter((_, i) => i !== index));
  };

  // Handle address field changes
  const handleAddressChange = (index, e) => {
    const { name, value } = e.target;
    const updatedAddresses = [...values.addresses];
    updatedAddresses[index] = { ...updatedAddresses[index], [name]: value };
    setFieldValue("addresses", updatedAddresses);
  };

  // Handle specializations change
  const handleSpecialChange = (SELECTED) => {
    const selectedValues = SELECTED ? SELECTED.map((option) => option.value) : [];
    setFieldValue("specializations_skills", selectedValues);
  };

  // Handle work authorization change
  const handleWorkAuthChange = (SELECTED) => {
    const selectedValues = SELECTED ? SELECTED.map((option) => option.value) : [];
    setFieldValue("work_authorization", selectedValues);
  };

  if (load || workLoading) return <Loader style="py-20" />;
  if (isError || error) return <ErrorMsg ErrorMsg="Sorry Unable to fetch Data Try Again Later !" />;

  return (
    <div className="w-full md:w-3/5">
      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-col gap-4">
          <p className="mb-4 font-semibold uppercase text-2xl">Contact Type</p>
          <div className="md:flex grid  grid-cols-2  gap-4">
            {/* Radio buttons for contract types */}
            <div className="div flex items-center gap-2">
              <input
                type="radio"
                name="contract_type"
                id="Contract"
                value="Contract"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.contract_type === "Contract"}
              />
              <label htmlFor="Contract">Contract</label>
            </div>
            <div className="div flex items-center gap-2">
              <input
                type="radio"
                name="contract_type"
                id="ft"
                value="Full Time"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.contract_type === "Full Time"}
              />
              <label htmlFor="ft">Full Time</label>
            </div>
            <div className="div flex items-center gap-2">
              <input
                type="radio"
                name="contract_type"
                id="int"
                value="Internship"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.contract_type === "Internship"}
              />
              <label htmlFor="int">Internship</label>
            </div>
            <div className="div flex items-center gap-2">
              <input
                type="radio"
                name="contract_type"
                id="pt"
                value="Part Time"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.contract_type === "Part Time"}
              />
              <label htmlFor="pt">Part Time</label>
            </div>
          </div>
          {errors.contract_type && touched.contract_type && (
            <p className="text-start px-1 text-sm font-semibold text-red-600">
              {errors.contract_type}
            </p>
          )}

          <div className="w-full space-y-2">
            <p>Job Title</p>
            <input
              type="text"
              className="w-full p-2 py-3 bg-gray-100"
              placeholder="Job Title"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
            />
            {errors.title && touched.title && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.title}
              </p>
            )}
          </div>

          <div className="py-2">
            <p>Remote Work</p>
            <div className="flex gap-4 items-center">
              <input
                type="checkbox"
                name="remote_work"
                id="remote_work"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.remote_work}
              />
              <label htmlFor="remote_work">Yes</label>
            </div>
            {errors.remote_work && touched.remote_work && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.remote_work}
              </p>
            )}
          </div>

          {/* Dynamic Address Fields */}
          <div className="space-y-4">
            <p>Job Address</p>
            {values.addresses.map((address, index) => (
              <div key={index} className="flex flex-col md:flex-row gap-2 items-center">
                <div className="md:w-[32%]">
                  <div className="flex flex-col gap-3">
                    <label htmlFor={`address-state-${index}`}>State</label>
                    <input
                      type="text"
                      id={`address-state-${index}`}
                      name="state"
                      className="border p-2 py-3 w-full bg-gray-100"
                      onChange={(e) => handleAddressChange(index, e)}
                      onBlur={handleBlur}
                      value={address.state}
                    />
                    {errors.addresses && errors.addresses[index] && errors.addresses[index].state && (
                      <p className="text-start px-1 text-sm font-semibold text-red-600">
                        {errors.addresses[index].state}
                      </p>
                    )}
                  </div>
                </div>
                <div className="md:w-[32%]">
                  <div className="flex flex-col gap-3">
                    <label htmlFor={`address-city-${index}`}>City</label>
                    <input
                      type="text"
                      id={`address-city-${index}`}
                      name="city"
                      className="border p-2 py-3 w-full bg-gray-100"
                      onChange={(e) => handleAddressChange(index, e)}
                      onBlur={handleBlur}
                      value={address.city}
                    />
                    {errors.addresses && errors.addresses[index] && errors.addresses[index].city && (
                      <p className="text-start px-1 text-sm font-semibold text-red-600">
                        {errors.addresses[index].city}
                      </p>
                    )}
                  </div>
                </div>
                <div className="md:w-[32%]">
                  <div className="flex flex-col gap-3">
                    <label htmlFor={`address-zip_code-${index}`}>Zip Code</label>
                    <input
                      type="text"
                      id={`address-zip_code-${index}`}
                      name="zip_code"
                      className="border p-2 py-3 w-full bg-gray-100"
                      onChange={(e) => handleAddressChange(index, e)}
                      onBlur={handleBlur}
                      value={address.zip_code}
                    />
                    {errors.addresses && errors.addresses[index] && errors.addresses[index].zip_code && (
                      <p className="text-start px-1 text-sm font-semibold text-red-600">
                        {errors.addresses[index].zip_code}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center">
                  <button
                    type="button"
                    onClick={() => handleRemoveAddress(index)}
                    className="bg-red-500 text-white p-2 rounded"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddAddress}
              className="bg-blue-500 text-white p-2 rounded"
            >
              Add Address
            </button>
          </div>

          <div className="w-full space-y-2">
            <p>Job Description</p>
            <textarea
              className="w-full p-2 py-3 bg-gray-100"
              placeholder="Job Description"
              name="job_description"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.job_description}
            />
            {errors.job_description && touched.job_description && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.job_description}
              </p>
            )}
          </div>

          <div className="w-full space-y-2">
            <p>Job Duration</p>
            <input
              type="text"
              className="w-full p-2 py-3 bg-gray-100"
              placeholder="Job Duration"
              name="duration"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.duration}
            />
            {errors.duration && touched.duration && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.duration}
              </p>
            )}
          </div>

          <div className="w-full space-y-2">
            <p>Rate</p>
            <input
              type="text"
              className="w-full p-2 py-3 bg-gray-100"
              placeholder="Rate"
              name="rate"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.rate}
            />
            {errors.rate && touched.rate && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.rate}
              </p>
            )}
          </div>

          <div className="w-full space-y-2">
            <p>Job Posting Deadline</p>
            <input
              type="date"
              className="w-full p-2 py-3 bg-gray-100"
              name="job_posting_deadline"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.job_posting_deadline}
            />
            {errors.job_posting_deadline && touched.job_posting_deadline && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.job_posting_deadline}
              </p>
            )}
          </div>

          <div className="w-full space-y-2">
            <p>Work Authorization</p>
            <Select
              isMulti
              name="work_authorization"
              options={data.map((auth) => ({ value: auth, label: auth }))}
              onChange={handleWorkAuthChange}
              onBlur={handleBlur}
              value={values.work_authorization.map((auth) => ({ value: auth, label: auth }))}
            />
            {errors.work_authorization && touched.work_authorization && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.work_authorization}
              </p>
            )}
          </div>

          <div className="w-full space-y-2">
            <p>Specializations & Skills</p>
            <Select
              isMulti
              name="specializations_skills"
              options={specialization.map((spec) => ({ value: spec, label: spec }))}
              onChange={handleSpecialChange}
              onBlur={handleBlur}
              value={values.specializations_skills.map((spec) => ({ value: spec, label: spec }))}
            />
            {errors.specializations_skills && touched.specializations_skills && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.specializations_skills}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full bg-green-500 text-white p-2 rounded"
            >
              {isLoading ? <MiniLoader /> : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default NewPost;
