import { useEffect, useState } from "react";
import Select from "react-select";
import { useGetCountries } from "../Services/General/useGetCountries";
import { MdOutlineDeleteOutline } from "react-icons/md";

const CountryStateCityZipcode = ({
  values,
  setFieldValue,
  setsymbol,
  errors,
  touched,
}) => {
  const {
    data: Countries,
    isLoading: countryLoading,
    isError: countryError,
  } = useGetCountries();
  const [countrySelected, setCountrySelected] = useState("");
  const [statesData, setStatesData] = useState([]);
  const [citiesData, setCitiesData] = useState([]);

  useEffect(() => {
    if (countrySelected) {
      const selectedCountry = Countries?.data?.find(
        (val) => val?.Country_name === countrySelected
      );
      setsymbol(selectedCountry ? selectedCountry : []); // Set states based on the filtered result
    }
  }, [countrySelected]);
  // Handle changes for dynamic addresses
  const handleChangeCountry = (index, selectedCountry) => {
    setsymbol(countrySelected);

    setCountrySelected(selectedCountry.value);
    setStatesData(getStatesForCountry(selectedCountry.value)); // Fetch or filter states
    setCitiesData([]); // Reset cities when country changes
    setFieldValue(`addresses[${index}].country`, selectedCountry.value);
    setFieldValue(`addresses[${index}].state`, ""); // Reset state
    setFieldValue(`addresses[${index}].city`, ""); // Reset city
    setFieldValue(`addresses[${index}].zip_code`, ""); // Reset zip
  };

  const handleChangeState = (index, selectedState) => {
    setFieldValue(`addresses[${index}].state`, selectedState.value);
    setCitiesData(getCitiesForState(selectedState.value)); // Fetch or filter cities
    setFieldValue(`addresses[${index}].city`, ""); // Reset city
    setFieldValue(`addresses[${index}].zip_code`, ""); // Reset zip
  };

  const handleChangeCity = (index, selectedCity) => {
    setFieldValue(`addresses[${index}].city`, selectedCity.value);
  };

  const handleRemoveAddress = (index) => {
    setFieldValue(
      "addresses",
      values.addresses.filter((_, i) => i !== index)
    );
  };
  const handleZipCodeChange = (index, e) => {
    const { value } = e.target;

    if (value.startsWith(" ")) {
      return; // Don't update the field if it starts with a space
    }
    setFieldValue(`addresses[${index}].zip_code`, value);
  };

  const getStatesForCountry = (country) => {
    // This should come from your API or data source
    const countryData = Countries?.data?.find(
      (item) => item.Country_name === country
    );
    return countryData ? countryData.states : [];
  };

  const getCitiesForState = (state) => {
    // This should come from your API or data source
    const selectedState = statesData.find((item) => item.state_name === state);
    return selectedState ? selectedState.cities : [];
  };

  const handlezipcode = (e) => {
    const { name } = e.target;

    if (name === "zip_code") {
      const allowedChars = /^[a-zA-Z0-9]$/; // Regex to check for alphanumeric characters

      // Allow Backspace, Delete, and Arrow keys for editing
      const isEditingKey =
        e.key === "Backspace" ||
        e.key === "Delete" ||
        e.key === "ArrowLeft" ||
        e.key === "ArrowRight" ||
        e.key === "ArrowUp" ||
        e.key === "ArrowDown";

      // If the key is not alphanumeric and not an editing key, prevent the input
      if (!allowedChars.test(e.key) && !isEditingKey) {
        e.preventDefault();
      }
    }
  };
  return (
    <div>
      {values?.addresses?.map((address, index) => (
        <div
          key={index}
          className="flex flex-col md:flex-row w-full gap-2 items-end"
        >
          <div className="w-full">
            <div className="flex w-full gap-2">
              <div className="w-full">
                <div className="flex items-center gap-1">
                  <label htmlFor={`country${index}`}>Country </label>

                  {touched?.addresses?.[index]?.country &&
                    errors?.addresses?.[index]?.country && (
                      <div className="text-red-600 text-sm mt-1 font-semibold">
                        {errors?.addresses?.[index]?.country}
                      </div>
                    )}
                </div>
                <div
                  className={`w-full  bg-gray-200 ${
                    touched?.addresses?.[index]?.country &&
                    errors?.addresses?.[index]?.country
                      ? " border border-red-600"
                      : ""
                  }`}
                >
                  <Select
                    className="w-full outline-none"
                    placeholder="Country"
                    
                    options={Countries?.data?.map((option) => ({
                      value: option.Country_name,
                      label: option.Country_name,
                    }))}
                    onChange={(selected) =>
                      handleChangeCountry(index, selected)
                    }
                    value={
                      address.country
                        ? { value: address.country, label: address.country }
                        : null
                    }
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="flex items-center gap-1">
                  <label htmlFor={`state${index}`}>State</label>

                  {touched?.addresses?.[index]?.state &&
                    errors?.addresses?.[index]?.state && (
                      <div className="text-red-600 text-sm mt-1 font-semibold">
                        {errors?.addresses?.[index]?.state}
                      </div>
                    )}
                </div>
                <div
                  className={`w-full  bg-gray-200 ${
                    touched?.addresses?.[index]?.state &&
                    errors?.addresses?.[index]?.state
                      ? " border border-red-600"
                      : ""
                  }`}
                >
                  <Select
                    className="w-full"
                    options={statesData?.map((state) => ({
                      value: state.state_name,
                      label: state.state_name,
                    }))}
                    placeholder={"State"}
                    onChange={(selected) => handleChangeState(index, selected)}
                    value={
                      address.state
                        ? { value: address.state, label: address.state }
                        : null
                    }
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="flex items-center gap-1">
                  <label htmlFor={`city${index}`}>City </label>

                  {touched?.addresses?.[index]?.city &&
                    errors?.addresses?.[index]?.city && (
                      <div className="text-red-600 text-sm mt-1 font-semibold">
                        {errors?.addresses?.[index]?.city}
                      </div>
                    )}
                </div>
                <div
                  className={`w-full  bg-gray-200 ${
                    touched?.addresses?.[index]?.city &&
                    errors?.addresses?.[index]?.city
                      ? " border border-red-600"
                      : ""
                  }`}
                >
                  <Select
                    className="w-full"
                    placeholder="City"
                    options={citiesData?.map((city) => ({
                      value: city,
                      label: city,
                    }))}
                    onChange={(selected) => handleChangeCity(index, selected)}
                    value={
                      address.city
                        ? { value: address.city, label: address.city }
                        : null
                    }
                  />
                </div>
              </div>

              <div className="w-full">
                <div className="flex items-center gap-1">
                  <label htmlFor={`zip_code${index}`}>Zip Code</label>

                  {touched?.addresses?.[index]?.zip_code &&
                    errors?.addresses?.[index]?.zip_code && (
                      <div className="text-red-600 text-sm mt-1 font-semibold">
                        {errors?.addresses?.[index]?.zip_code}
                      </div>
                    )}
                </div>
                <input
                  type="text"
                  name="zip_code"
                  maxLength={16}
                  placeholder="Zip Code"
                  value={address.zip_code}
                  onKeyDown={handlezipcode}
                  onChange={(e) => handleZipCodeChange(index, e)}
                  className={`w-full  bg-gray-200 p-3 ${
                    touched?.addresses?.[index]?.zip_code &&
                    errors?.addresses?.[index]?.zip_code
                      ? " border border-red-600"
                      : ""
                  }`}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center">
            {values?.addresses?.length !== 1 && (
              <button
                type="button"
                onClick={() => handleRemoveAddress(index)}
                className="bg-red-600 text-white p-2 rounded"
              >
                <MdOutlineDeleteOutline />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CountryStateCityZipcode;
