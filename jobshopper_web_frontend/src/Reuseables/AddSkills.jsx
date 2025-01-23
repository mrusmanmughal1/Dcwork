import { useEffect, useState } from "react";
import { useSkills } from "../Services/General/useSkills";
import toast from "react-hot-toast";

const AddSkills = ({
  setFieldValue,
  errors,
  touched,
  handleBlur,
  resultContainer,
  loadSkills,
  skill,
  validateInuts,
}) => {
  const {
    data: skills,
    isLoading: LoadingSkills,
    isError: SkillsError,
  } = useSkills();
  const skillType = skill;
  const [inputSkill, setInputSkill] = useState("");
  const [filteredSkills, setFilteredSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleSkillInputChange = (event) => {
    const value = event.target.value;
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

  useEffect(() => {
    if (loadSkills && Array.isArray(loadSkills)) {
      setSelectedSkills(loadSkills);
      setFieldValue(skillType ? skillType : "professional_skill", loadSkills); // Update Formik value
    }
  }, [loadSkills, setFieldValue, skillType]);

  const handleSkillSelect = (skill) => {
    if (!selectedSkills.includes(skill)) {
      setSelectedSkills([...selectedSkills, skill]);
      setInputSkill(""); // Clear the input
      setFilteredSkills([]); // Clear suggestions
      setFieldValue(skillType ? skillType : "professional_skill", [
        ...selectedSkills,
        skill,
      ]); // Update Formik value
    } else {
      toast.error("Skill Already Added", { id: "error-toast" });
    }
  };

  const handleTagRemove = (skill) => {
    const updatedSkills = selectedSkills.filter((s) => s !== skill);
    setSelectedSkills(updatedSkills);
    setFieldValue(skillType ? skillType : "professional_skill", updatedSkills); // Update Formik value
  };

  const handleKeyDown = (event) => {
    if (event.key === " " && inputSkill.trim().length === 0) {
      event.preventDefault(); // Prevent space from being typed at the beginning
      return; // Exit early
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
      const isValidInput = /^[a-zA-Z0-9\s]*$/.test(inputSkill);
      const containsLetter = /[a-zA-Z]/.test(inputSkill);

      if (isValidInput && containsLetter) {
        if (focusedIndex >= 0) {
          setInputSkill(filteredSkills[focusedIndex]);
          setFilteredSkills([]);
          setFocusedIndex(-1); // Reset focused index
        } else {
          handleSkillSelect(inputSkill);
        }
      } else {
        toast.error("Input must contain only letters, or aplhanumeric", {
          id: "sasa",
        });
      }
      event.preventDefault(); // Prevent default scrolling
    }
  };
  return (
    <div className="">
      <p>Required Job Skills *</p>

      <div className="w-full  ">
        <div className="flex flex-wrap mt-2">
          {selectedSkills.map((skill, index) => (
            <span
              key={index}
              className="bg-gray-300 rounded-sm px-2 py-1 m-1 flex items-center"
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

        <div
          className={`relative flex items-center bg-gray-200 px-2 ${
            errors.job_skill && touched.job_skill
              ? " border border-red-600"
              : ""
          }`}
        >
          <input
            type="text"
            id={skillType ? skillType : "candidate_professional_skill"}
            name={skillType ? skillType : "candidate_professional_skill"}
            placeholder="Enter your skills"
            className="w-full bg-gray-200 p-3 border outline-none"
            value={inputSkill}
            maxLength={30}
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
        <div className="">
          {errors.job_skill && touched.job_skill && (
            <p className="text-start px-1 text-sm font-semibold text-red-600">
              {errors.job_skill}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddSkills;
