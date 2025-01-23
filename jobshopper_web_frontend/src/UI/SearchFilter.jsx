import { TiArrowSortedUp } from "react-icons/ti";
import { useSpecialization } from "../Services/General/useSpecialization";
import Loader from "./Loader";
import ErrorMsg from "./ErrorMsg";
import MiniLoader from "./MiniLoader";
const SearchFilter = ({
  setexp,
  setlast_activity,
  setSearch,
  searched,
  last_activity: last,
  exp: experience,
}) => {
  const { data: Specialization, isLoading, isError } = useSpecialization();
  if (isLoading) return <Loader style="py-40" />;
  if (isError)
    return (
      <ErrorMsg ErrorMsg="Unable To fetch Data Right Now !  Please try again!" />
    );
  const Last_Activity = [
    "30_days",
    "7_days",
    "24_hours",
    "12_hours",
    "6_hours",
  ];

  const exp = ["0-1", "1-5", "5-10+"];

  const handleChange = (event) => {
    const {
      target: { value, checked, name },
    } = event;
    if (name === "job_interest") {
      if (checked) {
        setSearch((prev) => [...prev, value]); // Add to searched
      } else {
        setSearch((prev) => prev.filter((item) => item !== value)); // Remove from searched
      }
    }

    if (name === "last_activity") {
      if (checked) {
        setlast_activity([value]); // Add to searched
      }
    }
    if (name === "experience_level") {
      if (checked) {
        setexp([value]); // Add to searched
      } else {
        setexp((prev) => prev.filter((item) => item !== value)); // Remove from searched
      }
    }
  };
  if (isLoading)
    return (
      <div className="">
        <MiniLoader />
      </div>
    );
  return (
    <div className="  shadow-lg shadow-slate-350 mb-4 py-2 bg-white rounded-sm">
      <div className="    text-black border-b">
        <div className="relative w-full    overflow-hidden">
          <input
            type="checkbox"
            className=" peer absolute top-0 inset-x-0 w-full h-12 opacity-0 z-10 cursor-pointer"
          />
          <div className="bg-white h-12 w-full pl-5 flex items-center">
            <h1 className="text-lg  font-semibold uppercase  text-btn-primary">
              Focus Industries
            </h1>
          </div>
          <div className=" absolute  top-3 right-3 text-white transition-transform duration-500 rotate-180 peer-checked:rotate-90 ">
            <TiArrowSortedUp className="text-btn-primary" />
          </div>
          <div className=" bg-white overflow-hidden transition-all duration-700 text-xs  max-h-max peer-checked:max-h-0   ">
            {Specialization?.data?.specializations?.map((val, i) => {
              return (
                <div key={val + i} className="px-4 py-2 flex gap-2 ">
                  <input
                    type="checkbox"
                    id={val}
                    name="job_interest"
                    onChange={handleChange}
                    className="bg-slate-500 hover:cursor-pointer"
                    value={val}
                    checked={searched?.includes(val)}
                  />
                  <label htmlFor={val}>{val}</label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* experience  */}

      <div className=" text-black border-b">
        <div className="relative w-full overflow-hidden">
          <input
            type="checkbox"
            className=" peer absolute top-0 inset-x-0 w-full h-12 opacity-0 z-10 cursor-pointer"
          />
          <div className="bg-white h-12 w-full pl-5 flex items-center">
            <h1 className="text-lg  font-semibold  text-btn-primary">
              EXPERIENCE
            </h1>
          </div>
          <div className=" absolute  top-3 right-3 text-white transition-transform duration-500 rotate-90 peer-checked:rotate-180 ">
            <TiArrowSortedUp className="text-btn-primary" />
          </div>
          <div className=" bg-white overflow-hidden text-xs transition-all duration-500  max-h-0 peer-checked:max-h-40    ">
            {exp.map((val, i) => {
              return (
                <div key={i} className="px-4 py-2 flex gap-4 ">
                  <input
                    type="checkbox"
                    id={val}
                    name="experience_level"
                    onChange={handleChange}
                    className="bg-slate-500 hover:cursor-pointer"
                    value={val}
                    checked={experience?.includes(val)}
                  />
                  <label htmlFor={val}>
                    {" "}
                    ({val.replace(/_/g, " ")} ) Years
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* last activity  */}
      <div className=" text-black">
        <div className="relative w-full overflow-hidden">
          <input
            type="checkbox"
            className=" peer absolute top-0 inset-x-0 w-full h-12 opacity-0 z-10 cursor-pointer"
          />
          <div className="bg-white h-12 w-full pl-5 flex items-center">
            <h1 className="text-lg  font-semibold  text-btn-primary">
              LAST ACTIVITY
            </h1>
          </div>
          <div className=" absolute  top-3 right-3 text-white transition-transform duration-500 rotate-90 peer-checked:rotate-180 ">
            <TiArrowSortedUp className="text-btn-primary" />
          </div>
          <div className=" bg-white overflow-hidden text-xs transition-all duration-500  max-h-0 peer-checked:max-h-40    ">
            {Last_Activity.map((val, i) => {
              return (
                <div key={i} className="px-4 py-2 flex gap-4 ">
                  <input
                    type="checkbox"
                    id={val}
                    name="last_activity"
                    onChange={handleChange}
                    className="bg-slate-500 hover:cursor-pointer"
                    value={val}
                    checked={last?.includes(val)}
                  />
                  <label htmlFor={val}>
                    Last {val.replace(/_/g, " ")} Activity
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
