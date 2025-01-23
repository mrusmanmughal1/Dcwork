import { useFormik } from "formik";
import { JobPost } from "../../helpers/Schema/FormValidation";
import { useJobPost } from "../../Services/JobPost/useJobPost";
import Select from "react-select";
import { useWorkAuthorization } from "../../Services/General/useWorkAuthorization";
import { useSpecialization } from "../../Services/General/useSpecialization";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import MiniLoader from "../../UI/MiniLoader";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import AddSkills from "../../Reuseables/AddSkills";
import CountryStateCityZipcode from "../../UI/CountryStateCityZipcode";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import toast from "react-hot-toast";
import { Tooltip as ReactTooltip } from "react-tooltip";
import TextEditor from "../../Reuseables/TextEditor";
const NewPost = () => {
  const [symbol, setsymbol] = useState("");
  const [loadDesc, setloadDesc] = useState(false);
  const [loadSkills, setloadSkills] = useState([]);
  const [autoGenerateContent, setautoGenerateContent] = useState("");
  const navigate = useNavigate();
  const initialValues = {
    contract_type: "",
    title: "",
    remote: false,
    addresses: [
      {
        country: "",
        state: "",
        city: "",
        zip_code: "",
      },
    ],
    hybrid: false,
    currency_symbol: symbol.currency_symbol ? symbol.currency_symbol : "$",
    skill_level: "",
    job_skill: [],
    rate: "",
    job_description: "",
    work_authorization: [],
    focused_industries: [],
    job_posting_deadline: "",
    rate_unit: "",
  };
  const {
    mutate: PostJob,
    isPending: updatePending,
    isError: postError,
    error: errorpost,
  } = useJobPost();

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;

    if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
      e.preventDefault(); // Block the space from being typed at the beginning
    }

    if (name === "job_description" || name === "ai") {
      // Prevent space at the beginning of the interviewer name input field
      if (
        input.selectionStart === 0 &&
        (e.key === " " || e.keyCode === 32 || e.key === "<p>&nbsp;</p>")
      ) {
        e.preventDefault(); // Block the space from being typed at the beginning
      }
    }

    if (name === "title") {
      if (
        !/[A-Za-z0-9\s]/.test(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete"
      ) {
        e.preventDefault(); // Block non-alphabetic and non-space keys
      }
    }
    if (name === "rate") {
      if (!/\d/.test(e.key) && e.key !== "Backspace" && e.key !== "Delete") {
        e.preventDefault(); // Block non-digit keys except for Backspace and Delete
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
    resetForm,
  } = useFormik({
    initialValues,
    onSubmit: (values, action) => {
      const data = {
        ...values,

        job_skill: values.job_skill.toString(),
      };
      PostJob(data, {
        onSuccess: () => {
          resetForm();
          navigate("/employer-dashboard/applied");
        },
      });
    },
    validationSchema: JobPost,
  });
  const getDescription = async (e) => {
    e.preventDefault(e);
    setloadDesc(true);
    const Post = `${BASE_URL}api/jobs/create/`;
    const token = localStorage.getItem("Token");
    try {
      if (autoGenerateContent.length > 3) {
        const res = await axios.post(
          Post,
          { job_title_for_generation: autoGenerateContent },
          {
            headers: {
              Authorization: `Token ${token}`,
            },
          }
        );
        if (res.data && res.data.job_description) {
          setFieldValue("job_description", res.data.job_description);
          setFieldValue("title", res.data.job_title);

          setloadSkills(res?.data?.job_skills);

          toast.success("Description Generated", { id: "toadt-i" }); // Set the description in Formik
        }
      } else {
        toast.error("Search Length must be greater than 3 characters", {
          id: "toadt-i",
        });
      }
    } catch (error) {
      toast.error("Sorry ,Unable to Generate Description Right Now", {
        id: "toadt-id",
      }); // Log any errors
    } finally {
      setloadDesc(false);
    }
  };
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
      { country: "", state: "", city: "", zip_code: "" },
    ]);
  };
  useEffect(() => {
    // Wait until the DOM element is rendered
    const inputElement = document.querySelector('input[name="rate"]');

    // Check if the element exists before adding event listener
    if (inputElement) {
      const handleWheel = (e) => {
        e.preventDefault();
        e.stopPropagation();
      };

      inputElement.addEventListener("wheel", handleWheel, { passive: false });

      // Clean up the event listener when the component unmounts
      return () => {
        inputElement.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  // handle special change
  const handleSpecialChange = (SELECTED) => {
    const selectedValues = SELECTED
      ? SELECTED.map((option) => option.value)
      : [];
    setFieldValue("focused_industries", selectedValues);
  };

  // handle workAUth
  const handleWorkAuthChange = (SELECTED) => {
    const selectedValues = SELECTED
      ? SELECTED.map((option) => option.value)
      : [];
    setFieldValue("work_authorization", selectedValues);
  };
  // handle skills

  const resultContainer = useRef(null);

  if (load || workLoading) return <Loader style="py-20" />;
  if (isError || error)
    return (
      <ErrorMsg
        ErrorMsg={
          errorpost?.response?.data?.details
            ? errorpost.response?.data?.details
            : isError?.response?.data?.message
            ? isError?.response?.data?.message
            : "Sorry Unable to fetch Data Try Again Later !"
        }
      />
    );
  return (
    <div className="w-full md:w-[85%]">
      {loadDesc && (
        <div className="bg-black fixed inset-0 z-[999] flex items-center justify-center opacity-70">
          <div className="loaderAI"></div>
          <br />
          <p className="text-white text-lg font-bold mx-4">
            Generating Descriptions and Skills...
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="flex w-full flex-col gap-4">
          <div className="flex gap-2  w-full">
            <div className="w-full">
              <p>AI Search</p>
              <div className="flex items-center gap-2 ">
                <input
                  type="text"
                  value={autoGenerateContent}
                  onChange={(e) => setautoGenerateContent(e.target.value)}
                  name="ai"
                  onKeyDown={validateInuts}
                  className="bg-gray-200 p-2 py-3 w-full"
                  placeholder="Type Keywords "
                  maxLength={70}
                />
                <button
                  data-tooltip-id="Generate"
                  className="bg-btn-primary py-3 px-3 text-white rounded-md"
                  type="button"
                  onClick={(e) => getDescription(e)}
                >
                  {loadDesc ? <MiniLoader /> : "Generate"}
                </button>
              </div>
            </div>
          </div>
          <div className="w-full space-y-2">
            <p>Job Title *</p>
            <div className="flex flex-col   ">
              <input
                type="text"
                className={`w-full p-2 py-3 bg-gray-200 ${
                  errors.title && touched.title ? " border border-red-600" : ""
                }`}
                placeholder="Job Title"
                name="title"
                maxLength={35}
                onKeyDown={validateInuts}
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
          </div>
          <AddSkills
            skill="job_skill"
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            resultContainer={resultContainer}
            loadSkills={loadSkills}
            validateInuts={validateInuts}
          />
          <div>
            <TextEditor
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              handleBlur={handleBlur}
              validateInuts={validateInuts}
              handleChange={handleChange}
            />
          </div>
          <div className="">
            <p className="   capitalize">
              Contact Type <span className="te">*</span>
            </p>
            <div className="md:flex grid  grid-cols-2  gap-4">
              <div className="div flex items-center gap-2">
                <input
                  type="radio"
                  name="contract_type"
                  id="ct"
                  value="Contract"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  checked={values.contract_type === "Contract"}
                />
                <label htmlFor="ct">Contract</label>
              </div>

              <div className="div flex items-center gap-2">
                <input
                  type="radio"
                  name="contract_type"
                  id="ft"
                  value="Full_Time"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  checked={values.contract_type === "Full_Time"}
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
                  value="Part_Time"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  checked={values.contract_type === "Part_Time"}
                />
                <label htmlFor="pt">Part Time</label>
              </div>
            </div>
            {errors.contract_type && touched.contract_type && (
              <p className="text-start px-1 text-sm font-semibold text-red-600">
                {errors.contract_type}
              </p>
            )}
          </div>
          <div className="">
            <div className="">
              <p className=" ">
                Job Type <span className="te">*</span>
              </p>
            </div>

            <div className="flex gap-4">
              <div className="py-2">
                <div className="flex gap-4 items-center">
                  <input
                    type="checkbox"
                    name="remote"
                    id="remote"
                    onChange={(e) => {
                      const { checked } = e.target;
                      setFieldValue("remote", checked);
                      // Optionally, clear addresses if remote is true
                      if (checked) {
                        setFieldValue("addresses", []);
                        setFieldValue("hybrid", false);
                      } else {
                        setFieldValue("addresses", [
                          {
                            state: "",
                            city: "",
                            zip_code: "",
                            country: "",
                          },
                        ]);
                      }
                    }}
                    onBlur={handleBlur}
                    checked={values.remote}
                  />
                  <label htmlFor="remote">Remote</label>
                </div>
                {errors.remote && touched.remote && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.remote}
                  </p>
                )}
              </div>
              <div className="py-2">
                <div className="flex gap-4 items-center">
                  <input
                    type="checkbox"
                    name="hybrid"
                    id="hybrid"
                    onChange={(e) => {
                      const { checked } = e.target;
                      setFieldValue("hybrid", checked);
                      setFieldValue("remote", false);
                      setFieldValue("addresses", [
                        {
                          state: "",
                          city: "",
                          zip_code: "",
                          country: "",
                        },
                      ]);
                    }}
                    onBlur={handleBlur}
                    checked={values.hybrid}
                  />
                  <label htmlFor="hybrid">Hybrid</label>
                </div>
                {errors.hybrid && touched.hybrid && (
                  <p className="text-start px-1 text-sm font-semibold text-red-600">
                    {errors.hybrid}
                  </p>
                )}
              </div>
            </div>
          </div>
          {/* Addresses */}
          {!values.remote && (
            <div className="space-y-4 w-full">
              <p>Job Address</p>

              <CountryStateCityZipcode
                values={values}
                data={data}
                errors={errors}
                setFieldValue={setFieldValue}
                setsymbol={setsymbol}
                touched={touched}
              />

              {/* <button
                type="button"
                onClick={handleAddAddress}
                className="bg-btn-primary flex gap-2 items-center text-white p-2 rounded"
              >
                <IoIosAddCircle /> Add More
              </button> */}
            </div>
          )}

          {/* other  */}
          <div className="flex flex-col gap-4">
            {/* add skils  */}

            <div className="w-full  ">
              <label htmlFor="skill_level">Years Of Experience *</label>
              <select
                id="skill_level"
                name="skill_level"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.skill_level}
                className={`w-full p-2 py-3 outline-none bg-gray-200 ${
                  errors.skill_level && touched.skill_level
                    ? " border border-red-600"
                    : ""
                }`}
              >
                <option>Select Experience </option>
                <option value="0-1"> 0-1 years</option>
                <option value="1-5"> 1-5 years</option>
                <option value="5-10+"> 5-10+ years</option>
              </select>
              {errors.skill_level && touched.skill_level && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.skill_level}
                </p>
              )}
            </div>

            <div>
              <p>
                Salary ({symbol.currency_symbol ? symbol.currency_symbol : "$"})
                *
              </p>
              <div className="flex gap-4 py-2">
                <div className="div flex items-center gap-2">
                  <input
                    type="radio"
                    name="rate_unit"
                    id="hr"
                    value="hr"
                    onChange={handleChange}
                  />
                  <label htmlFor="hr">Hourly</label>
                </div>
                <div className="div flex items-center gap-2">
                  <input
                    type="radio"
                    name="rate_unit"
                    id="mo"
                    value="mo"
                    onChange={handleChange}
                  />
                  <label htmlFor="mo">Monthly </label>
                </div>
                <div className="div flex items-center gap-2">
                  <input
                    type="radio"
                    name="rate_unit"
                    id="yr"
                    value="yr"
                    onChange={handleChange}
                  />
                  <label htmlFor="yr">Annually</label>
                </div>
                <div className="">
                  {errors.rate_unit && touched.rate_unit && (
                    <p className="text-start px-1 text-sm font-semibold text-red-600">
                      {errors.rate_unit}
                    </p>
                  )}
                </div>
              </div>

              <input
                type="text"
                className={`w-full p-2 py-3 bg-gray-200 ${
                  errors.rate && touched.rate ? " border border-red-600" : ""
                }`}
                placeholder="Rate"
                name="rate"
                id="rate"
                maxLength={7}
                onChange={handleChange}
                onKeyDown={validateInuts}
                onBlur={handleBlur}
                value={values.rate}
              />
              {errors.rate && touched.rate && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.rate}
                </p>
              )}
            </div>

            <div>
              <p>Work Authorization</p>
              <div
                className={`w-full   bg-gray-200 ${
                  errors.work_authorization && touched.work_authorization
                    ? " border border-red-600"
                    : ""
                }`}
              >
                <Select
                  isMulti
                  className=""
                  onChange={handleWorkAuthChange}
                  options={data?.data?.work_authorizations?.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                />
              </div>
              {errors.work_authorization && touched.work_authorization && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.work_authorization}
                </p>
              )}
            </div>

            <div>
              <p>Industries *</p>
              <div
                className={`w-full   bg-gray-200 ${
                  errors.focused_industries && touched.focused_industries
                    ? " border border-red-600"
                    : ""
                }`}
              >
                <Select
                  isMulti
                  className=""
                  onChange={handleSpecialChange}
                  options={specialization.data?.specializations?.map(
                    (option) => ({
                      value: option,
                      label: option,
                    })
                  )}
                />
              </div>
              {errors.focused_industries && touched.focused_industries && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.focused_industries}
                </p>
              )}
            </div>
            <div>
              <p>Job Posting Deadline (MM/DD/YYYY) *</p>
              <input
                type="date"
                className={`w-full p-2 py-3   bg-gray-200 ${
                  errors.job_posting_deadline && touched.job_posting_deadline
                    ? " border border-red-600"
                    : ""
                }`}
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
          </div>

          <div className="text-center">
            <button
              disabled={updatePending}
              type="submit"
              className="px-8 py-4 rounded-md font-semibold text-white bg-btn-primary"
            >
              {updatePending ? <MiniLoader /> : "POST JOB"}
            </button>
          </div>
        </div>
      </form>
      <ReactTooltip
        id="Generate"
        place="bottom"
        content="Auto Generate Description"
      />
    </div>
  );
};

export default NewPost;
