import { useEffect, useMemo, useState } from "react";
import ScrollToTop from "../Reuseables/ScrollToTop";
import { useSpecializationSkills } from "../Services/General/useSpecializationSkills";
import PriceFilter from "./RangeFilter";

const JobType = ({
  setsearch,
  posted_in_last,
  alljobs,
  searched,
  handleChange,
}) => {
  const { data: industries, isLoading } = useSpecializationSkills();

  const { specializations } = industries?.data || {};
  const [showAllIndustries, setShowAllIndustries] = useState(false);
  const { contract_type } = searched;
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [searched]);
  const handleContractChange = (e) => {
    const { id, checked } = e.target;

    setsearch((prevState) => {
      const currentContractTypes = Array.isArray(prevState.contract_type)
        ? prevState.contract_type
        : [];
      const updatedContractTypes = checked
        ? [...currentContractTypes, id] // Add contract type if checked
        : currentContractTypes.filter((type) => type !== id); // Remove if unchecked
      return {
        ...prevState,
        contract_type: updatedContractTypes, // Update the contract_type array
      };
    });
  };
  return (
    <div className="pb-10">
      <ScrollToTop />

      <div className="">
        <p className="text-purple-900 font-semibold uppercase  ">Work Mode</p>

        <div className="pb-2">
          <div className="flex gap-6 pt-1">
            <div className="">
              <input
                type="checkbox"
                id="hybrid"
                name="work_type"
                value="hybrid"
                checked={searched.work_type?.includes("hybrid")}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label
                htmlFor="hybrid"
                name="work_type"
                className="text-purple-900"
              >
                Hybrid
              </label>
            </div>
          </div>
          <div className="flex gap-6 pt-1">
            <div className="">
              <input
                type="checkbox"
                value="onsite"
                id="onsite"
                name="work_type"
                checked={searched.work_type?.includes("onsite")}
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label
                htmlFor="onsite"
                name="work_type"
                className="text-purple-900"
              >
                On Site
              </label>
            </div>
          </div>
          <div className="flex gap-6 pt-1">
            <div className="">
              <input
                type="checkbox"
                name="work_type"
                value="remote"
                checked={searched.work_type?.includes("remote")}
                id="remote"
                onChange={handleChange}
              />
            </div>
            <div className="">
              <label
                htmlFor="remote"
                name="work_type"
                className="text-purple-900"
              >
                Remote
              </label>
            </div>
          </div>
        </div>
        <hr />
      </div>
      <p className="text-purple-900 font-semibold uppercase  py-2 ">
        Employment Type
      </p>
      <div className="pb-2 text-black">
        <div className="flex gap-6 pt-1">
          <div className="">
            <input
              type="checkbox"
              id="Contract"
              value="Contract"
              name="work_type"
              checked={contract_type.toString()?.includes("Contract")}
              onChange={handleContractChange}
            />
          </div>
          <div className="">
            <label htmlFor="Contract" name="a" className="text-purple-900">
              Contract ({alljobs?.data?.searched_contract_type_counts?.Contract}
              )
            </label>
          </div>
        </div>
        <div className="flex gap-6 ">
          <div className="">
            <input
              type="checkbox"
              id="Full_Time"
              value="Full_Time"
              name="work_type"
              checked={contract_type.toString()?.includes("Full_Time")}
              onChange={handleContractChange}
            />
          </div>
          <div className="">
            <label htmlFor="Full_Time" className="text-purple-900">
              Full Time (
              {alljobs?.data?.searched_contract_type_counts?.Full_Time})
            </label>
          </div>
        </div>
        <div className="flex gap-6 ">
          <input
            type="checkbox"
            id="Internship"
            value="Internship"
            name="work_type"
            checked={contract_type.toString()?.includes("Internship")}
            onChange={handleContractChange}
          />

          <label htmlFor="Internship" name="a" className="text-purple-900">
            Internship (
            {alljobs?.data?.searched_contract_type_counts?.Internship})
          </label>
        </div>
        <div className="flex gap-6 ">
          <input
            type="checkbox"
            id="Part_Time"
            value="Part_Time"
            name="work_type"
            checked={contract_type.toString()?.includes("Part_Time")}
            onChange={handleContractChange}
          />

          <label htmlFor="Part_Time" className="text-purple-900">
            Part Time ({alljobs?.data?.searched_contract_type_counts?.Part_Time}
            )
          </label>
        </div>
      </div>
      <hr />

      <hr />
      <div className="py-3">
        <p className="text-purple-900 font-semibold  pb-1  ">POSTED DATE</p>
        <div className="text-btn-primary space-y-2 cursor-pointer flex flex-col items-start">
          <button
            className={`${
              posted_in_last == "0" && `border-l-purple-950`
            } border-l-4 ps-3`}
            onClick={() =>
              setsearch((prev) => ({ ...prev, posted_in_last: "0" }))
            }
          >
            Today
          </button>
          <button
            className={`${
              posted_in_last == 7 && `border-l-purple-950 cursor-pointer`
            } border-l-4 ps-3`}
            onClick={() =>
              setsearch((prev) => ({ ...prev, posted_in_last: 7 }))
            }
          >
            7 Days Ago
          </button>
          <button
            className={`${
              posted_in_last == 10 && `border-l-purple-950 cursor-pointer`
            } border-l-4 ps-3`}
            onClick={() =>
              setsearch((prev) => ({ ...prev, posted_in_last: 10 }))
            }
          >
            10 Days Ago
          </button>
          <button
            className={`${
              posted_in_last == " " && `border-l-purple-950 cursor-pointer`
            } border-l-4 ps-3`}
            onClick={() =>
              setsearch((prev) => ({ ...prev, posted_in_last: " " }))
            }
          >
            All
          </button>
        </div>
      </div>
      <hr />
      <div className="py-3">
        <p className="text-purple-900 font-semibold  pb-1  uppercase ">
          Industries{" "}
        </p>

        {/* map industries */}
        <div className="text-black">
          {!isLoading && specializations.length > 0 ? (
            <>
              {specializations
                .slice(0, showAllIndustries ? specializations.length : 5)
                .map((industry, index) => (
                  <div key={index} className="flex gap-6 pt-1">
                    <div className="">
                      <input
                        type="checkbox"
                        id={`focused_industries-${index}`}
                        onChange={handleChange}
                        name={`focused_industries${industry}`}
                        value={industry}
                      />
                    </div>
                    <div className="">
                      <label
                        htmlFor={`focused_industries-${index}`}
                        className="text-purple-900"
                      >
                        {industry}
                      </label>
                    </div>
                  </div>
                ))}
              {specializations.length > 5 && (
                <button
                  className="text-btn-primary cursor-pointer py-2"
                  onClick={() => setShowAllIndustries(!showAllIndustries)} // Toggle between show all and show less
                >
                  {showAllIndustries ? "Show Less" : "View More"}
                </button>
              )}
            </>
          ) : (
            <p>No industries available.</p>
          )}
        </div>
        <hr />
        <div className="">
          <PriceFilter setsearch={setsearch} />
        </div>
      </div>
    </div>
  );
};

export default JobType;
