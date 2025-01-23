import { FaSearch } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAutoCountry,
  useAutoSuggestion,
} from "../Services/General/useAutoSuggestion";
import { useDebounce } from "use-debounce";
import { ImLocation } from "react-icons/im";
const MainSearchBox = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [isRemote, setIsRemote] = useState("");
  const [show, setshow] = useState({
    ShowtitleSuggestions: false,
    ShowLocationsSuggestions: false,
  });
  const { ShowtitleSuggestions, ShowLocationsSuggestions } = show;
  const locationPath = useLocation();
  const navigate = useNavigate();
  const [debouncedTitle] = useDebounce(title, 100);
  const [debouncedLocation] = useDebounce(location, 100);
  const { data, isLoading: loadTitle } = useAutoSuggestion(debouncedTitle);
  const { data: country, isLoading: loadcountry } =
    useAutoCountry(debouncedLocation);

  const locations = useLocation();
  const locationInputRef = useRef(null);
  const titleInputRef = useRef(null);

  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [selectedSuggestionIndexLocation, setSelectedSuggestionIndexLocation] =
    useState(-1);

  const queryParams = useMemo(
    () => new URLSearchParams(locations.search),
    [locations.search]
  );
  const isHomeRoute = locationPath.pathname === "/";
  const titlevalue = queryParams.get("title") || "";
  const locationParam = queryParams.get("location") || "";
  const isRemotevalue = queryParams.get("isRemote") == "true";
  const handleChange = (e) => {
    const suggestions = data?.data?.suggestions || [];
    const suggestionsCountry = country?.data?.suggestions || [];
    const { name, value } = e.target;

    if (/^[\W_]/.test(value)) {
      e.preventDefault(); // Prevent further input if it starts with a space, special character, or number
      return; // Don't allow this input to proceed
    }
    if (name === "title") {
      setTitle(value);
      setshow({
        ShowtitleSuggestions: true,
      });
      if (suggestions) {
        setSelectedSuggestionIndex(-1);
      }
      // Trigger API call with empty title when cleared
      if (value === "" && !isHomeRoute) {
        navigate(`/jobs?title=&location=${location}&isRemote=${isRemote}`);
      }
    } else if (name === "locations") {
      setLocation(value);

      setshow({
        ShowLocationsSuggestions: true,
      });
      if (value === "" && !isHomeRoute) {
        navigate(`/jobs?title=${title}&location=&isRemote=${isRemote}`);
      }
      if (suggestionsCountry.length > 0) {
        setSelectedSuggestionIndexLocation(-1);
      }
    }
  };

  const handleRemoteChange = (e) => {
    setIsRemote(e.target.checked);
    const queryParams = new URLSearchParams(locations.search);
    queryParams.set("isRemote", e.target.checked);

    if (!isHomeRoute) {
      navigate(`/jobs?${queryParams}`);
    }
  };

  const handleSearch = () => {
    const params = {};

    if (title) {
      params.title = title;
    }

    if (location) {
      params.location = location;
    }

    if (isRemote) {
      params.isRemote = isRemote;
    }
    // Construct query parameters
    const queryParams = new URLSearchParams(params).toString();

    // Redirect to jobs page with query params
    navigate(`/jobs?${queryParams}`);
  };

  // Set isVisible to true when the component mounts
  useEffect(() => {
    // Set state based on URL parameters
    if (titlevalue) {
      setTitle(titlevalue);
    }
    if (locationParam) {
      setLocation(locationParam);
    }
    if (isRemotevalue !== undefined) {
      setIsRemote(isRemotevalue);
    }
  }, [titlevalue, locationParam]);

  const handleKeyDown = (e) => {
    const suggestions = data?.data?.suggestions || [];

    if (e.key === "ArrowDown") {
      // Navigate down in the suggestion list
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      // Navigate up in the suggestion list
      setSelectedSuggestionIndex((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      // Select highlighted suggestion on Enter

      const selectedSuggestion = suggestions[selectedSuggestionIndex];
      const titleToSet = selectedSuggestion || title;

      if (titleToSet) {
        const locationToSetLower = titleToSet.toLowerCase();

        setTitle(titleToSet);
        // Navigate to jobs with selected title and location
        const queryParams = new URLSearchParams({
          title: locationToSetLower,
          location,
        }).toString();
        navigate(`/jobs?${queryParams}`);
      }
      // Set the title and navigate only if there’s a valid value

      // Hide suggestions and reset the selected index
      setshow({ ShowtitleSuggestions: false });
      setSelectedSuggestionIndex(-1); // Reset selected index

      if (suggestions[selectedSuggestionIndex]) {
        const queryParams = new URLSearchParams({
          title: suggestions[selectedSuggestionIndex],
          location,
        }).toString();
        navigate(`/jobs?${queryParams}`);
      } else {
        const queryParams = new URLSearchParams({
          title: title,
          location,
        }).toString();
        navigate(`/jobs?${queryParams}`);
      }
    }
  };
  const handleKeyDownLocation = (e) => {
    const suggestions = country?.data?.suggestions || [];
    // if (suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      // Navigate down in the suggestion list
      setSelectedSuggestionIndexLocation((prevIndex) =>
        prevIndex < suggestions.length - 1 ? prevIndex + 1 : 0
      );
    } else if (e.key === "ArrowUp") {
      // Navigate up in the suggestion list
      setSelectedSuggestionIndexLocation((prevIndex) =>
        prevIndex > 0 ? prevIndex - 1 : suggestions.length - 1
      );
    } else if (e.key === "Enter") {
      const selectedLocation = suggestions[selectedSuggestionIndexLocation];
      const locationToSet = selectedLocation || location;
      const locationToSetLower = locationToSet.toLowerCase();

      // Set location and navigate only if there’s a valid value
      if (locationToSet) {
        setLocation(locationToSet);
        setLocation(suggestions[selectedSuggestionIndexLocation]);
        // Construct query params for navigation
        const queryParams = new URLSearchParams({
          location: locationToSetLower,
          title,
          isRemote,
        }).toString();
        navigate(`/jobs?${queryParams}`);
      }
      setshow({ ShowtitleSuggestions: false });
      setSelectedSuggestionIndexLocation(-1);

      if (suggestions[selectedSuggestionIndexLocation]) {
        const queryParams = new URLSearchParams({
          location: suggestions[selectedSuggestionIndexLocation],
          title,
          isRemote,
        }).toString();
        navigate(`/jobs?${queryParams}`);
      } else {
        const queryParams = new URLSearchParams({
          location: location,
          isRemote,
          title,
        }).toString();
        navigate(`/jobs?${queryParams}`);
      }
    }
  };

  // job location suggestion
  const handlelocationselectedSuggestions = (selectLocationSuggestion) => {
    // Construct query parameters only if the values are truthy
    const params = {};

    if (title) {
      params.title = title; // Include title only if it has a truthy value
    }

    if (isRemote) {
      params.isRemote = isRemote; // Include isRemote only if it has a truthy value
    }

    if (selectLocationSuggestion) {
      params.location = selectLocationSuggestion; // Include location only if it has a truthy value
    }

    // Convert the params object into query string using URLSearchParams
    const queryParams = new URLSearchParams(params).toString();

    // Redirect to jobs page with the filtered query params
    navigate(`/jobs?${queryParams}`);
  };

  // job title suggestion
  const handleSuggestionSelect = (selectedSuggestion) => {
    setTitle(selectedSuggestion);
    if (titleInputRef.current) {
      titleInputRef.current.value = selectedSuggestion;
      titleInputRef.current.dispatchEvent(new Event("input"));
    }
    setshow({ ShowtitleSuggestions: false });
    locationInputRef.current.focus(); // Move focus to location input
    setTimeout(
      () =>
        titleInputRef?.current?.setSelectionRange(
          selectedSuggestion.length,
          selectedSuggestion.length
        ),
      0
    ); // Set cursor at end of text

    const lowselect = selectedSuggestion.toLowerCase();

    const params = {};

    if (lowselect) {
      params.title = lowselect; // Include title only if it has a truthy value
    }

    if (location) {
      params.location = location; // Include location only if it has a truthy value
    }

    if (isRemote) {
      params.isRemote = isRemote; // Include isRemote only if it has a truthy value
    }

    // Convert the params object into query string using URLSearchParams
    const queryParams = new URLSearchParams(params).toString();

    // Redirect to jobs page with the filtered query params
    navigate(`/jobs?${queryParams}`);
  };
  return (
    <div
      className={`flex-col md:flex sm:flex-row py-3 px-3   md:gap-4 bg-blurr-bg  top-0 `}
    >
      <div className="text-sm w-full">
        <p className="text-white"> Job Title </p>
        <div className={`flex items-center rounded-md bg-white px-2 relative `}>
          <FaSearch className="text-btn-primary" />
          <input
            type="search"
            autoComplete="off"
            value={title}
            onKeyDown={handleKeyDown}
            name="title"
            onChange={(e) => handleChange(e)}
            className={`p-4   outline-none w-full rounded-md `}
            placeholder=" Enter Job Title"
            ref={titleInputRef}
            maxLength={50}
          />
        </div>

        <div className="relative">
          {data?.data?.suggestions?.length > 0 && ShowtitleSuggestions && (
            <div className="absolute   min-h-10 max-h-52   overflow-y-auto   md:top-3 md:w-72 p-2 ps-4  z-[99] bg-white shadow-2xl rounded-md py-6">
              <div className="relative">
                {data?.data?.suggestions.length > 0 && !loadTitle ? (
                  data.data.suggestions.map((val, index) => (
                    <div
                      className="flex items-center gap-2 hover:bg-slate-100 capitalize "
                      key={val}
                    >
                      <div
                        onClick={() => handleSuggestionSelect(val)}
                        className={`flex items-center cursor-pointer text-base gap-3 py-2 max-h-20 ${
                          index === selectedSuggestionIndex
                            ? "bg-slate-200"
                            : "hover:bg-slate-100"
                        }`}
                      >
                        <div className="">
                          <FaSearch />
                        </div>
                        <p className="text-left ">{val}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <></>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* locations  */}
      <div className="text-sm w-full">
        <p className="text-white">Where</p>
        <div className="flex items-center rounded-md bg-white px-2 relative">
          <ImLocation className="text-btn-primary text-base" />
          <input
            type="search"
            value={location}
            autoComplete="off"
            onKeyDown={handleKeyDownLocation}
            name="locations"
            ref={locationInputRef}
            onChange={(e) => handleChange(e)}
            className="p-[1rem] outline-none rounded-md   px-4 w-full"
            placeholder="Location"
            maxLength={50}
          />
        </div>

        <div className="relative">
          {country?.data?.suggestions?.length > 0 &&
            ShowLocationsSuggestions && (
              <div className="absolute  md:top-3 md:w-72 w-full p-2 ps-4 opacity-95 bg-white shadow-2xl rounded-md py-6  z-[99]">
                <div>
                  {country?.data?.suggestions?.length > 0 &&
                    !loadcountry &&
                    country.data.suggestions.map((val, index) => (
                      <div
                        key={val}
                        onClick={() => {
                          setLocation(val);
                          setshow({
                            ShowLocationsSuggestions: false,
                          });
                          handlelocationselectedSuggestions(val);
                        }}
                        className={`flex items-center cursor-pointer text-base gap-3 py-2 max-h-20 ${
                          index === selectedSuggestionIndexLocation
                            ? "bg-slate-200"
                            : "hover:bg-slate-100"
                        }`}
                      >
                        <div className="">
                          <FaSearch />
                        </div>
                        <p className="text-left capitalize">{val}</p>
                      </div>
                    ))}
                </div>
              </div>
            )}
        </div>
      </div>
      <div className=" flex flex-col sm:gap-0   gap-4">
        <div className="flex gap-1  items-center mt-2 sm:mt-0 ">
          <input
            type="checkbox"
            className="text-black"
            name="isRemote"
            id="isRemote"
            checked={isRemote}
            onChange={(e) => handleRemoteChange(e)}
          />
          <label htmlFor="isRemote" className="text-sm text-white">
            Remote Only
          </label>
        </div>
        <button
          onClick={() => handleSearch()}
          disabled={title == "" && location == "" && !isRemote}
          className="px-10 text-sm rounded-md font-bold text-white disabled:cursor-not-allowed py-4 bg-[#4e007a] "
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default MainSearchBox;
