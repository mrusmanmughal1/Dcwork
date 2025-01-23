import { useEffect, useRef, useState } from "react";
import barComp from "../../assets/CandidateBars/3.png";
import { useNavigate } from "react-router-dom";
import { useCandidateDetails } from "../../Services/Candidate/useCandidateDetails";
import { useCandidateManageProfile } from "../../Services/Candidate/CandidateManageProfile";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { FaArrowLeft } from "react-icons/fa";
import MiniLoader from "../../UI/MiniLoader";
import { useSkills } from "../../Services/General/useSkills";
import { useSpecialization } from "../../Services/General/useSpecialization";
import { useFormik } from "formik";
import Select from "react-select";
import { BsBriefcase, BsChatSquareDots } from "react-icons/bs";
import { CiEdit } from "react-icons/ci";
import { BASE_URL_IMG } from "../../config/Config";
import pic from "../../assets/Profile-picture.png";
import { TbWorldHeart } from "react-icons/tb";
import { MdOutlineSettings } from "react-icons/md";

import { RiBriefcase4Line } from "react-icons/ri";
import { CandiateStep3Validation } from "../../helpers/Schema/FormValidation";
import toast from "react-hot-toast";
import { isEqual } from "lodash";

const ProfessionDetails = () => {
  const [inputSkill, setInputSkill] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const [isAvatarUpdated, setIsAvatarUpdated] = useState(false);
  const navigate = useNavigate();
  const { data, isLoading: loadingDetails, isError } = useCandidateDetails();
  const { data: Specializations, isLoading: loadspecial } = useSpecialization();

  const {
    data: skills,
    isLoading: LoadingSkills,
    isError: SkillsError,
  } = useSkills();
  const {
    mutate: updateProfile,
    isPending,
    isError: errorProfile,
  } = useCandidateManageProfile();

  const {
    candidate_avatar_image,
    candidate_exp_level,
    candidate_job_profession,
    candidate_about,
    candidate_focused_industries,
    candidate_professional_skill,
  } = data?.data?.data || {};

  const validateInuts = (e) => {
    const { name } = e.target;
    const input = e.target;
    if (name === "job_profession") {
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
        e.preventDefault(); // Block space from being typed at the beginning
      }

      if (
        !/^[A-Za-z0-9\s]*$/.test(e.key) && // only allow alphanumeric characters and spaces
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight"
      ) {
        e.preventDefault(); // Block any non-alphanumeric characters
      }
    }

    if (name === "address_1" || name === "address_2" || name === "zip_code") {
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
        e.preventDefault(); // Block space from being typed at the beginning
      }

      if (
        !/[A-Za-z0-9]/.test(e.key) && // Allow only letters and spaces
        e.key !== "Backspace" && // Allow backspace to delete
        e.key !== "Delete" // Allow delete key to remove text
      ) {
        e.preventDefault(); // Block non-alphabetic and non-space keys
      }

      if (
        input.selectionStart === 0 && // Check if the cursor is at the start of the input
        e.key === " " // Prevent space at the beginning of the string
      ) {
        e.preventDefault(); // Block space from being typed at the beginning
      }

      if (
        e.key === " " &&
        input.value.charAt(input.selectionStart - 1) === " "
      ) {
        e.preventDefault(); // Block multiple spaces in a row
      }
    }

    if (name === "about") {
      if (input.selectionStart === 0 && (e.key === " " || e.keyCode === 32)) {
        e.preventDefault(); // Block space from being typed at the beginning
      }
    }

    // Check if the field is 'phone'
    if (name === "phone") {
      if (
        !/[0-9]/.test(e.key) && // Allow only numbers
        e.key !== "Backspace" && // Allow backspace to delete
        e.key !== "Delete" // Allow delete key to remove text
      ) {
        e.preventDefault(); // Block non-numeric keys
      }
    }
    if (e.key === " " && input.value.charAt(input.selectionStart - 1) === " ") {
      e.preventDefault(); // Block multiple spaces in a row
    }
  };

  const initialValues = {
    exp_level: candidate_exp_level || "",
    about: candidate_about || "",
    job_profession: candidate_job_profession || "",
    focused_industries: candidate_focused_industries || "",
    professional_skill: candidate_professional_skill || [],
    avatar_image: candidate_avatar_image || "",
  };

  const resultContainer = useRef(null);
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
        // Append all fields except avatar_image
        if (key !== "avatar_image") {
          formData.append(key, values[key]);
        }
      });
      if (isAvatarUpdated) {
        formData.append("avatar_image", values.avatar_image);
      }

      if (!isEqual(values, initialValues)) {
        // Only make the API call if there are changes
        updateProfile(formData, {
          onSuccess: () =>
            navigate("/dashboard/profile/candiate-previous-history"),
        });
      } else {
        // If values are the same, just navigate without calling the API
        navigate("/dashboard/profile/candiate-previous-history");
      }
    },
    validationSchema: CandiateStep3Validation,
  });

  useEffect(() => {
    if (data && data.data) {
      const EMPDATA = data.data.data;
      Object.keys(initialValues).forEach((key) => {
        setFieldValue(key, EMPDATA[key] || initialValues[key]);
      });
    }
  }, [data, setFieldValue]);
  useEffect(() => {
    if (data?.data?.data) {
      const { candidate_professional_skill } = data.data.data;
      if (candidate_professional_skill) {
        setSelectedSkills(candidate_professional_skill);
      }
    }
  }, [data]);

  useEffect(() => {
    if (resultContainer.current && focusedIndex >= 0) {
      resultContainer.current.scrollIntoView({ block: "center" });
    }
  }, [focusedIndex]);

  if (loadingDetails || loadspecial || LoadingSkills)
    return <Loader style="py-20 " />;
  if (isError || errorProfile || SkillsError)
    return (
      <ErrorMsg ErrorMsg="Sorry ! unable to fetch Data right now Please Try Again later " />
    );

  // handle special change
  const handleSpecialChange = (SELECTED) => {
    const selectedValues = SELECTED
      ? SELECTED.map((option) => option.value)
      : [];

    setFieldValue("focused_industries", selectedValues);
  };

  const handleSkillInputChange = (event) => {
    const value = event.target.value;

    if (value.startsWith(" ")) {
      toast.error("The skill cannot start with a space.", { id: "id" });

      return;
    }
    setInputSkill(value);

    // Filter skills based on the input
    if (value) {
      const filtered = skills.skills.filter((skill) =>
        skill.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredSkills(filtered);
    } else {
      setFilteredSkills([]);
    }
  };

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setInputSkill(""); // Clear the input
      setFilteredSkills([]); // Clear suggestions
      setFieldValue("professional_skill", [...selectedSkills, skill]); // Update Formik value
    } else {
      toast.error("Skill Already Added", { id: "error-toast" });
    }
  };

  const handleTagRemove = (skill) => {
    const updatedSkills = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(updatedSkills);
    setFieldValue("professional_skill", updatedSkills); // Update Formik value
  };

  const handleKeyDown = (event) => {
    if (
      !/^[A-Za-z0-9\s]*$/.test(event.key) && // only allow alphanumeric characters and spaces
      event.key !== "Backspace" &&
      event.key !== "Delete" &&
      event.key !== "ArrowLeft" &&
      event.key !== "ArrowRight"
    ) {
      event.preventDefault(); // Block any non-alphanumeric characters
    }

    if (event.key === "ArrowDown") {
      setFocusedIndex((prevIndex) => (prevIndex + 1) % filteredSkills.length);
      event.preventDefault(); // Prevent default scrolling
    } else if (event.key === "ArrowUp") {
      setFocusedIndex(
        (prevIndex) =>
          (prevIndex - 1 + filteredSkills.length) % filteredSkills.length
      );
      event.preventDefault(); // Prevent default scrolling
    } else if (event.key === "Enter") {
      if (focusedIndex >= 0) {
        setInputSkill(filteredSkills[focusedIndex]);
        setFilteredSkills([]);
        setFocusedIndex(-1); // Reset focused index
      } else {
        if (!inputSkill.trim()) {
          toast.error("Please select a valid skill or enter one.", {
            id: "toastid",
          });
        } else {
          const alphanumericRegex = /^[A-Za-z0-9\s]*$/;

          if (
            !alphanumericRegex.test(inputSkill.trim()) ||
            !/[A-Za-z]/.test(inputSkill)
          ) {
            toast.error("Skill should contain only letters or alphanumeric ", {
              id: "toastid",
            });
          } else {
            handleSkillSelect(inputSkill); // If the input skill is valid, select it
          }
        }
      }
      event.preventDefault();
    }
  };
  return (
    <div>
      <p className="text-center text-btn-primary  pb-4 font-semibold">
        Enter Your Profession Details
      </p>
      <div className=" flex justify-center py-2">
        <img src={barComp} alt="" />
      </div>
      <div className="">
        <form onSubmit={handleSubmit}>
          <div className="flex items-center  pb-2 flex-col gap-4">
            <div className="relative ">
              <div className="w-24 h-24 relative  overflow-hidden bg-gray-200   rounded-full">
                <img
                  src={
                    values.avatar_image && values.avatar_image instanceof File
                      ? URL.createObjectURL(values.avatar_image)
                      : candidate_avatar_image
                      ? BASE_URL_IMG + candidate_avatar_image
                      : pic
                  }
                  alt="profileImage-"
                  className=" object-contain bg-gray-300 h-full w-full"
                />
              </div>

              <div className="absolute  bottom-2 right-2 cursor-pointer  ">
                <CiEdit className=" bg-slate-200 rounded-full right-0    cursor-pointer  bottom-0 absolute  text-2xl text-btn-primary" />

                <input
                  type="file"
                  name="avatar_image"
                  accept="image/*"
                  onChange={(event) => {
                    setFieldValue("avatar_image", event.currentTarget.files[0]);
                    setIsAvatarUpdated(true); // Mark image as updated
                  }}
                  onBlur={handleBlur}
                  className="  cursor-pointer    bg-gray-100   outline-none opacity-0   w-full"
                />
              </div>
            </div>
            <p className="text-slate-600">Upload Profile Image</p>
          </div>
          <div className="text-center w-full">
            {errors.avatar_image && (
              <p className="text-center px-1 text-sm font-semibold text-red-600">
                {errors.avatar_image}
              </p>
            )}
          </div>
          <div className=" space-y-4">
            <div className="">
              <label htmlFor="job_profession"> Job Title*</label>
              <div
                className={`flex items-center px-2 bg-gray-200   ${
                  errors.job_profession && touched.job_profession
                    ? " border border-red-600"
                    : ""
                }`}
              >
                <BsBriefcase />
                <input
                  type="text"
                  placeholder=" Enter your Job Title (Developer,Teacher,Manager)"
                  name="job_profession"
                  onChange={handleChange}
                  maxLength={35}
                  onKeyDown={validateInuts}
                  onBlur={handleBlur}
                  value={values.job_profession}
                  className="py-3 bg-gray-200  focus:bg-gray-200   px-2 outline-none w-full"
                />
              </div>

              {errors.job_profession && touched.job_profession && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.job_profession}
                </p>
              )}
            </div>

            <div className="w-full  ">
              <div className="flex flex-wrap mt-2">
                {selectedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-gray-300   px-2 py-1 m-1 flex items-center"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(skill)}
                      className="ml-2 text-red-500"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
              <label htmlFor="candidate_professional_skill">
                Professional Skills*
              </label>
              <div
                className={`relative flex items-center bg-gray-200 px-2   ${
                  errors.professional_skill && touched.professional_skill
                    ? " border border-red-600"
                    : ""
                }`}
              >
                <MdOutlineSettings />

                <input
                  type="text"
                  id="candidate_professional_skill"
                  name="candidate_professional_skill"
                  placeholder="Type your skills and hit Enter "
                  className="w-full bg-gray-200 p-3 border"
                  value={inputSkill}
                  maxLength={35}
                  autoComplete={false}
                  onChange={handleSkillInputChange}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                />
                {filteredSkills.length > 0 && (
                  <ul className="absolute bg-white -bottom-32 border h-32 z-[9999] overflow-y-auto border-gray-300 w-full mt-1">
                    {filteredSkills.map((suggestion, index) => (
                      <li
                        key={index}
                        ref={index === focusedIndex ? resultContainer : null}
                        className={`p-2 cursor-pointer hover:bg-slate-200 ${
                          index === focusedIndex ? "bg-gray-200" : ""
                        }`}
                        onMouseDown={() => handleSkillSelect(suggestion)} // Call handleSkillSelect here
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              {errors.professional_skill && touched.professional_skill && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.professional_skill}
                </p>
              )}
            </div>

            <div className="w-full">
              <label htmlFor="job_interest"> Focused Industries*</label>

              <div
                className={`flex items-center px-2 bg-gray-200  ${
                  errors.focused_industries && touched.focused_industries
                    ? " border border-red-600"
                    : ""
                }`}
              >
                <TbWorldHeart />
                <Select
                  isMulti
                  type="text"
                  className="w-full outline-none"
                  placeholder="Enter Your Job Interest"
                  name="job_interest"
                  id="job_interest"
                  onChange={handleSpecialChange}
                  defaultValue={candidate_focused_industries?.map((option) => ({
                    value: option,
                    label: option,
                  }))}
                  options={Specializations?.data?.specializations?.map(
                    (option) => ({
                      value: option,
                      label: option,
                    })
                  )}
                />
              </div>
              {errors.focused_industries && touched.focused_industries && (
                <p className="text-start px-1  text-sm font-semibold text-red-600">
                  {errors.focused_industries}
                </p>
              )}
            </div>

            <div className="">
              <label htmlFor="exp_level"> Years of Experience*</label>

              <div
                className={`w-full flex items-center px-2 pe-5 bg-gray-200  ${
                  errors.professional_skill && touched.professional_skill
                    ? " border border-red-600"
                    : ""
                }`}
              >
                <RiBriefcase4Line />
                <select
                  id="exp_level"
                  name="exp_level"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.exp_level}
                  className="block w-full border p-3 outline-none bg-gray-200   "
                >
                  <option value="" disabled>
                    Years Of Experience
                  </option>
                  <option value="0-1">0-1 year</option>
                  <option value="1-5"> 1-5 years</option>
                  <option value="5-10+"> 5-10+ years</option>
                </select>
              </div>

              {errors.exp_level && touched.exp_level && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.exp_level}
                </p>
              )}
            </div>

            {/* Educatoin  */}
            <div className=""></div>
            <div className="">
              <label htmlFor="about"> About*</label>

              <div
                className={`w-full flex items-start p-2 bg-gray-200    ${
                  errors.about && touched.about ? " border border-red-600" : ""
                }`}
              >
                <BsChatSquareDots className="mt-1" />

                <textarea
                  rows="8"
                  cols="50"
                  type="text"
                  placeholder="Enter your about  "
                  name="about"
                  maxLength={1000}
                  onKeyDown={validateInuts}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.about}
                  className="  bg-gray-200    px-2 outline-none w-full"
                />
              </div>
              {errors.about && touched.about && (
                <p className="text-start px-1 text-sm font-semibold text-red-600">
                  {errors.about}
                </p>
              )}
            </div>

            <div className=" pt-4 text-end flex justify-between">
              <button type="button" onClick={() => navigate(-1)}>
                <FaArrowLeft className="text-gray-400" />
              </button>
              <button
                type="submit"
                className="bg-btn-primary rounded-md text-white px-6 p-2  "
              >
                {isPending ? <MiniLoader /> : "Next"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfessionDetails;
