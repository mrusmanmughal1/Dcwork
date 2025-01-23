import { useUpdatejob } from "../../Services/Employer/useUpdatejob";
import { useFormik } from "formik";
import { JobPost } from "../../helpers/Schema/FormValidation";
import Select from "react-select";
import { useWorkAuthorization } from "../../Services/General/useWorkAuthorization";
import { useSpecialization } from "../../Services/General/useSpecialization";
import { IoIosAddCircle } from "react-icons/io";
import ErrorMsg from "../../UI/ErrorMsg";
import MiniLoader from "../../UI/MiniLoader";
import { RxCross2 } from "react-icons/rx";
import { useEffect, useRef, useState } from "react";
import ScrollToTop from "../../Reuseables/ScrollToTop";
import CountryStateCityZipcode from "../../UI/CountryStateCityZipcode";
import AddSkills from "../../Reuseables/AddSkills";
import toast from "react-hot-toast";
import { BASE_URL } from "../../config/Config";
import axios from "axios";
import { GiAutoRepair } from "react-icons/gi";
import TextEditor from "../../Reuseables/TextEditor";
const UpdateJob = ({ edit, setupdateModel }) => {
  const [data, setdata] = useState();
  const [loadDesc, setloadDesc] = useState(false);
  const [autoGenerateContent, setautoGenerateContent] = useState("");
  const [loadSkills, setloadSkills] = useState([]);

  const {
    mutate: updatejob,
    isPending,
    isError: errorupdate,
  } = useUpdatejob(data?.id);
  const {
    data: workAuthData,
    isLoading: workLoading,
    isError: error,
  } = useWorkAuthorization();
  const {
    data: specialization,
    isLoading: load,
    status,
    isError,
  } = useSpecialization();

  const {
    contract_type,
    title,
    hybrid,
    remote,
    skill_level,
    rate,
    job_description,
    addresses,
    work_authorization,
    focused_industries,
    job_skill,
    job_posting_deadline,
    rate_unit,
    currency_symbol,
  } = data || {};
  const initialValues = {
    contract_type: contract_type,
    title: title,
    remote: remote,
    addresses: addresses || [],
    required_profession: "",
    hybrid: hybrid == true ? true : false,
    skill_level: skill_level,
    rate: rate,
    job_description: job_description,
    work_authorization: work_authorization || [],
    job_skill: job_skill || [],
    focused_industries: focused_industries || [],
    job_posting_deadline: job_posting_deadline,
    rate_unit: rate_unit,
    currency_symbol: currency_symbol,
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
    onSubmit: (values, action) => {
      const UpdatedData = {
        ...values,
        addresses: values.remote ? [] : values.addresses,
        job_skill: values.job_skill.toString(),
      };
      updatejob(UpdatedData, {
        onSuccess: () => setupdateModel(false),
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
      if (autoGenerateContent.length > 4) {
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
          setloadSkills(res?.data?.job_skills);

          toast.success("Description Generated", { id: "toadt-i" }); // Set the description in Formik
        }
      } else {
        toast.error("Details Length must be greater than 4 characters", {
          id: "toadt-i",
        });
      }
    } catch (error) {
      toast.error("Sorry ,Unable to Generate Description Right Now", {
        id: "toadt-id",
      }); // Log any errors
      // Optionally, you can handle errors here, e.g., show a toast notification
    } finally {
      setloadDesc(false);
    }
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
  useEffect(() => {
    if (edit) {
      setdata(edit);
      setFieldValue("currency_symbol", edit.currency_symbol);
      // Manually reset Formik values
      setFieldValue("contract_type", edit.contract_type || "");
      setFieldValue("title", edit.title || "");
      setFieldValue("job_skill", edit.job_skill || []);

      setFieldValue("remote", edit.hybrid ? false : edit.remote);
      setFieldValue("addresses", edit.addresses || []);
      setFieldValue("skill_level", edit.skill_level || "");
      setFieldValue("rate", edit.rate || "");
      setFieldValue("job_description", edit.job_description || "");
      setFieldValue("work_authorization", edit.work_authorization || []);
      setFieldValue("rate_unit", edit.rate_unit || "");
      setFieldValue("hybrid", edit.hybrid || false);

      setFieldValue("focused_industries", edit.focused_industries || []);
      setFieldValue("job_posting_deadline", edit.job_posting_deadline || "");
    }
  }, [edit, setFieldValue]);
  // handle change address

  // Add a new address field
  const handleAddAddress = () => {
    setFieldValue("addresses", [
      ...values.addresses,
      { country: "", state: "", city: "", zip_code: "" },
    ]);
  };
  // handle special change
  const handleSpecialChange = (SELECTED) => {
    const selectedValues = SELECTED
      ? SELECTED.map((option) => option.value)
      : [];
    setFieldValue("focused_industries", selectedValues);
  };
  // handle Authorization
  const handleWorkAuthChange = (SELECTED) => {
    const selectedValues = SELECTED
      ? SELECTED.map((option) => option.value)
      : [];
    setFieldValue("work_authorization", selectedValues);
  };

  const resultContainer = useRef(null);
  if (workLoading || load) return <MiniLoader />;
  if (!edit || error || isError)
    return <ErrorMsg ErrorMsg={"Unable To Fetch Data "} />;
  if (errorupdate)
    return <ErrorMsg ErrorMsg={"Unable To Update Job right now "} />;
  return (
    <div className="w-full relative   pb-20">
      <ScrollToTop />
      <div className=" sticky w-full   z-[99] text-white bg-btn-primary  flex right-0 -top-1 pt-2   items-center justify-between">
        <p className="text-2xl uppercase font-semibold ps-8   ">Update Job </p>
        <button onClick={() => setupdateModel(false)} className="p-4  text-2xl">
          <RxCross2 />
        </button>
      </div>
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
        <div className="flex w-full flex-col  px-8 pt-4 space-y-2 mt-4">
          <div className="flex gap-2  w-full">
            <div className="w-full">
              <p>AI Search</p>
              <div className="flex items-center gap-2 ">
                <input
                  type="text"
                  value={autoGenerateContent}
                  onChange={(e) => setautoGenerateContent(e.target.value)}
                  name="ai"
                  // onKeyDown={validateInuts}
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
            <p>Job Title</p>
            <input
              type="text"
              className="w-full p-2 py-3 bg-gray-200"
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

          <div>
            <TextEditor
              values={values}
              errors={errors}
              touched={touched}
              setFieldValue={setFieldValue}
              handleBlur={handleBlur}
              handleChange={handleChange}
            />
          </div>

          <AddSkills
            skill="job_skill"
            setFieldValue={setFieldValue}
            errors={errors}
            touched={touched}
            handleBlur={handleBlur}
            resultContainer={resultContainer}
            loadSkills={job_skill}
          />

          <p className="  ">Contact Type</p>
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
                          country: "",
                          state: "",
                          city: "",
                          zip_code: "",
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
                        country: "",
                        state: "",
                        city: "",
                        zip_code: "",
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

          {/* Addresses */}
          {!values.remote && (
            <div className="space-y-4">
              <p>Job Address</p>

              <CountryStateCityZipcode
                values={values}
                data={data}
                errors={errors}
                setFieldValue={setFieldValue}
                setsymbol={values.currency_symbol}
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

          <div className="flex flex-col gap-4">
            <div className="w-full">
              <label htmlFor="skill_level">Years Of Experience *</label>
              <select
                name="skill_level"
                id="skill_level"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.skill_level}
                className="block w-full border p-3 bg-gray-200"
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
                Salary ({values.currency_symbol ? values.currency_symbol : "$"})
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
                    checked={values.rate_unit === "hr"}
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
                    checked={values.rate_unit === "mo"}
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
                    checked={values.rate_unit === "yr"}
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
                type="number"
                className="w-full p-2 py-3 bg-gray-200"
                placeholder="Rate"
                name="rate"
                id="rate"
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp" || e.key === "ArrowDown") {
                    e.preventDefault(); // Prevent arrow keys from changing the value
                  }
                }}
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

            <div>
              <p>Work Authorization</p>

              <Select
                isMulti
                name="work_authorization"
                className=""
                onChange={handleWorkAuthChange}
                value={values.work_authorization?.map((option) => ({
                  value: option,
                  label: option,
                }))}
                options={workAuthData?.data?.work_authorizations?.map(
                  (option) => ({ value: option, label: option })
                )}
              />

              {errors.work_authorization && touched.work_authorization && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.work_authorization}
                </p>
              )}
            </div>

            <div>
              <p>Industries</p>
              <Select
                isMulti
                className=""
                onChange={handleSpecialChange}
                value={values.focused_industries?.map((option) => ({
                  value: option,
                  label: option,
                }))}
                options={specialization?.data?.specializations?.map(
                  (option) => ({
                    value: option,
                    label: option,
                  })
                )}
              />
              {errors.focused_industries && touched.focused_industries && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.focused_industries}
                </p>
              )}
            </div>
            <div>
              <p>Job Posting Deadline (MM/DD/YYYY)</p>
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
          </div>

          <div className="text-center">
            <br />
            <button
              disabled={isPending}
              type="submit"
              className="px-8 py-4 rounded-md font-semibold text-white bg-btn-primary"
            >
              {isPending ? <MiniLoader /> : "UPDATE JOB"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UpdateJob;
