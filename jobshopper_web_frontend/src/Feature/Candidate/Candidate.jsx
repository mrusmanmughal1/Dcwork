import { NavLink, useLocation, useNavigate } from "react-router-dom";
import CandidateProfile from "../../UI/CandidateProfile";
import FeaturedJobs from "../../UI/FeaturedJobs";
import ImageBanner from "../../UI/ImageBanner";
import SearchFilter from "../../UI/SearchFilter";
import Loader from "../../UI/Loader";
import ErrorMsg from "../../UI/ErrorMsg";
import { useEffect, useMemo, useRef, useState } from "react";
import { useUserinfo } from "../../Context/AuthContext";
import { EMPLOYER } from "../../utils/Constants";
import { useSearchCandidates } from "../../Services/Employer/useSearchCandidates";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { IoIosArrowRoundBack, IoIosArrowRoundForward } from "react-icons/io";
import {
  useAutoCountrycandidate,
  useAutoSugestionCandidate,
} from "../../Services/General/useAutoSugestionCandidate";
import { useDebounce } from "use-debounce";
import { ImLocation } from "react-icons/im";
const Candidate = () => {
  const navigate = useNavigate();
  const { auth, user_type } = useUserinfo();

  useEffect(() => {
    if (!auth) {
      navigate("/login");
    }
  }, [auth, navigate]);

  if (user_type === EMPLOYER) {
    return <Candidates />;
  } else {
    navigate("/");
  }
};

export default Candidate;

export const Candidates = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [searched, setSearch] = useState([]);
  const [exp, setexp] = useState([]);
  const [last_activity, setlast_activity] = useState([]);
  const [count, setcount] = useState(0);
  const [showSuggestions, setShowSuggestions] = useState({
    title: false,
    location: false,
  });

  useEffect(() => {
    // Combine query parameters in a single object
    queryParams.set("focused_industries", searched.toString());
    queryParams.set("last_activity", last_activity.toString());
    queryParams.set("experience_level", exp.toString());

    // Navigate after all query params have been updated
    navigate(`/candidates?${queryParams.toString()}`);
  }, [searched, last_activity , exp]);
  const [debouncedKeyword] = useDebounce(keyword, 300);
  const [debouncedLocation] = useDebounce(location, 300);
  const { data: titleSuggestions } =
    useAutoSugestionCandidate(debouncedKeyword);
  const { data: locationSuggestions } =
    useAutoCountrycandidate(debouncedLocation);

  const locations = useLocation();
  const navigate = useNavigate();
  const locationInputRef = useRef(null);
  const titleInputRef = useRef(null);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [selectedSuggestionIndexLocation, setSelectedSuggestionIndexLocation] =
    useState(-1);

  const queryParams = useMemo(
    () => new URLSearchParams(locations.search),
    [locations.search]
  );
  const {
    data: searchedData,
    isLoading: searchLoading,
    isError: loadError,
    handleNextPage,
    handlePreviousPage,
    localPage,
  } = useSearchCandidates(count);

  useEffect(() => {
    const candidateNames = queryParams.get("keywords") || "";
    const locationParam = queryParams.get("location") || "";
    setKeyword(candidateNames);
    setLocation(locationParam);
  }, [queryParams]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (value.startsWith(" ")) {
      return; // Prevent further processing if space is at the beginning
    }
    if (name === "keyword") {
      setKeyword(value);
      setShowSuggestions((prev) => ({ ...prev, title: true }));
      setSelectedSuggestionIndex(-1);

      // Reset query parameters if the value is empty
      if (value === "") {
        queryParams.set("keywords", e.target.value);
        navigate(`/candidates?${queryParams} `);
      }
    } else if (name === "locations") {
      setLocation(value);
      setShowSuggestions((prev) => ({ ...prev, location: true }));
      setSelectedSuggestionIndexLocation(-1);

      // Reset query parameters if the value is empty
      if (value === "") {
        queryParams.set("location", e.target.value);
        navigate(`/candidates?${queryParams} `);
      }
    }
  };

  const handleSearch = () => {
    setShowSuggestions((prev) => ({ location: false, title: false }));
    if (keyword.trim() === "" && location.trim() === "") {
      toast.error("Please enter a keyword or location", { id: "toast" });
      return;
    }
    queryParams.set("keywords", keyword);
    queryParams.set("location", location);
    navigate(`/candidates?${queryParams}`);
  };

  const handleKeyDown = (e) => {
    const suggestions = titleSuggestions?.data?.suggestions || [];

    if (e.key === "ArrowDown") {
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      const selectedSuggestion = suggestions[selectedSuggestionIndex];
      const titleToSet = selectedSuggestion || keyword;
      if (titleToSet) {
        setKeyword(titleToSet);
        handleSearch();
      }
      setShowSuggestions((prev) => ({ ...prev, title: false }));
      setSelectedSuggestionIndex(-1);
      locationInputRef.current.focus();
      setTimeout(
        () =>
          titleInputRef.current.setSelectionRange(
            titleToSet.length,
            titleToSet.length
          ),
        0
      );
    }
  };

  const handleKeyDownLocation = (e) => {
    const suggestions = locationSuggestions?.data?.suggestions || [];

    if (e.key === "ArrowDown") {
      setSelectedSuggestionIndexLocation((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      setSelectedSuggestionIndexLocation((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      const selectedLocation = suggestions[selectedSuggestionIndexLocation];
      const locationToSet = selectedLocation || location;
      if (locationToSet) {
        setLocation(locationToSet);
        queryParams.set("location", locationToSet);
        handleSearch();
      }
      setShowSuggestions((prev) => ({ ...prev, location: false }));
      setSelectedSuggestionIndexLocation(-1);
      setTimeout(
        () =>
          locationInputRef.current.setSelectionRange(
            locationToSet.length,
            locationToSet.length
          ),
        0
      );
    }
  };

  const handleSuggestionSelect = (selectedSuggestion) => {
    setKeyword(selectedSuggestion);
    setShowSuggestions((prev) => ({ ...prev, title: false }));

    queryParams.set("keywords", selectedSuggestion);
    setcount((res) => res + 1);
    navigate(`/candidates?${queryParams} `);
  };

  const handleLocationSelect = (selectedLocation) => {
    setLocation(selectedLocation);
    setShowSuggestions((prev) => ({ ...prev, location: false }));

    queryParams.set("location", selectedLocation);
    navigate(`/candidates?${queryParams} `);
  };

  return (
    <div className="bg-purple-50">
      <ImageBanner text="Candidates List" />
      <div className="flex flex-col pb-20 lg:flex-row gap-10 mt-16 w-11/12 mx-auto">
        <div className="w-full lg:w-[25%] order-2 lg:order-none">
          <SearchFilter
          last_activity={last_activity}
          setexp={setexp}
          exp={exp}
            setlast_activity={setlast_activity}
            setSearch={setSearch}
          />
          {/* <FeaturedJobs /> */}
        </div>

        <div className="w-full lg:w-[75%]">
          <div className="flex-col md:flex sm:flex-row py-3 px-3   md:gap-4 bg-blurr-bg">
            <div className="text-sm w-full">
              <p className="text-white">Candidates</p>
              <div className="">
                <div className="flex items-center rounded-md bg-white px-2 relative">
                  <FaSearch className="text-btn-primary" />
                  <input
                    type="search"
                    autoComplete="off"
                    value={keyword}
                    onKeyDown={handleKeyDown}
                    name="keyword"
                    onChange={handleChange}
                    className="p-4 outline-none w-full rounded-md"
                    placeholder="Name / profession / keyword"
                    ref={titleInputRef}
                    maxLength={50}
                  />
                </div>
              </div>
              <div className="relative">
                {showSuggestions.title &&
                  titleSuggestions?.data?.suggestions?.length > 0 && (
                    <div className="absolute min-h-10 max-h-52 overflow-y-auto top-3 w-72 p-2 ps-4 z-[99] bg-white shadow-2xl rounded-md py-6">
                      {titleSuggestions.data.suggestions.map((val, index) => (
                        <div
                          key={val}
                          onClick={() => handleSuggestionSelect(val)}
                          className={`flex items-center cursor-pointer text-base gap-3 py-2 max-h-20 ${
                            index === selectedSuggestionIndex
                              ? "bg-slate-200"
                              : "hover:bg-slate-100"
                          }`}
                        >
                          <FaSearch />
                          <p className="text-left capitalize">{val}</p>
                        </div>
                      ))}
                    </div>
                  )}
              </div>
            </div>

            <div className="text-sm w-full">
              <p className="text-white">Where</p>
              <div className="">
                <div className="flex items-center rounded-md bg-white px-2 relative">
                  <ImLocation className="text-btn-primary text-base" />
                  <input
                    type="search"
                    value={location}
                    autoComplete="off"
                    onKeyDown={handleKeyDownLocation}
                    name="locations"
                    ref={locationInputRef}
                    onChange={handleChange}
                    className="p-[1rem] outline-none rounded-md   px-4 w-full"
                    placeholder="Location"
                    maxLength={50}
                  />
                </div>
              </div>
              <div className="relative">
                {showSuggestions.location &&
                  locationSuggestions?.data?.suggestions?.length > 0 && (
                    <div className="absolute top-3 w-72 p-2 ps-4 opacity-95 bg-white shadow-2xl rounded-md py-6 z-[99]">
                      {locationSuggestions.data.suggestions.map(
                        (val, index) => (
                          <div
                            key={val}
                            onClick={() => handleLocationSelect(val)}
                            className={`flex items-center cursor-pointer text-base gap-3 py-2 max-h-20 ${
                              index === selectedSuggestionIndexLocation
                                ? "bg-slate-200"
                                : "hover:bg-slate-100"
                            }`}
                          >
                            <FaSearch />
                            <p className="text-left capitalize">{val}</p>
                          </div>
                        )
                      )}
                    </div>
                  )}
              </div>
            </div>

            <div className="flex    flex-col  items-center">
              <div className="py-2"></div>
              <button
                onClick={handleSearch}
                disabled={keyword === "" && location === ""}
                className="px-10 text-sm rounded-md font-bold text-white disabled:cursor-not-allowed py-4   bg-[#4e007a]"
              >
                Search
              </button>
            </div>
          </div>

          <div className="flex items-center w-full justify-between pt-4">
            <p className="font-semibold text-sm">
              Total Candidates Available ({searchedData?.data?.count})
            </p>
            <div className="flex gap-1">
              <button
                onClick={handlePreviousPage}
                disabled={!searchedData?.data?.previous}
                className="bg-slate-200 px-1 disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
              >
                <IoIosArrowRoundBack />
              </button>
              {localPage}
              <button
                onClick={handleNextPage}
                disabled={!searchedData?.data?.next}
                className="bg-slate-200 px-1 disabled:bg-slate-200 disabled:cursor-not-allowed hover:bg-btn-primary hover:text-white hover:cursor-pointer"
              >
                <IoIosArrowRoundForward />
              </button>
            </div>
          </div>

          {searchLoading ? (
            <Loader style="pt-20" />
          ) : searchedData?.data?.results?.length === 0 ? (
            <ErrorMsg ErrorMsg={"Sorry! No Record Found"} />
          ) : (
            searchedData?.data?.results?.map((val, i) => (
              <div key={i} className="w-full pt-5">
                <NavLink
                  to={`Candidate-Details/${val?.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <CandidateProfile candidateData={val} />
                </NavLink>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
