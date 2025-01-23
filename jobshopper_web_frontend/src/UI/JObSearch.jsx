import { FaSearch } from "react-icons/fa";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  useAutoCountry,
  useAutoSuggestion,
} from "../Services/General/useAutoSuggestion";
import { useDebounce } from "use-debounce";
import { ImLocation } from "react-icons/im";

const JObSearch = ({ searched, setsearch }) => {
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
      e.preventDefault();
      return;
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
        setsearch((val) => ({ ...val, title: "" }));
        const params = {};
        params.title = "";
        if (location) params.location = location;
        if (isRemote) params.isRemote = isRemote;

        const queryParams = new URLSearchParams(params).toString();

        navigate(`/jobs?${queryParams}`);
      }
    } else if (name === "locations") {
      setLocation(value);

      setshow({
        ShowLocationsSuggestions: true,
      });

      if (suggestionsCountry) {
        setSelectedSuggestionIndexLocation(-1);
      }
      if (value === "" && !isHomeRoute) {
        setsearch((val) => ({ ...val, location: "" }));

        const params = {};
        if (title) params.title = title;
        params.location = "";
        if (isRemote) params.isRemote = isRemote;

        const queryParams = new URLSearchParams(params).toString();

        navigate(`/jobs?${queryParams}`);
      }
    }
  };

  const handleRemoteChange = (e) => {
    setIsRemote(e.target.checked);
    setsearch((val) => ({ ...val, isRemote: e.target.checked }));
  };

  const handleSearch = () => {
    setshow({ ShowtitleSuggestions: false, ShowLocationsSuggestions: false });

    setsearch((val) => ({ ...val, title, location, isRemote }));
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
  }, [titlevalue, locationParam, isRemotevalue]);

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
        setTitle(titleToSet);

        setsearch((val) => ({ ...val, title: titleToSet }));

        navigate(`/jobs?${queryParams}`);
      }

      setshow({ ShowtitleSuggestions: false });
      setSelectedSuggestionIndex(-1); // Reset selected index
      locationInputRef.current.focus();
      setTimeout(
        () =>
          titleInputRef.current.setSelectionRange(title.length, title.length),
        0
      ); // Set cursor at end of text

      if (suggestions[selectedSuggestionIndex]) {
        setsearch((val) => ({ ...val, title, location, isRemote }));

        const params = {};
        if (titleToSet) params.title = suggestions[selectedSuggestionIndex];
        if (location) params.location = location;
        if (isRemote) params.isRemote = isRemote;

        const queryParams = new URLSearchParams(params).toString();

        navigate(`/jobs?${queryParams}`);
      } else {
        setsearch((val) => ({ ...val, title: title }));
        // Navigate to jobs with selected title and location
        const params = {};
        if (titleToSet) params.title = titleToSet;
        if (location) params.location = location;
        if (isRemote) params.isRemote = isRemote;

        const queryParams = new URLSearchParams(params).toString();

        navigate(`/jobs?${queryParams}`);
      }
    }
  };
  const handleKeyDownLocation = (e) => {
    const suggestions = country?.data?.suggestions || [];

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

      if (locationToSet) {
        setLocation(locationToSet);

        setsearch((val) => ({ ...val, location: locationToSet }));
        navigate(`/jobs?${queryParams}`);
      }
      setshow({ ShowtitleSuggestions: false });
      setSelectedSuggestionIndexLocation(-1);
      setTimeout(
        () =>
          titleInputRef.current.setSelectionRange(
            location.length,
            location.length
          ),
        0
      ); // Set cursor at end of text

      if (suggestions[selectedSuggestionIndexLocation]) {
        setsearch((val) => ({
          ...val,
          location: suggestions[selectedSuggestionIndexLocation],
        }));

        const params = {};
        if (title) params.title = title;
        if (location)
          params.location = suggestions[selectedSuggestionIndexLocation];
        if (isRemote) params.isRemote = isRemote;

        const queryParams = new URLSearchParams(params).toString();

        navigate(`/jobs?${queryParams}`);
      } else {
        setsearch((val) => ({ ...val, location: location }));
        const params = {};
        if (title) params.title = title;
        if (location) params.location = location;
        if (isRemote) params.isRemote = isRemote;

        const queryParams = new URLSearchParams(params).toString();

        navigate(`/jobs?${queryParams}`);
      }
    }
  };

  // job location suggestion
  const handlelocationselectedSuggestions = (selectLocationSuggestion) => {
    setsearch((val) => ({ ...val, location: selectLocationSuggestion }));
    const params = {};
    if (title) params.title = title;
    if (selectLocationSuggestion) params.location = selectLocationSuggestion;
    if (isRemote) params.isRemote = isRemote;

    const queryParams = new URLSearchParams(params).toString();

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
    setsearch((val) => ({ ...val, title: selectedSuggestion }));
    const params = {};
    if (selectedSuggestion) params.title = selectedSuggestion;
    if (location) params.location = location;
    if (isRemote) params.isRemote = isRemote;

    const queryParams = new URLSearchParams(params).toString();

    navigate(`/jobs?${queryParams}`);
  };
  return (
    <div
      className={`flex-col    md:flex sm:flex-row py-3 px-3   md:gap-4 bg-blurr-bg   top-0 
    
    `}
    >
      <div className="text-sm w-full">
        <p className="text-white"> Job Title </p>
        <div className="">
          <div
            className={`flex items-center rounded-md bg-white px-2 relative `}
          >
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
        </div>
        <div className="relative">
          {data?.data?.suggestions?.length > 0 && ShowtitleSuggestions && (
            <div className="absolute   min-h-10 max-h-52   overflow-y-auto   md:top-3 md:w-72 p-2 ps-4  w-full z-[99] bg-white shadow-2xl rounded-md py-6">
              <div className="relative w-full">
                {data?.data?.suggestions.length > 0 && !loadTitle ? (
                  data.data.suggestions.map((val, index) => (
                    <button
                      key={val}
                      onClick={() => handleSuggestionSelect(val)}
                      className={`flex w-full items-center cursor-pointer text-base gap-3 py-2 max-h-20 ${
                        index === selectedSuggestionIndex
                          ? "bg-slate-200"
                          : "hover:bg-slate-100"
                      }`}
                    >
                      <FaSearch />
                      <p className="text-left capitalize">{val}</p>
                    </button>
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
              <div className="absolute  md:top-3 w-full  md:w-72 p-2 ps-4 opacity-95 bg-white shadow-2xl rounded-md py-6  z-[99]">
                <div>
                  {country?.data?.suggestions?.length > 0 &&
                    !loadcountry &&
                    country.data.suggestions.map((val, index) => (
                      <button
                        key={val}
                        onClick={() => {
                          setLocation(val);
                          setshow({
                            ShowLocationsSuggestions: false,
                          });
                          handlelocationselectedSuggestions(val);
                        }}
                        className={`flex items-center cursor-pointer text-base gap-3 py-2 w-full hover:bg-gray-200 max-h-20 ${
                          index === selectedSuggestionIndexLocation
                            ? "bg-slate-200"
                            : "hover:bg-slate-100"
                        }`}
                      >
                        <FaSearch />
                        <p className="text-left capitalize">{val}</p>
                      </button>
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

export default JObSearch;
